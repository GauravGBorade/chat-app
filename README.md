
# Chat-App

A brief description of what this project does and who it's for

This is a realtime chat application developed using MERN stack.
This app has following functionalities - 

* Users can signup or login on the app which creates their account
* Users can create search other user's name in search filed and start a chat with them
* Users can create a group chat to chat with multiple people at the same time
## Demo


# Chat-App

A brief description of what this project does and who it's for

This is a realtime chat application developed using MERN stack.

## Features

- Login/ Signup
- Search Users
- Create Chat
- Create Group Chat
- Realtime Communication


## Demo

https://chat-app-58uo.onrender.com

## Run Locally

Clone the project

```bash
  git clone https://github.com/GauravGBorade/chat-app.git
```

Go to the project directory

```bash
  cd chat-app
```

Install dependencies

```bash
  cd backend && npm install && cd ../frontend npm install
```

Add database string and JWT Secret in env file

```bash
  .env
```

Start the backend server and then frontend

```bash
  npm run dev
```

## Additional information

Application Architecture and Concurrency Handling:

* The application follows a typical MERN stack architecture, comprising MongoDB as the database, Express.js for the server, React for the client-side interface, and Node.js for server-side logic. Real-time chatting functionality is achieved using Socket.IO, which provides WebSocket-based communication between clients and the server for real-time data exchange.

* Concurrency is handled primarily through the event loop provided by Node.js. Asynchronous operations, such as database queries or network requests, are managed using async/await syntax, allowing the server to handle multiple requests concurrently without blocking the event loop. This ensures optimal performance and responsiveness for handling multiple chat connections simultaneously.

* An improvement suggestion for handling concurrency more effectively could involve implementing the Node.js Cluster module. This module allows for the creation of multiple worker processes, distributing incoming connections across them, thereby enhancing the server's performance and scalability.

## Assumptions and Design Choices:

UI Focus: The primary focus of the project was to implement real-time chat functionality rather than creating an elaborate user interface. Thus, minimal effort was dedicated to UI design. This choice was made to prioritize functionality over aesthetics and can be improved upon in future iterations of the project.


