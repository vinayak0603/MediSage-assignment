## 🚀 Features

- **Project Management**: Create and delete projects.
- **Task Tracking**: Add, update, and delete tasks for specific projects.
- **Status & Priority**: Organise tasks with custom status (Todo, In-Progress, Completed) and priority (Low, Medium, High).
- **Pagination & Filtering**: Efficiently browse projects and filter tasks by status.
- **Responsive Design**: Modern UI built with Tailwind CSS that works on all devices.
- **Robust Backend**: RESTful API with MongoDB integration and input validation.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **Mongoose**: MongoDB object modelling.
- **Express Validator**: Request validation.
- **CORS & Dotenv**: Middleware and environment management.

### Frontend
- **React**: Client-side library.
- **Vite**: Fast build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Router**: Client-side routing.
- **Lucide React**: Beautiful icons.
- **Axios**: HTTP client for API requests.

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Medi
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

The application should now be running! 
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📁 Project Structure

```
Medi/
├── backend/            # Express Server
│   ├── src/
│   │   ├── config/     # DB configuration
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Custom middleware
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── app.js      # Express app setup
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
└── client/             # React Application
    ├── public/         # Static assets
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page views
    │   ├── services/   # API service calls
    │   └── App.jsx     # Main component
    └── index.html      # Entry HTML
```

## 📄 API Documentation
For detailed information on API endpoints, please refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
