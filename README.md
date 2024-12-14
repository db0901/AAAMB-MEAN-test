# Task Management Application

A full-stack task management application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring comprehensive CRUD operations, advanced filtering, and task history tracking.

## Features

- **Task Management**

  - Create, read, update, and delete tasks
  - Task attributes: title, description, status, priority, due date, and tags
  - Status tracking (Pending, In Progress, Completed)
  - Priority levels (Low, Medium, High)
  - Dynamic tag management

- **Advanced Features**
  - Task history tracking for all changes
  - Advanced filtering and search capabilities
  - Pagination and sorting
  - Responsive Material Design UI
  - Real-time form validation

## Prerequisites

- Node.js (v18 or higher)
- Docker (optional, for containerized MongoDB)
- MongoDB (If not using Docker)

## Installation & Setup

1. **Clone the repository**

2. **Backend Setup**

Ensure you have Node.js and Docker installed. Apart from that, you need Docker Engine running so the container can start.

```bash
cd backend
npm install
```

Create a .env file in the backend directory with the following variables:

```md
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=3000
```

3. **Frontend Setup**

```bash
cd frontend
npm install
```

4. **Database Setup**

- Option 1: Local MongoDB
  - Install and start MongoDB locally
- Option 2: Docker

  ```bash
  cd backend
  docker-compose up -d
  ```

5. **Seed the Database (Optional)**

   ```bash
   cd backend
   npm run seed
   ```

## Running the Application

1. **Start the Backend**

```bash
cd backend
npm run start
```

2. **Start the Frontend**

```bash
cd frontend
npm run start
```

The application will be available at http://localhost:4200

## API Documentation

### Task Endpoints

#### GET /api/tasks

- Retrieves all tasks
- Optional query parameters:
  - `status`: Filter by status (Pending, In Progress, Completed)
  - `priority`: Filter by priority (Low, Medium, High)
  - `tags`: Filter by tags (comma-separated)
  - `startDate`: Filter by due date range start
  - `endDate`: Filter by due date range end

#### GET /api/tasks/:id

- Retrieves a specific task by ID

#### POST /api/tasks

- Creates a new task
- Required fields: title, status, dueDate
- Optional fields: description, priority (defaults to Medium), tags

#### PUT /api/tasks/:id

- Updates an existing task
- Supports partial updates
- Validates status transitions (cannot go directly from Pending to Completed)

#### DELETE /api/tasks/:id

- Deletes a specific task
- Returns 204 on success

## Project Structure

```md
├── backend/
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── models/ # Database schemas
│ │ ├── routes/ # API routes
│ │ ├── middleware/ # Custom middleware
│ │ └── config/ # Configuration files
│ └── docker-compose.yml # Docker configuration
└── frontend/
└── src/
└── app/
--- ├── task-form/ # Component for creating and editing tasks
--- ├── task-list/ # Component for displaying tasks
--- └── task-history/ # Component for displaying task history
```

## Technologies Used

- **Frontend:**

  - Angular 18
  - Angular Material
  - RxJS
  - TypeScript

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Winston (logging)
