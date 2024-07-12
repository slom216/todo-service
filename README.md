# To-Do Management Service

A simple Node.js service for managing To-Dos via a REST API, written in TypeScript. This service supports JWT authentication and is designed to serve different clients, ensuring that each client can only see their own To-Dos.

## Features

- **CRUD operations**: Create, Read, Update, and Delete To-Dos.
- **JWT Authentication**: Secure access to the API using JSON Web Tokens.
- **Persistent Storage**: Data is stored in a SQLite database and is persistent between server restarts.

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later)

### Installation

- Clone the repository:

```bash
git clone https://github.com/slom216/todo-service.git
cd todo-service
```

- Install the dependencies:

```
npm install
```

- Configure environment variables:

Create a .env file in the root directory and add the following environment variables:

```
JWT_EXPIRY_TIME=1d
JWT_SECRET=your_secret
PORT=3000
```

- Running the Application

```
npm start
```

- Running unit tests

```
npm test
```

## NOTES

- Moving app.listen to server.ts enabled tests to run without actually listening to ports, which lead to open handles during tests

- Requires REST API extension to run .http requests
