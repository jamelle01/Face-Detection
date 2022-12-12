# IMPORTANT: Bug Fixes

## `navigator.getUserMedia`

`navigator.getUserMedia` is now deprecated and is replaced by `navigator.mediaDevices.getUserMedia`. To fix this bug replace all versions of `navigator.getUserMedia` with `navigator.mediaDevices.getUserMedia`

## Low-end Devices Bug

The video eventListener for `play` fires up too early on low-end machines, before the video is fully loaded, which causes errors to pop up from the Face API and terminates the script (tested on Debian [Firefox] and Windows [Chrome, Firefox]). Replaced by `playing` event, which fires up when the media has enough data to start playing.

---

### adding feature face recognition

after face detection, facial recognition follow using it as username authentication then proceed to password
rename face fetection try 1

---

## To run code

- first type **_npm install_** this install all dependencies
- second type **_node server.js_** this run the server
- use the _go live server_ to run the program

---

> code is still in the production. still not deployed
