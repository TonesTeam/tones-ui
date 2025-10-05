# Tones UI and Backend

<img width="675" height="307" alt="Screenshot From 2025-10-05 17-37-34" src="https://github.com/user-attachments/assets/2386e1cc-081c-49e9-8e03-e2c993983d75" />

The project consists of 3 modules:
* Frontend (`frontend_native`) - Expo React Native app;
* Backend (`backend`) - NestJS rest api and a database generated with Prisma ORM;
* Common code (`common`) - Logic that is used on both the backend and the native app.

# Project Setup and Development Guide

This README file outlines the steps required to set up and run the backend and frontend of this project. The project consists of both a backend module and a frontend mobile application using Expo.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running the mobile frontend)

Before running the backend or the frontend make sure that all the
dependencies are installed by running:
```bash
npm install
```

## Backend Setup

1. **Navigate to the Backend Module**\
   Open a terminal and change directory to the backend module:
   ```bash
   cd backend
   ```

2. **Generate Prisma Client**\
   Generate the Prisma ORM database:
   ```bash
   npx prisma generate
   ```

3. **Start the Backend Server**\
   Navigate to the root of the project and run the following
   command to start the backend server in development mode:
   ```bash
   # Make sure you are in the root direcotory of the project
   npm run start-dev:be
   ```

This will start a REST API on port 8080 connected to the database.

## Frontend Setup (React Native with Expo)

1. **Navigate to the Frontend Module**\
   Open a new terminal window and change directory to the frontend module:
   ```bash
   cd frontend_native
   ```
2. **Adjust Configuration (if needed)**\
   Open the following file to adjust the backend API's IP address and port if necessary:
   ```plaintext
   frontend_native/common/util.ts
   ```
   On line 61, make sure the IP is correct and the port is set to `8080` if needed.
   It may be the case that the frontend can't find the backend, so then one can
   adjust the IP address (a domain name can also be used)
   and the port accordingly, by hardcoding the values that
   correspond to the backend server.

   For example if you're running the server on your device on the default port `8080`,
   and it's IP is `192.168.1.106`, but the native app can't find your API, you can try
   something like:
   ```typescript
   let foundIP = await scanNetwork(ipList);
   foundIP = '192.168.1.106';
   return 'http://' + foundIP + ':8080';
   ```


2. **Start the Expo Development Server**\
   Start the Expo development server using the following command:

   ```bash
   # This should be run while inside /frontend_native
   npx expo start
   ```

   After the build process begins, the terminal will display a QR code. You can scan this QR code with your Expo Go app (available on both iOS and Android) to load the mobile application on your device. Alternativelly you can run the web bundle, that will be accessible by following the link that Expo has provided you with.
