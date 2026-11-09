import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

/**
 * SIK pinch/click wrapper for a scene object.
 * Creates a box collider + Interactable when missing.
 * Hand / Mouse / Mobile interactors all fire onTriggerStart — do not also bind TapEvent.
 */
@component
export class TapInteraction extends BaseScriptComponent {
    public onTap: Event<InteractorEvent> = new Event<InteractorEvent>();
    private interactable: Interactable;
    private initialized: boolean = false;
    private callback: ((event: InteractorEvent) => void) | null = null;

    onAwake() {
        let collider = this.getSceneObject().getComponent("Physics.ColliderComponent") as ColliderComponent;
        if (!collider) {
            collider = this.getSceneObject().createComponent("Physics.ColliderComponent") as ColliderComponent;
            const shape = Shape.createBoxShape();
            shape.size = new vec3(8, 8, 8);
            collider.shape = shape;
        }

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName()) as Interactable;
        if (!this.interactable) {
            this.interactable = this.getSceneObject().createComponent(Interactable.getTypeName()) as Interactable;
        }
        // targetingMode 3 = Direct + Indirect (see SIK Interactable)
        this.interactable.targetingMode = 3;

        this.createEvent("OnStartEvent").bind(() => {
            this.initializeInteraction();
        });
    }

    /** Replaces the selection listener, so repeated setup cannot accumulate callbacks. */
    public setOnTap(callback: (event: InteractorEvent) => void) {
        this.callback = callback;
        if (this.initialized) {
            this.onTap.remove(callback);
            this.onTap.add(callback);
        }
    }

    private initializeInteraction() {
        if (this.initialized) return;
        this.initialized = true;
        this.interactable.onTriggerStart.add((event: InteractorEvent) => {
            this.onTap.invoke(event);
        });
        if (this.callback) this.onTap.add(this.callback);
    }
}
