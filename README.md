# Tones UI
Project consists of 4 node modules:
* Frontend - Client rendered React application. Using build tool Vite.
* Backend - Currently a simple express js API.
* Electron - Electron application. When launched waits for other modules to start up by checking their ports and then connects to FE through router.
* Router - Gateway for FE and BE. Made with express js. For now put in place to make CORS go away and help facilitate better FE-BE integration.

To launch all modules, run:  
`> npm install`  
`> npm run start-dev`  
Or to run just FE, cd to frontend module, run npm install and then:  
`> npm run dev`
