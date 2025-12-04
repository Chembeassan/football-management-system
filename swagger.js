const swaggerAutogen = require('swagger-autogen')();

const doc = {
  swagger: "2.0",
  info: {
    title: 'Football Management API',
    description: 'API for managing football teams, players, matches, and tournaments',
    version: '1.0.0'
  },
  host: "localhost:3002",
  basePath: "/",
  schemes: ["http"],
  tags: [
    {
      name: 'Matches',
      description: 'Football matches management'
    },
    {
      name: 'Tournaments',
      description: 'Football tournaments management'
    },
    {
      name: 'Teams',
      description: 'Football teams management'
    }
  ],
  definitions: {
    Match: {
      _id: "string",
      teamA: "string",
      teamB: "string",
      date: "string",
      venue: "string",
      score: "string",
      status: "string"
    },
    Tournament: {
      _id: "string",
      name: "string",
      teams: ["string"],
      matches: ["string"],
      bracket: {}
    },
    Team: {
      _id: "string",
      name: "string",
      coach: "string",
      stadium: "string",
      points: 0
},
    Error: {
      message: "string",
      error: "string"
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/matches.js', './routes/tournaments.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
