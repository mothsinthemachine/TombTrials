# Tomb Trials Game Design Document

Author: Jake Sherwood ([Moths in the Machine on GitLab](https://gitlab.com/mothsinthemachine)) \
Target platform: Itch.io \
Engine: Godot v4.2

## Object Structure

- Game Manager (code that is not modified by the user)
	- Cutscene Manager
	- TODO: Input Controller 
- Global (code that is modified by the user, i.e. Settings)
- Main
	- Map
	- Map Objects
		- Actors
			- Player (Avatar)
			- Non-playable Characters (NPCs)
		- Inanimate objects
			- Treasure chests
			- Wall Torches

## Game Manager

Autoload singleton.

- Stores paths to key scenes, such as `avatar.tscn`.
- Initializes starting position and direction for `Avatar`.
- Currency name ("qil") and starting money.
- Stores `CutsceneManager` as a child node, handing off cutscenes passed off to GameManager to this child node using `func play_cutscene()`.
	- Normally, cutscenes are an array of events, but if a single cutscene is passed into it, have it converted into an array of one event.
- Handles input that is not direction related. (Movement for Avatar is handled in Avatar.)

## Handling movement of Map Objects

The movement of Map Objects should be handled both synchronously and asynchronously. Asynchronous behavior can be handled using signals in Godot. 

The goal is to design a classic-JRPG style of movement. Map objects should move freely in tile spaces that are open. Encountering a wall would keep the map object in place on the same tile space. Encountering another object would yield to that other object until it has vacated the tile space. In this short span of time, the player can either wait until the object has moved or press a different direction.

Algorithm for player movement:
```
process per frame (60 frames per sec):
	if moving:
		update position (direction and speed)
		if aligned:
			set moving to false
			release previous position from reserved list
			release current position from reserved list
		else:
			return	// Try again next frame,
					// the rest of the code is skipped.
	
	check input
	if no input detected:
		check next position for collision
		if collision:
			return			// try again next frame
		else:
			check next position for reservation
			if collision:
				return		// try again next frame
		
		// getting this far means there were no collisions
		
		get input speed
		set moving to true
		reserve current position	// So other objects know 
									// we're moving from here

		reserve next position		// so others objects know 
									// we're moving to here
		
		move to next position
```



