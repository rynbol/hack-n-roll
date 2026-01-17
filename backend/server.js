import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabaseClient.js';

// Load environment variables
dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Double API is running',
    timestamp: new Date().toISOString(),
  });
});

// Import routes
import profileRoutes from './routes/profile.js';
import studentRoutes from './routes/student.js';
import aiRoutes from './routes/ai.js';

// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Double API server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});