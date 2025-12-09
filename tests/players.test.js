const request = require("supertest");
const app = require("../server");
const Team = require("../models/Team");
const Player = require("../models/Player");
const db = require("./setup");

jest.setTimeout(30000);

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Players API - GET endpoints", () => {
  it("should return 200 and an empty array when no players exist", async () => {
    const res = await request(app).get("/api/players");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 and a player by valid ID", async () => {
    const team = await Team.create({
      name: "Lions FC",
      coach: "Coach A",
      stadium: "Stadium A",
      points: 0,
    });

    const player = await Player.create({
      name: "John Doe",
      position: "Forward",
      teamId: team._id,
      jerseyNumber: 9,
    });

    const res = await request(app).get(`/api/players/${player._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("John Doe");
    expect(res.body.position).toBe("Forward");
    expect(res.body.teamId._id).toBe(team._id.toString());
  });

  it("should return 404 if player not found", async () => {
    const res = await request(app).get("/api/players/650000000000000000000004");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Player not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/api/players/not-a-valid-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid ID format");
  });

  it("should return players filtered by teamId", async () => {
    const team = await Team.create({
      name: "Tigers FC",
      coach: "Coach B",
      stadium: "Stadium B",
      points: 0,
    });

    await Player.create({
      name: "Jane Smith",
      position: "Midfielder",
      teamId: team._id,
      jerseyNumber: 8,
    });

    const res = await request(app).get(`/api/players?teamId=${team._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].teamId._id).toBe(team._id.toString());
    expect(res.body[0].name).toBe("Jane Smith");
  });
});