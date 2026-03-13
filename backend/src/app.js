const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Mount routes
app.use('/api', projectRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
