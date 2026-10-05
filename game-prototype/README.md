# World Dominion game prototype

This directory contains a playable strategy-prototype built on top of the existing SVG world map library from this repository.

What it does:
- loads the SVG world map from `../src`
- lets the player click countries on the map
- displays country metadata such as region, army, economy and stability
- supports troop deployment and turn advancement
- creates a clean game UI suitable for later adaptation to Android/WebView

How to run:
1. Open the repository in a local web server, for example:
   - `python -m http.server 8000`
2. Visit:
   - `http://localhost:8000/game-prototype/`

This is a prototype and not yet a native Android app. It is intentionally structured so it can later be wrapped into Android WebView, Flutter WebView or a Unity port without rebuilding the core gameplay from scratch.

Next step:
- turn the prototype into a real tactical strategy loop
- add enemy AI
- add resource production and capture rules
- port the same architecture to Android/Unity
