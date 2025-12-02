# Project Overview

This project is a vertical shooter game like Raiden. 

# Game design

## Player design
 - Player has 3 lives
 - Player can move the craft using 4 arrow keys in all 4 directions
 - Player can shoot using the space key
 - Player can use special move using the "Enter" key
 - Player starts with 3 "bombs" that allows them to use special move. Player can acquire more bombs during game play
 - Player can pause the game using the "p" key.
 - Player can resume the game using the "p" key while paused.

## Enemy design
 - 5 types of enemies
 - Each enemy has different movement patterns
 - Each enemy has different health
 - Each enemy has different score
 - Each enemy has different speed
 - Each enemy has different size
 - Each enemy has different color
 - Each enemy has different sprite

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

# Technology

This project is a web application built using TypeScript, HTML and CSS. It is built using Vite. 
Do not use any framework like React, only TypeScript, Canvas and browser's builtin APIs.
You can use assets like PNG for sprite sheets and assets like audio files for sound effects.

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