# Robotics Workshop AR

An augmented-reality learning environment that introduces beginners to the ESP32 and basic electronics through a virtual robotics workshop.

**Submission note:** The verified Lens Studio Preview build includes four guided lessons, lesson navigation, selectable electronic components, and an interactive virtual circuit demonstration.

## Demo

**YouTube demo:** [Watch the Robotics Workshop AR demo](https://youtu.be/BTZRw7oxU3E)

**GitHub repository:** [katGhost/electronics-studio](https://github.com/katGhost/electronics-studio)

## What it does

Robotics Workshop AR presents a virtual electronics workbench containing an ESP32 development board and electronic components. It is designed to make introductory electronics concepts easier to explore in a spatial learning environment.

The project guides learners through four short lessons: an introduction to the ESP32, understanding GPIO2, understanding GND, and how these components relate in a basic circuit. Previous and Next controls allow learners to navigate the lessons, while the lesson title displays the current lesson number and total.

Learners can also select components to view contextual information and visual highlighting. A guided circuit demonstration introduces the sequence GPIO2 -> Resistor -> LED -> GND. Completing the sequence in the correct order illuminates the virtual LED.

## Who it's for

- Beginners learning electronics and microcontrollers
- Students exploring robotics
- People who want an accessible, visual introduction to ESP32-based projects

## What is demonstrated in this build

- A virtual robotics workshop environment in Lens Studio
- A 3D ESP32 development board and electronic-component assets arranged in the workshop
- Selectable ESP32 board, GPIO2, GND, Resistor, and LED interaction targets
- Component highlighting and contextual information when an interaction target is selected
- Previous and Next lesson navigation, bounded at the first and last lessons
- Four guided lessons covering the ESP32, GPIO2, GND, and basic circuit relationships
- A virtual circuit sequence with progress feedback and validation
- LED illumination when the correct circuit sequence is completed

**Scope clarification:** This is a virtual educational demonstration. The circuit feature represents logical sequence and completion state through interactions and visual feedback. It does not connect to a physical ESP32, upload or execute firmware, or simulate real electrical behavior. Some imported 3D assets are used for visual presentation; generated scene objects serve as interaction targets.

### Interactive components

- ESP32 board
- GPIO2 pin
- GND pin
- Resistor
- LED

### Guided learning

- Four lessons: ESP32 introduction, GPIO2, GND, and basic circuit relationships
- Previous and Next lesson navigation
- Component selection, highlighting, and contextual information

### Virtual circuit demonstration

- Required sequence: GPIO2 -> Resistor -> LED -> GND
- Circuit progress feedback as each step is selected
- Incorrect or skipped steps do not complete the sequence
- The LED illuminates when the correct sequence is completed
- Repeated correct sequences work consistently
- Selecting GPIO2 after completion resets the sequence and restores the LED's original appearance

### Technical scope

- Snap Lens Studio and TypeScript
- Spectacles Interaction Kit (SIK) 2.0
- Virtual 3D electronics components
- Interaction-driven logical circuit-state demonstration

## What I learned

Building this project involved working with Lens Studio, 3D assets and scene hierarchies, TypeScript scripting, and Spectacles Interaction Kit. It also exposed practical challenges in making 3D assets reliably interactive in an AR environment, particularly around collider placement, interaction targeting, and the distinction between visual models and dedicated interaction targets.

## Built with

- Snap Lens Studio
- TypeScript
- Spectacles Interaction Kit (SIK) 2.0
- 3D model assets

## Repository contents

The repository contains the Lens Studio project and this `devpost/` folder with submission information and supporting media.

```text
devpost/
├── README.md
└── assets/
    ├── screenshots/
    │   ├──.gitkeep
    │   ├── Screenshot 2026-11-09 at 7.41.40PM LensStudio-5.23.2.png
    │   └── Screenshot 2026-11-09 at 7.41.56PM LensStudio-5.23.2.png
    └── supporting-materials/
        ├──.gitkeep
        ├── electronics_components.glb
        └── Robotics Workshop AR_ Learn, Explore, Build.png
```

## Credits and asset attribution

Third-party assets are credited according to their original licences. You can verify the attribution and licence requirements for every third-party asset.

- **Asset:** [Electronics Components – Sketchfab](https://sketchfab.com/3d-models/electronics-components-2d438fc3577a46f3ab7ad0bf88ab9f32)
- **Creator:** Aficionado
- **Licence:** CC Attribution

## Author

**Andries N Mogashoa** | Backend AI Engineer @FlyRankAI
