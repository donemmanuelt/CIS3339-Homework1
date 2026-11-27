# CIS3339 Homework 1 — Student Management System

## Overview

This project is a Student Management System developed for CIS 3339 Homework 1. It migrates the original application into a full-stack application using Vue 3, Express.js, and MongoDB.

The application allows users to manage student records, courses, and enrollments through a web-based interface.

## Technologies Used

- Vue 3 (Composition API)
- Vue Router
- Pinia
- Vite
- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML and CSS

## Features

### Student Management
- Add students with name, student ID, phone number, and ZIP code.
- Search students by name or student ID.
- View student information.
- Delete students.
- Validate required fields.
- Prevent duplicate student IDs.

### Course Management
- Add courses with a course ID and course name.
- View courses.
- Delete courses.
- Prevent duplicate course IDs.

### Enrollment Management
- Enroll students in courses.
- Populate student and course selections dynamically.
- View students enrolled in a selected course.
- Prevent duplicate enrollments.
- Remove enrollments.
- Automatically remove related enrollments when a student or course is deleted.

## Project Structure

```text
CIS3339-Homework1/
├── backend/
│   ├── models/
│   │   ├── Student.js
│   │   ├── Course.js
│   │   └── Enrollment.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
├── frontend-vue/
│   ├── src/
│   └── package.json
├── images/
├── package.json
└── README.md
```

## Prerequisites

The following software must be installed:

- Node.js and npm
- MongoDB Community Edition

## Installation

From the project root directory, install the frontend dependencies:

```bash
npm run install:frontend
```

Install the backend dependencies:

```bash
npm run install:backend
```

## MongoDB Setup

MongoDB Community Edition must be installed and running locally.

On macOS using Homebrew, start MongoDB with:

```bash
brew services start mongodb-community
```

The application uses the following local database:

```text
cis3339_homework1
```

The database and collections are automatically created when the application stores data.

## Environment Configuration

The backend uses a `.env` file located in the `backend` directory.

The file should contain:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

## Build and Run

Build the Vue frontend for production:

```bash
npm run build
```

Start the backend server:

```bash
npm start
```

The Express backend connects to MongoDB and serves the production Vue application.

## Access the Application

After starting the server, open the following URL in your browser:

**http://localhost:3000**

## API Endpoints

### Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve all students |
| POST | `/api/students` | Add a student |
| DELETE | `/api/students/:id` | Delete a student |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Retrieve all courses |
| POST | `/api/courses` | Add a course |
| DELETE | `/api/courses/:id` | Delete a course |

### Enrollments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/enrollments` | Retrieve all enrollments |
| POST | `/api/enrollments` | Create an enrollment |
| DELETE | `/api/enrollments/:studentId/:courseId` | Remove an enrollment |

## Data Persistence

Students, courses, and enrollments are stored in MongoDB. Records persist after refreshing the application or restarting the backend.

The backend maintains data integrity by verifying that students and courses exist before creating enrollments, preventing duplicate enrollments, and deleting associated enrollment records when a student or course is deleted.

## Running the Application

From the project root:

1. Ensure MongoDB Community Edition is running.
2. Install dependencies if necessary.
3. Build the Vue frontend.
4. Start the backend server.
5. Open `http://localhost:3000`.

### Commands

```bash
npm run install:frontend
npm run install:backend
npm run build
npm start
```

## Emmanuel Tuazon

CIS 3339 — Homework 1
