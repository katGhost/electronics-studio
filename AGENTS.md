# AGENTS.md — Virtual Robotics Workshop

## 1. Project overview

This is a virtual robotics workshop built in **Snap Lens Studio** for **SPECS 27**. It teaches beginners ESP32 fundamentals and basic electronics through interactive 3D components, guided lessons, and a simulated circuit-building exercise.

The project is entirely virtual:
- The user does not have a physical ESP32 board.
- Do not add physical-device integration, firmware upload, or hardware connectivity.
- Circuit behaviour is simulated in the Lens; it is not a full electrical-physics simulation.

The current MVP should deliver one complete, understandable learning experience: identify ESP32 pins and build a working virtual LED circuit.

## 2. Current project state

### Confirmed from the current Scene hierarchy

The scene contains:
- `Camera Object`
- `Lighting`
- `SpectaclesInteractionKit`
  - `[REQUIRED] Core`
  - `[OPTIONAL] Visuals`
    - `HandVisuals`
    - `InteractorCursors`
- `VirtualRoboticsWorkshop`
  - `ESP32_Board`
  - `Breadboard`
  - `GPIO2_Pin`
  - `GND_Pin`
  - `Resistor`
  - `LED`
  - jumper-wire objects (visible names are truncated in the screenshot; inspect the actual hierarchy)
  - `LessonCard`
  - `LessonTitle`
  - `LessonInstruction`
  - `PinLegend`
  - `CircuitFlow`
  - `electronics_components` (expand and inspect before making assumptions)
- `AIPreviewAgent Handler`

### Confirmed script assets

The Asset Browser contains:
- `RoboticsWorkshopMain`
- `TapInteraction`

Their current implementation and attachment points are unknown. **No working user-facing functionality has been confirmed.** Inspect both scripts and their component attachments before changing or replacing them. Do not assume their names mean their intended behaviour is implemented.

### Confirmed materials/assets

Visible assets include:
- `BreadboardMaterial`
- `ESP32BlueMaterial`
- `GroundBlackMaterial`
- `JumperBlackMaterial`
- `JumperGreenMaterial`
- `LEDRedMaterial`
- `PinGreenMaterial`
- `ResistorOrangeMaterial`
- `Scene`
- `text_3d` and several `Text3D` assets

The project also includes an imported `electronics_components` asset/model collection. A Sketchfab electronics-components model was supplied as an asset reference:
https://sketchfab.com/3d-models/electronics-components-2d438fc3577a46f3ab7ad0bf88ab9f32

Do not assume the imported collection's internal object names, topology, pivots, or hierarchy. Inspect the actual Lens Studio assets.

## 3. Platform and technical constraints

- Target: **SPECS 27** in Lens Studio.
- Existing packages: **Spectacles Interaction Kit 2.0** and **Spectacles UIKit 2.0** (verify installed versions in the project before changing packages).
- Preserve the existing `SpectaclesInteractionKit` setup.
- Use the project's existing Lens Studio scripting conventions and APIs. Inspect package examples and existing code before implementing interactions.
- Do not substitute `AiPreviewAgent` for Spectacles Interaction Kit input.
- Test changes in the SPECS 27 preview where practical.
- Keep implementation lightweight. The development laptop has limited CPU/GPU capacity, so avoid unnecessary high-poly assets, large textures, expensive per-frame work, and excessive scene objects.

## 4. Primary product goal

Build the first lesson as a functional sequence:

1. **Identify the ESP32**
   - Learner can select the ESP32 board and relevant pins.
   - Selecting a pin displays its name, function, and a short beginner-friendly explanation.
   - At minimum, teach GPIO2, GND, and 3.3V if a corresponding 3D pin/object is present. Do not invent a 3D object for a pin that does not exist; use a clear UI explanation or ask before adding assets.

2. **Identify the electronic components**
   - Learner can select the breadboard, LED, resistor, and jumper wires.
   - Show each component's name, purpose, and relevant beginner-level guidance.
   - Explain LED anode/cathode and why a resistor is needed.

3. **Build the virtual circuit**
   - Support a clear, learnable connection sequence.
   - Intended logical circuit: `GPIO2 → resistor → LED anode`; `LED cathode → GND`.
   - Use the existing 3D jumper-wire assets where possible.
   - The learner should receive feedback for correct and incorrect connections.
   - Define connections through explicit logical endpoints/identifiers, not fragile visual-name guessing.

4. **Validate and simulate**
   - Validate that the required connections exist and are connected to the correct endpoints.
   - When the circuit is valid and the simulated GPIO2 output is set HIGH, illuminate the LED.
   - When the output is LOW or the circuit is invalid, the LED should be off.
   - Clearly communicate validation results and the reason for an incorrect circuit.

5. **Complete the lesson**
   - Provide a simple completion state or knowledge check.
   - Keep the learner informed about what to do next.

This is a deterministic educational simulation, not a SPICE-like circuit simulator. Do not attempt to model current, voltage drop, or electrical behaviour beyond what is needed to teach the intended concept accurately.

## 5. Implementation priorities

Work in this order unless inspection reveals a blocking dependency:

### P0 — Inspect before editing
- Inspect `RoboticsWorkshopMain` and `TapInteraction`.
- Identify their attached Scene Objects and required script inputs.
- Inspect the actual hierarchy under `VirtualRoboticsWorkshop` and `electronics_components`.
- Identify which objects are meshes, which are scripts, and which are UI elements.
- Determine how the current project handles tap/pinch selection using the installed SIK version.
- Report findings and propose the smallest implementation plan before broad changes.

### P1 — Component identification
- Implement reliable selection of the ESP32 board, pins, breadboard, LED, resistor, and wires.
- Connect selection to the existing lesson UI objects where appropriate.
- Display concise contextual information.
- Make selection feedback visible without changing the overall workshop layout.

### P2 — Circuit interaction
- Implement the minimum interaction needed to connect the supplied components.
- Track connection state explicitly.
- Validate correct and incorrect wiring.
- Provide actionable learner feedback.

### P3 — LED simulation and lesson completion
- Drive the LED's visible state from the simulated circuit and GPIO output.
- Add a simple completion/knowledge-check state.
- Test the entire lesson from start to finish.

### Deferred
- Workbench position, scene alignment, and overall spatial layout.
- Lesson panel distance, orientation, and placement.
- Decorative environment improvements.
- Additional lessons, soldering activities, robotics assembly, multiplayer, accounts, backend services, or runtime AI tutor.

Do not start deferred work unless explicitly requested.

## 6. Interaction and implementation rules

- Prefer the existing SIK interaction model and installed package components over custom hand-tracking/input code.
- Reuse existing scene objects, materials, UI and scripts when they are suitable.
- Inspect before creating duplicates.
- Keep the implementation modular enough to debug, but do not introduce an unnecessary framework or elaborate architecture.
- Keep business/lesson logic separate from low-level input handling where this can be achieved simply.
- Use explicit component identifiers and connection state rather than relying only on object display names.
- Make UI feedback concise and readable.
- Preserve model proportions, geometry, materials, textures, and existing object hierarchy unless a change is required for functionality.
- Do not destructively optimize or replace GLB geometry without approval.
- Do not hardcode new world-space layout positions as part of functionality work.
- Avoid unrelated refactors and dependency changes.

## 7. Agent workflow and change discipline

For every task:

1. Inspect the relevant scripts, objects, and package APIs first.
2. State the specific files/objects that need changing and why.
3. Make the smallest coherent change that completes the task.
4. Do not modify unrelated scene objects or assets.
5. Report all files and scene objects changed.
6. Explain any setup the user must perform manually in Lens Studio.
7. Identify what was tested and what remains unverified.

Before substantial changes:
- Check the current Git status.
- Preserve existing user work.
- Do not discard, reset, or overwrite user changes.
- Prefer a focused commit after a working milestone.

Do not have multiple agents edit the same files or scene at the same time. Assign each agent a clearly bounded task, review its diff, test the result, and commit before handing work to another agent.

## 8. Definition of done for the MVP

The MVP is functionally complete when a learner can, in SPECS 27 preview:

- Select the ESP32 and identify the relevant pins.
- Select the LED, resistor, breadboard, and jumper wires and understand their purpose.
- Complete the intended GPIO2-to-LED-to-GND circuit using the virtual components.
- Receive clear feedback when connections are wrong.
- Get a successful validation when the circuit is correct.
- Toggle the simulated GPIO output and see the LED turn on/off.
- Complete the first lesson without relying on physical hardware.

A visually polished workshop without these interactions is not considered complete.
