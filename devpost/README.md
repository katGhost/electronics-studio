# Robotics Workshop AR

An augmented-reality learning environment that introduces beginners to the ESP32 and basic electronics through a virtual robotics workshop.

> **Submission note:** The current implementation includes the virtual workshop and two working interactions, the GPIO2_Pin and the ESP32_Board.

## Demo

**YouTube demo:** `https://youtu.be/BTZRw7oxU3E`

**GitHub Repo URL** `https://github.com/katGhost/electronics-studio`

## What it does

Robotics Workshop AR presents a virtual electronics workbench containing an ESP32 development board and electronic components. It is designed to make introductory electronics concepts easier to explore in a spatial learning environment.

The project focuses on an introductory lesson around identifying the ESP32 and understanding the roles of its GPIO and ground pins.

## Who it's for

- Beginners learning electronics and microcontrollers
- Students exploring robotics
- People who want an accessible, visual introduction to ESP32-based projects

## What is demonstrated in this build

- A virtual robotics workshop environment in Lens Studio
- 3D ESP32 and electronic-component assets arranged in the workshop
- The working interactions demonstrated in the linked video
- An introductory ESP32 pin-identification lesson interface

**Scope clarification:** Some imported components are currently visual assets rather than functioning selectable objects. The demo clearly shows only interactions that have been verified in the final preview. **Using free tiered Agents contributed to limited functionality**

## What I learned

Building this project involved working with Lens Studio, 3D assets and scene hierarchies, TypeScript scripting, and Spectacles Interaction Kit. It also exposed practical challenges in making imported 3D models reliably interactive in an AR environment, particularly around collider placement and interaction targeting.

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
├── assets/
│   ├── screenshots/
│   └── supporting-materials/
└──
```

## Credits and asset attribution

List the source, creator, and licence for every third-party 3D model, texture, sound, or other asset used in the project. In particular, verify the attribution and licence requirements for any Sketchfab assets before submission.

- Asset/source: `electronics-components AND URL: https://sketchfab.com/3d-models/electronics-components-2d438fc3577a46f3ab7ad0bf88ab9f32`
- Creator: `Aficionado`
- Licence: `CC Attribution`

## Author

**Andries N Mogashoa** | Backend AI Engineer @FlyRankAI
