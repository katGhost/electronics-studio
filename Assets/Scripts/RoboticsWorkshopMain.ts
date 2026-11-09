import {TapInteraction} from "./TapInteraction";

type PartId = "esp32" | "gpio2" | "gnd" | "resistor" | "led";

interface PartInfo {
    id: PartId;
    objectName: string;
    displayName: string;
    functionLabel: string;
    explanation: string;
    legend: string;
    colliderSize: vec3;
}

@component
export class RoboticsWorkshopMain extends BaseScriptComponent {
    private readonly parts: PartInfo[] = [
        {
            id: "esp32",
            objectName: "ESP32_Board",
            displayName: "ESP32",
            functionLabel: "Microcontroller board",
            explanation:
                "This is the ESP32 — the brain of your project. Programs run on this board and use its pins to talk to LEDs, sensors, and other parts.",
            legend: "ESP32 = the board that runs your code and drives the pins",
            // BoxShape.size is local to the SceneObject; compensate for its scale.
            colliderSize: new vec3(2, 6, 2),
        },
        {
            id: "gpio2",
            objectName: "GPIO2_Pin",
            displayName: "GPIO2",
            functionLabel: "Digital I/O pin",
            explanation:
                "GPIO2 is a general-purpose pin. Your code can set it HIGH (on) or LOW (off) to control things like an LED. The green marker helps you find it.",
            legend: "GPIO2 (green) = drive signal out to the circuit",
            colliderSize: new vec3(1.5, 1.5, 1.5),
        },
        {
            id: "gnd",
            objectName: "GND_Pin",
            displayName: "GND",
            functionLabel: "Ground / return path",
            explanation:
                "GND is ground — the return path for electric current. Every simple circuit needs a path back to GND, or nothing will work.",
            legend: "GND (black) = return path that completes the circuit",
            colliderSize: new vec3(1.5, 1.5, 1.5),
        },
        {
            id: "resistor",
            objectName: "Resistor",
            displayName: "Resistor",
            functionLabel: "Current-limiting component",
            explanation: "The resistor limits current through the LED and helps protect it from too much current.",
            legend: "Resistor = limits current before it reaches the LED",
            colliderSize: new vec3(1.5, 1.5, 1.5),
        },
        {
            id: "led",
            objectName: "LED",
            displayName: "LED",
            functionLabel: "Light-emitting diode",
            explanation: "An LED lets current pass in one direction. Its anode is the positive side; its cathode returns toward GND.",
            legend: "LED = anode faces the resistor; cathode returns to GND",
            colliderSize: new vec3(1.25, 1.25, 1.25),
        },
    ];

    private lessonTitle: Text3D | null = null;
    private lessonInstructions: Text3D | null = null;
    private pinLegend: Text3D | null = null;
    private circuitFlow: Text3D | null = null;

    private partById: {[key: string]: PartInfo} = {};
    private objectById: {[key: string]: SceneObject} = {};
    private baseMaterialById: {[key: string]: Material} = {};
    private highlightMaterialById: {[key: string]: Material} = {};
    private identified: {[key: string]: boolean} = {};
    private currentSelection: PartId | null = null;
    private currentLesson: number = 0;
    private readonly lessons: {title: string; instructions: string; part: PartId | null}[] = [
        {title: "Introduction to the ESP32", instructions: "The ESP32 is a microcontroller: the small computer that runs a program and controls connected components.", part: "esp32"},
        {title: "Understanding GPIO2", instructions: "GPIO2 is a digital input/output pin. A program can set it HIGH or LOW to control an external component such as an LED.", part: "gpio2"},
        {title: "Understanding GND", instructions: "GND is the circuit's shared ground and return path. A complete circuit needs a path from its output back to ground.", part: "gnd"},
        {title: "How the parts work together", instructions: "In a simple LED circuit, GPIO2 supplies the control signal through a current-limiting resistor and LED, then the path returns to GND.", part: null},
    ];
    private readonly circuitSequence: PartId[] = ["gpio2", "resistor", "led", "gnd"];
    private circuitProgress: number = 0;
    private ledLit: boolean = false;

    onAwake() {
        // Create TapInteraction during onAwake so its OnStartEvent still fires.
        this.resolveUi();
        this.prepareSelectables();
        this.createEvent("OnStartEvent").bind(() => {
            this.bindSelection();
            this.bindLessonNavigation();
            this.showLesson();
            this.updateCircuitFeedback();
        });
    }

    private resolveUi() {
        const root = this.getSceneObject();
        this.lessonTitle = this.getText3D(this.findByName(root, "LessonTitle"));
        // Scene object is named LessonInstructions (plural)
        this.lessonInstructions =
            this.getText3D(this.findByName(root, "LessonInstructions")) ||
            this.getText3D(this.findByName(root, "LessonInstruction"));
        this.pinLegend = this.getText3D(this.findByName(root, "PinLegend"));
        this.circuitFlow = this.getText3D(this.findByName(root, "CircuitFlow"));
        this.showIntro();
    }

    private prepareSelectables() {
        const root = this.getSceneObject();
        for (const part of this.parts) {
            this.partById[part.id] = part;
            const target = this.findByName(root, part.objectName);
            if (!target) {
                print("RoboticsWorkshopMain: missing object " + part.objectName);
                continue;
            }
            this.objectById[part.id] = target;
            this.ensureCollider(target, part.colliderSize);
            this.cacheBaseMaterial(part.id, target);

            let tap = target.getComponent(TapInteraction.getTypeName()) as TapInteraction;
            if (!tap) {
                tap = target.createComponent(TapInteraction.getTypeName()) as TapInteraction;
            }
        }
    }

    private bindSelection() {
        for (const part of this.parts) {
            const target = this.objectById[part.id];
            if (!target) continue;
            const tap = target.getComponent(TapInteraction.getTypeName()) as TapInteraction;
            if (!tap) continue;
            const partId = part.id;
            tap.setOnTap(() => this.selectPart(partId));
        }
        print("RoboticsWorkshopMain: pin identification ready");
    }

    private bindLessonNavigation() {
        const root = this.getSceneObject();
        const previous = this.findByName(root, "PreviousLessonButton");
        const next = this.findByName(root, "NextLessonButton");
        this.bindNavigationTarget(previous, () => this.navigateLesson(-1));
        this.bindNavigationTarget(next, () => this.navigateLesson(1));
        if (!previous || !next) {
            print("RoboticsWorkshopMain: add PreviousLessonButton and NextLessonButton scene objects to enable lesson navigation");
        }
    }

    private bindNavigationTarget(target: SceneObject | null, callback: () => void) {
        if (!target) return;
        let tap = target.getComponent(TapInteraction.getTypeName()) as TapInteraction;
        if (!tap) tap = target.createComponent(TapInteraction.getTypeName()) as TapInteraction;
        tap.setOnTap(callback);
    }

    private navigateLesson(direction: number) {
        const nextLesson = this.currentLesson + direction;
        if (nextLesson < 0 || nextLesson >= this.lessons.length) return;
        this.currentLesson = nextLesson;
        this.showLesson();
    }

    private showLesson() {
        const lesson = this.lessons[this.currentLesson];
        this.setText(this.lessonTitle, "Lesson " + (this.currentLesson + 1) + " of " + this.lessons.length + " | " + lesson.title);
        this.setText(this.lessonInstructions, lesson.instructions);
        if (this.currentSelection) this.clearHighlight(this.currentSelection);
        this.currentSelection = lesson.part;
        if (lesson.part) this.applyHighlight(lesson.part);
        this.setText(this.pinLegend, "Use the previous and next lesson controls to continue.");
    }

    private selectPart(id: PartId) {
        const part = this.partById[id];
        if (!part) return;

        if (this.currentSelection && this.currentSelection !== id) {
            this.clearHighlight(this.currentSelection);
        }

        this.currentSelection = id;
        this.identified[id] = true;
        this.applyHighlight(id);
        this.showPartInfo(part);
        this.advanceCircuit(id);
    }

    private advanceCircuit(id: PartId) {
        const expected = this.circuitSequence[this.circuitProgress];
        if (!expected) {
            if (id === "gpio2") this.resetCircuit();
            return;
        }
        if (id === expected) {
            this.circuitProgress++;
            if (this.circuitProgress === this.circuitSequence.length) this.setLedLit(true);
        } else if (this.circuitSequence.indexOf(id) >= 0) {
            this.setText(this.circuitFlow, "Not yet: select " + this.partById[expected].displayName + " next. Circuit progress is unchanged.");
            return;
        }
        this.updateCircuitFeedback();
    }

    private updateCircuitFeedback() {
        if (this.circuitProgress === this.circuitSequence.length) {
            this.setText(this.circuitFlow, "Circuit complete: GPIO2 → Resistor → LED → GND. LED lit. Select GPIO2 to reset.");
            return;
        }
        const next = this.partById[this.circuitSequence[this.circuitProgress]].displayName;
        this.setText(this.circuitFlow, "Circuit progress: " + this.circuitProgress + "/4. Select " + next + " next. Select GPIO2 after completion to reset.");
    }

    private resetCircuit() {
        this.circuitProgress = 0;
        this.setLedLit(false);
        this.updateCircuitFeedback();
    }

    private setLedLit(lit: boolean) {
        this.ledLit = lit;
        const led = this.objectById["led"];
        const visual = led ? led.getComponent("Component.RenderMeshVisual") as RenderMeshVisual : null;
        const base = this.baseMaterialById["led"];
        if (!visual || !base) return;
        if (!lit) {
            visual.mainMaterial = this.currentSelection === "led" ? this.highlightMaterialById["led"] : base;
            return;
        }
        const litMaterial = base.clone();
        const color = base.mainPass.baseColor as vec4;
        litMaterial.mainPass.baseColor = new vec4(1, Math.min(color.g * 1.7 + 0.3, 1), Math.min(color.b * 1.7 + 0.3, 1), color.a);
        this.highlightMaterialById["led"] = litMaterial;
        visual.mainMaterial = litMaterial;
    }

    private showIntro() {
        this.setText(this.lessonTitle, "LESSON 1  |  Identify ESP32 Pins");
        this.setText(
            this.lessonInstructions,
            "Pinch the ESP32 board, then GPIO2 and GND to learn each one's name and job.",
        );
        this.setText(
            this.pinLegend,
            "Green marker = GPIO2    Black marker = GND    Blue = ESP32 board",
        );
    }

    private showPartInfo(part: PartInfo) {
        this.setText(this.lessonTitle, "Lesson " + (this.currentLesson + 1) + " of " + this.lessons.length + " | " + part.displayName + "  |  " + part.functionLabel);
        this.setText(this.lessonInstructions, part.explanation + "  " + this.lessons[this.currentLesson].instructions);
        this.setText(this.pinLegend, part.legend);

        if (this.identified["gpio2"] && this.identified["gnd"] && this.identified["esp32"]) {
            this.setText(
                this.pinLegend,
                part.legend + "  ·  Nice work — you identified the board and both pins.",
            );
        }

        print("Selected " + part.displayName + ": " + part.functionLabel);
    }

    private ensureCollider(target: SceneObject, size: vec3) {
        let collider = target.getComponent("Physics.ColliderComponent") as ColliderComponent;
        if (!collider) {
            collider = target.createComponent("Physics.ColliderComponent") as ColliderComponent;
        }
        const shape = Shape.createBoxShape();
        shape.size = size;
        collider.shape = shape;
    }

    private cacheBaseMaterial(id: PartId, target: SceneObject) {
        const visual = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (visual && visual.mainMaterial) {
            this.baseMaterialById[id] = visual.mainMaterial;
        }
    }

    private applyHighlight(id: PartId) {
        const target = this.objectById[id];
        const base = this.baseMaterialById[id];
        if (!target || !base) return;
        const visual = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (!visual) return;

        let highlight = this.highlightMaterialById[id];
        if (!highlight) {
            highlight = base.clone();
            this.highlightMaterialById[id] = highlight;
        }
        const color = base.mainPass.baseColor as vec4;
        highlight.mainPass.baseColor = new vec4(
            Math.min(color.r * 1.45 + 0.15, 1),
            Math.min(color.g * 1.45 + 0.15, 1),
            Math.min(color.b * 1.45 + 0.15, 1),
            color.a,
        );
        visual.mainMaterial = id === "led" && this.ledLit ? this.highlightMaterialById[id] : highlight;
    }

    private clearHighlight(id: PartId) {
        const target = this.objectById[id];
        const base = this.baseMaterialById[id];
        if (!target || !base) return;
        const visual = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
        if (!visual) return;
        visual.mainMaterial = id === "led" && this.ledLit ? this.highlightMaterialById[id] : base;
    }

    private getText3D(obj: SceneObject | null): Text3D | null {
        if (!obj) return null;
        return obj.getComponent("Component.Text3D") as Text3D;
    }

    private setText(text3d: Text3D | null, value: string) {
        if (text3d) {
            text3d.text = value;
        }
    }

    private findByName(parent: SceneObject, name: string): SceneObject | null {
        if (parent.name === name) return parent;
        for (let i = 0; i < parent.getChildrenCount(); i++) {
            const found = this.findByName(parent.getChild(i), name);
            if (found) return found;
        }
        return null;
    }
}
