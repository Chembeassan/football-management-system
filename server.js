const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const route = require('./routes/index');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// implementing Google OAuth
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

app
    .use(bodyParser.json())
    .use(session({
        secret: 'secretCode',
        resave: false,
        saveUninitialized: true,
        store: store
    }))
    // this is a basic express session
    .use(passport.initialize())
    //init passport on every route
    .use(passport.session())
    //allow passport to use express sessions
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
        );
        res.setHeader('Access-Control-Allow-Headers',
            'GET, POST, PUT, DELETE, OPTIONS'
        );
        next();
    })
    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']}))
    .use(cors({origin: '*'}))
    .use("/", route);

    passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// REQUIRED LOGIN ROUTE
app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// CALLBACK ROUTE
app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api-docs",
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});    

// app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out."); });

app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect : "/api-docs", session: false}), 
    (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});


// Middleware
app.use(express.json());

/* // MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-management');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
 */

// MongoDB connection function
const connectDB = async () => {
  try {
    // Skip real connection when running tests
    if (process.env.NODE_ENV === "test") {
      console.log("Skipping MongoDB connection in test environment");
      return;
    }

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/football-management"
    );

    console.log("Connected to MongoDB");

  } catch (error) {
    console.error("MongoDB connection error:", error);

    // Do NOT exit during tests
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
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
      { name: 'Teams', description: 'Football teams management' },
      { name: 'Players', description: 'Football players management' }
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
        Player: {
          type: 'object',
          required: ['name', 'position', 'teamId', 'jerseyNumber'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            name: { type: 'string', description: 'Player name' },
            position: { type: 'string', description: 'Player position' },
            teamId: { type: 'string', description: 'Team ID' },
            jerseyNumber: { type: 'number', description: 'Jersey number' },
            stats: {
              type: 'object',
              properties: {
                goals: { type: 'number', default: 0, description: 'Number of goals scored' },
                assists: { type: 'number', default: 0, description: 'Number of assists' },
                matchesPlayed: { type: 'number', default: 0, description: 'Number of matches played' }
              }
            },
            status: { type: 'boolean', default: true, description: 'Player status: true = active, false = inactive' }
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
app.use('/api/players', require('./routes/players'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get('/', (req, res) => {
  res.json({
    status: req.session.user !== undefined 
      ? `Logged in as ${req.session.user.displayName}` 
      : 'Logged out.',
    message: 'Football Management API',
    documentation: '/api-docs',
    login: '/login',
    logout:'/logout',
    endpoints: {
      matches: '/api/matches',
      tournaments: '/api/tournaments',
      teams: '/api/teams',
      players: '/api/players'
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
      login: '/login',
      logout:'/logout',
      documentation: '/api-docs',
      health: '/health',
      matches: '/api/matches',
      tournaments: '/api/tournaments',
      teams: '/api/teams',
      players: '/api/players'
    }
  });
});

/* // Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
}); */

/* // Only connect/start server if run directly (not in tests)
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-management')
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
} */

  // Start server only when not testing
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  });
}



module.exports = app;
