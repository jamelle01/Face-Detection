# IMPORTANT: Bug Fixes

## `navigator.getUserMedia`

`navigator.getUserMedia` is now deprecated and is replaced by `navigator.mediaDevices.getUserMedia`. To fix this bug replace all versions of `navigator.getUserMedia` with `navigator.mediaDevices.getUserMedia`

## Low-end Devices Bug

The video eventListener for `play` fires up too early on low-end machines, before the video is fully loaded, which causes errors to pop up from the Face API and terminates the script (tested on Debian [Firefox] and Windows [Chrome, Firefox]). Replaced by `playing` event, which fires up when the media has enough data to start playing.

---

### adding feature face recognition

after face detection, facial recognition follow using it as username authentication then proceed to password
rename face fetection try 1

- push 11/24/2022 3:34pm by jeramelle
- push 12/12/22 done fetching with database
---
## To run code 
* first type ***npm install*** this install all dependencies
* second type ***node server.js*** this run the server
* use the *go live server* to run the program

---
> code is still in the production. still not deployed