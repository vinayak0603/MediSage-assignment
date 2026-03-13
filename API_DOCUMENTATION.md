# Medi API Documentation

Base URL: `http://localhost:5000/api`

## 📊 Overview
All requests should include the header `Content-Type: application/json`. Errors are returned in a standard format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## 📁 Projects

### 1. Get All Projects
Returns a paginated list of all projects.

- **URL**: `/projects`
- **Method**: `GET`
- **Query Params**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of projects per page (default: 10)
- **Success Response**: `200 OK`
- **Sample Output**:
```json
{
  "success": true,
  "count": 1,
  "total": 5,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "id": "65f1a...",
      "name": "Project Alpha",
      "description": "First project",
      "created_at": "2024-03-13T..."
    }
  ]
}
```

### 2. Create Project
- **URL**: `/projects`
- **Method**: `POST`
- **Body**:
  - `name` (required): Project name
  - `description` (optional): Project description
- **Success Response**: `201 Created`

### 3. Get Project By ID
- **URL**: `/projects/:id`
- **Method**: `GET`
- **Path Params**:
  - `id`: Valid MongoDB Project ID
- **Success Response**: `200 OK`

### 4. Delete Project
Deletes a project and all associated tasks.
- **URL**: `/projects/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

---

## 📝 Tasks

### 1. Get Tasks for Project
Returns all tasks belonging to a specific project.
- **URL**: `/projects/:project_id/tasks`
- **Method**: `GET`
- **Query Params**:
  - `status` (optional): Filter by `todo`, `in-progress`, or `completed`.
  - `sortBy` (optional): Use `due_date` (ascending) or `-due_date` (descending).
- **Success Response**: `200 OK`

### 2. Add Task to Project
- **URL**: `/projects/:project_id/tasks`
- **Method**: `POST`
- **Body**:
  - `title` (required): Task title
  - `description` (optional): Task description
  - `status` (optional): Defaults to `todo`
  - `priority` (optional): `low`, `medium`, `high` (defaults to `medium`)
  - `due_date` (optional): ISO 8601 Date
- **Success Response**: `201 Created`

### 3. Update Task
- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Body**: (All optional)
  - `title`, `description`, `status`, `priority`, `due_date`
- **Success Response**: `200 OK`

### 4. Delete Task
- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

---

## 🛡️ Validation Rules
- **IDs**: Must be valid MongoDB ObjectIDs.
- **Dates**: Must be in ISO 8601 format (e.g., `2024-12-31`).
- **Required Fields**: Requests missing required fields or containing invalid enums (e.g., invalid status) will return a `400 Bad Request`.
