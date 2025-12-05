const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-management');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Football Management API',
      description: 'API for managing football teams, players, matches, and tournaments',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@footballapi.com'
      }
    },
    servers: [
      {
        //Dynamic server URL based on environment
        url: process.env.NODE_ENV === 'production'
          ? 'https://football-management-system.onrender.com'
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server'
      }
    ],
    tags: [
      { name: 'Matches', description: 'Football matches management' },
      { name: 'Tournaments', description: 'Football tournaments management' },
      { name: 'Teams', description: 'Football teams management' }
    ],
    components: {
      schemas: {
        Match: {
          type: 'object',
          required: ['teamA', 'teamB', 'date', 'venue'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            teamA: { type: 'string', description: 'First team ID' },
            teamB: { type: 'string', description: 'Second team ID' },
            tournament: { type: 'string', description: 'Tournament ID' },
            date: { type: 'string', format: 'date-time', description: 'Match date and time' },
            venue: { type: 'string', description: 'Match venue/stadium' },
            score: { type: 'string', description: 'Match score (e.g., "2-1")' },
            status: { type: 'string', enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled', description: 'Match status' }
          }
        },
        Tournament: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            name: { type: 'string', description: 'Tournament name' },
            teams: { type: 'array', items: { type: 'string' }, description: 'Array of team IDs' },
            matches: { type: 'array', items: { type: 'string' }, description: 'Array of match IDs' },
            bracket: { type: 'object', description: 'Tournament bracket structure' }
          }
        },
        Team: {
          type: 'object',
          required: ['name', 'coach', 'stadium'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            name: { type: 'string', description: 'Team name' },
            coach: { type: 'string', description: 'Coach name' },
            stadium: { type: 'string', description: 'Stadium name' },
            points: { type: 'number', default: 0, description: 'Team points' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            error: { type: 'string', description: 'Detailed error description' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api/matches', require('./routes/matches'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/teams', require('./routes/teams')); // <-- Added Teams routes

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Football Management API',
    documentation: '/api-docs',
    endpoints: {
      matches: '/api/matches',
      tournaments: '/api/tournaments',
      teams: '/api/teams'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: {
      home: '/',
      documentation: '/api-docs',
      health: '/health',
      matches: '/api/matches',
      tournaments: '/api/tournaments',
      teams: '/api/teams'
    }
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
});

module.exports = app;