# Playable Runner

Playable ad prototype made with **Cocos Creator 3.8.4**.

The player controls a running character and jumps over stones. The game ends after 5 successful obstacle passes or after the second collision.

## Demo

GitHub Pages:

https://necollaz.github.io/playable_runner/

## Gameplay

- The character runs along the road.
- The player can only jump.
- Tap anywhere on the gameplay area to jump.
- Obstacles spawn ahead with random but passable distance.
- If the character hits an obstacle:
    - first collision restarts the run;
    - second collision shows the final screen.
- After 5 successfully passed obstacles, the final screen appears.
- On the final screen, any tap redirects to the store link.

## Redirects

The project uses one redirect service for all redirect actions:

- iOS: https://www.apple.com/app-store/
- Android: https://play.google.com/store/games
- Default: https://play.google.com/store/games

Redirect is triggered by:

- Logo button during gameplay;
- Install button during gameplay;
- Any tap on the final screen.

## Tech Stack

- Cocos Creator 3.8.4
- TypeScript
- Web Mobile build target

## Project Structure

```text
assets/
  animations/       Character animations: idle, run, jump
  materials/        Materials for character, road and obstacles
  models/           Character model
  prefabs/          Player, Stone and UI prefabs
  scenes/           Main scene
  scripts/
    core/           Camera logic
    gameplay/       Game flow, player, obstacles
    services/       Redirect logic
    ui/             HUD, final screen and adaptive UI
  sprites/          Logo and install button sprites
```

## How to Run

1. Open **Cocos Creator 3.8.4**.
2. Open this project folder.
3. Open the scene:

```text
assets/scenes/Main.scene
```

## GitHub Pages
The demo can be hosted through GitHub Pages.
Recommended setup:
1. Build the Cocos project as Web Mobile.
2. Put the final web build contents into:
```text
docs/
```
3. Push docs/ to GitHub.
4. Open repository settings on GitHub.
5. Go to Pages.
6. Select:Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
7. Save.
The project will be available at:
```text
https://necollaz.github.io/playable_runner/
```

## Requirements Checklist
- Character prefab is placed correctly on the road.
- Idle, run and jump animations are connected.
- Player can jump by tapping the screen.
- Repeated jump during jump is ignored.
- Obstacles spawn ahead of the player.
- Distance between obstacles is random and passable.
- Obstacles use pooling.
- Passed obstacles are removed.
- First collision restarts the game.
- Second collision shows the final screen.
- 5 passed obstacles show the final screen.
- Gameplay HUD is adaptive.
- Final screen is adaptive.
- Logo, install and final screen redirect correctly.