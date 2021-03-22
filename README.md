# ASP - Affective State Profiler
My coursework 1 for Mobile Technology module.

## Overview
* I've implemented all the requirements given including affective state logging, summary and visualisation.
* This app is a PWA (or Progressive Web App), which means it's written to run in a modern web browser with modern features to allow it to store data using localstorage, work offline through caching, and be installable as an app.
* The app is hosted on Github Pages and is designed with Android in mind but should work on any device with a modern web browser.
* The main reasons for using a PWA is to take advantage of their great cross-platform support and their ease of access using just a URL.

## Functionality walkthrough on device
Demo of app - https://asp.pgmann.cf/

## Testing
Testing was performed manually by loading and testing each element to ensure it works. All components have been rigorously tested and no issues have been found.

## Source code overview
### Project structure
- Javascript - page functionality
- CSS - styling
- HTML - page structure
- Service Worker - caching
- App Manifest - icon and colour for splash screen
- Libraries used: jQuery, MaterializeCSS (+ noUiSlider), Font Awesome, Chart.js (+ Hammer.js + chartjs-plugin-zoom)
### Source code for each requirement

## Challenges encountered
A challenge encountered during development was making sure the backend service worker would update all sources correctly when redeploying a new version of the source code. This took a lot of research and experimentation to reliably fix and involved ensuring a change is made to the service worker each time to trigger an update, e.g. by changing a 'version' constant in `sw.js`