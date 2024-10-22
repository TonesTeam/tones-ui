# Tones UI
Project consists of 4 node modules:
* Frontend - Client rendered React application. Using build tool Vite.
* Backend - Currently a simple express js API.
* Electron - Electron application. When launched waits for other modules to start up by checking their ports and then connects to FE through router.
* Router - Gateway for FE and BE. Made with express js. For now put in place to make CORS go away and help facilitate better FE-BE integration.

<!--To launch all modules, run:
`> npm install`
`> npm run start-dev`
Or to run just FE, cd to frontend module, run npm install and then:
`> npm run dev
-->

# Project Setup and Development Guide

This README file outlines the steps required to set up and run the backend and frontend of this project. The project consists of both a backend module and a frontend mobile application using Expo.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running the mobile frontend)

## Backend Setup

1. **Navigate to the Backend Module**\
   Open a terminal and change directory to the backend module:
   ```bash
   cd modules/backend
   ```

2. **Install Dependencies**\
   Run the following command to install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Generate Prisma Client**\
   If your project uses Prisma for database management, generate the Prisma client:
   ```bash
   npx prisma generate
   ```

<!--4. **Adjust Configuration (if needed)**\
   Open the following file to adjust the backend API's IP address and port if necessary:
   ```plaintext
   modules/frontend_native/common/util.ts
   ```
   On line 28, make sure the IP is correct and the port is set to `8080` if needed.-->

4. **Start the Backend Server**\
   Navigate to the root of the `modules` directory and run the following command to start the backend server in development mode:
   ```bash
   cd /modules
   npm run start-dev:be
   ```

## Frontend Setup (React Native with Expo)

1. **Navigate to the Frontend Module**\
   Open a new terminal window and change directory to the frontend module:
   ```bash
   cd modules/frontend_native
   ```

2. **Install Dependencies**\
   Run the following command to install the required Node.js and Expo packages:
   ```bash
   npm install
   ```

3. **Start the Expo Development Server**\
   Start the Expo development server using the following command:

   ```bash
   npx expo start
   ```

   After the build process begins, the terminal will display a QR code. You can scan this QR code with your Expo Go app (available on both iOS and Android) to load the mobile application on your device.
