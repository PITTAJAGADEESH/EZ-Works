# User Authentication & File Management System

This project is a backend system for user authentication, email verification, and file management using Node.js, SQLite, and various other technologies. The system allows users to register, log in, verify email addresses, and upload/download files securely.

## Features

- **User Authentication**
  - User registration (`/api/auth/signup`)
  - Login with JWT tokens (`/api/auth/login`)
  - Email verification (`/api/auth/verify-email/:verification_code`)
- **File Management**
  - Upload files (`/api/files/upload`)
  - List files (`/api/files/list-files`)
  - Download files (`/api/files/download-file/:file_id`)

## Technologies

- **Node.js & Express** for backend
- **SQLite** for database storage
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email verification
- **Crypto** for file encryption

## Setup

### Prerequisites

- **Node.js** (v14.x or higher)
- **SQLite** installed

### 5. Test the API

Test the routes using Postman.

#### API Routes

- **POST** `/api/auth/signup`: Register a new user
- **POST** `/api/auth/login`: Login and receive JWT token
- **GET** `/api/auth/verify-email/{verification_code}`: Verify user email
- **POST** `/api/files/upload`: Upload a file
- **GET** `/api/files/list-files`: List all files
- **GET** `/api/files/download-file/{file_id}`: Download a file

## Screenshots

### Postman Requests

#### Signup Request

![Postman Signup Request](<images/Screenshot%20(354).png>)

#### Login Request

![Postman Login Request](<images/Screenshot%20(356).png>)

#### Upload File Request

![Postman Upload File Request](<images/Screenshot%20(358).png>)

## Deployment

You can access the deployed application on Render:
[Render Deployment Link](https://ez-works-reo3.onrender.com)

## GitHub Repository

Check out the source code and contribute to this project on GitHub:
[GitHub Repository](https://github.com/PITTAJAGADEESH/EZ-Works)
