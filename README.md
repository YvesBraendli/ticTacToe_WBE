# Connect 4
## General
As part of the WBE module (fall semester 2022), we implemented the game "connect 4"/"vier gewinnt" as a javascript/HTML application hosted on GitHub pages. The game can be accessed [here](https://github.zhaw.ch/pages/kindltri/connect4/).

## Rules
The goal of this game is to align four pieces of the same color in horizontal, vertical or diagonal order. The first player who achieves this first, is the winner.

## Functionality

### Saving and loading
It is possible to save the current state of the game in the local browser cache. Additionaly, we implemented the logic to store the game state to another server. However, the latter is not possible because external express server must be started and configured (the respective code should work though). 

### Undo and new game
Furthermore it is possible to undo every move, even for a loaded game from an earlier session. Of course, it is also possible to just start a new game.

### Notifications
Above the game board, it is indicated which player's turn it is and also which player has won the game, if this is the case (checked after each turn). When a winner is determined, the current game can no longer be played, but all buttons are still functional.

## Group
Tristan Kindle and Yves Brändli worked together on this project.
