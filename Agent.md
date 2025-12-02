# Project Overview

This project is a 2D vertical shooter game like Raiden. The player controls a craft and fires at enemies from bottom to top. Each level contains a title based map where a tile-based map is used to represent the environment. The tile-based map would scroll at a constant speed from bottom to top. Each level should be about 5 minutes long. The player craft is an pixel art that is 32x32 pixels in size. It can shoot bullets of various disperse patterns. See the Player design section for details.

# Game design

## Player design
 - Player has 3 lives
 - Player can move the craft using 4 arrow keys in all 4 directions
 - Player can shoot using the space key
 - Player can use "bomb" using the "Enter" key. Player starts with 3 "bombs" that allows them to use special move. When the bomb is used, a full screen cluster bomb animation is rendered and all enemies on screen are destroyed.
 - When player is hit by a bullet, the craft explodes and player loses a life. Only after the explosion animation finishes and with 1 second delay, a new craft would be spawned at the bottom of the screen. The bomb count is reset to initial state. If player runs out of lives, the game transitions to "GameOver" state.

### Player weapon design
 - Player starts with a basic weapon that shoots two bullets from each wing that fly straight ahead 
 - There are 3 additional weapon power up levels:
  - Powerup Level 1: shoots 4 bullets from each wing that fly straight ahead
  - Powerup Level 2: shoots 6 bullets from each wing that radiate outwards
  - Powerup Level 3: shoots 10 bullets from each wing that 4 fly straight ahead and 3 on each side radiating outwards 


## Enemy design
 - 2 types of enemies. 
 - Enemy 1 is a fast moving enemy that shoots bullets at random intervals
 - Enemy 2 is a slow moving enemy that shoots bullets in a straight line
 - Each enemy has different movement patterns
 - All the enemy would be destroyed by a single bullet
 - Each enemy would show an explosion animation upon death

## Level design
 - 3 levels
 - First level is over a jungle / island 
 - Second level is over a steampunk city
 - Third level is over a space station

## Sound design
 - Background music
 - Shooting sound
 - Explosion sound
 - Special move sound

## HUD design
 - Show # of lives left
 - Show # of bombs left
 - Show score

## Power up
 - Through out the level, at fixed location, a power up would spawn and move across the screen
 - When the player collides with the power up, the power up would disappear and the player's weapon level would increase by one
 - The player would earn score from power up
 - If the player is already at maximum power level, the power up would give player an extra life

# Technology

This project is a web application built using TypeScript, HTML and CSS. It is built using Vite. 
Do not use any framework like React, only TypeScript, Canvas and browser's builtin APIs.
You can use assets like PNG for sprite sheets and assets like audio files for sound effects.
You should generate a sprite sheet for all the different tiles for the tile-based map, and the create an array on which tile to use for each of the position on the map to make a coherent and interesting tile-based map.

# Struccture

The game is structured as a state machine, and it contains the following states:
 - Attract: in this state, the user has not entered any input and javascript cannot access various hardware context yet. Once the user has entered input, the game will transition to the "Playing" state.
 - PlayerSelect: in this state, user would choose from 1 out of the 3 available craft. Once the user has made the selection, the game will transition to "StageIntro" state. 
 - StageIntro: this is an non-interactive state where we will play an animated sequance of the craft launching into play area and showcase the general art style of the stage.
 - Playing: this is the main playable state where the main game play would take place.
 - StageClear: this is an non-interactive stage where we will show the player's score and the next stage button. This would transition to "StageIntro" state for the next stage.
 - GameOver: this is an non-interactive stage where we will show the player's final score and the game over button. On an input, this would transition to "Attract" state. Player would enter this state when all the lives are lost.


# Coding Styles

- Avoid using magic numbers, use appropriately named constants instead. If the variable is not shared, put it in the top of the same file. Only put in a constant file if it is shared in multiple files.