const request = require("supertest");
const app = require("../server");
const db = require("./setup"); // in-memory MongoDB setup
const Team = require("../models/Team");

jest.setTimeout(30000);

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Teams API - GET endpoints", () => {
  it("should return 200 and an empty array when no teams exist", async () => {
    const res = await request(app).get("/api/teams");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 and a team by valid ID", async () => {
    // Insert team directly into DB
    const team = await Team.create({
      name: "Lions FC",
      coach: "Coach A",
      stadium: "Stadium A",
      points: 5,
    });

    const res = await request(app).get(`/api/teams/${team._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Lions FC");
  });

  it("should return 404 if team not found", async () => {
    const fakeId = "650000000000000000000004"; // valid Mongo ID but does not exist
    const res = await request(app).get(`/api/teams/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Team not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/api/teams/not-a-valid-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("should return 200 and standings sorted by points", async () => {
    // Insert multiple teams directly into DB
    await Team.create({
      name: "Team A",
      coach: "Coach A",
      stadium: "Stadium A",
      points: 10,
    });
    await Team.create({
      name: "Team B",
      coach: "Coach B",
      stadium: "Stadium B",
      points: 20,
    });

    const res = await request(app).get("/api/teams/standings");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Team B"); // highest points first
    expect(res.body[1].name).toBe("Team A");
  });
});
