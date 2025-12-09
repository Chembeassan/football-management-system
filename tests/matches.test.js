const request = require("supertest");
const app = require("../server");
const Match = require("../models/Match");
const db = require("./setup");

jest.setTimeout(30000);

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Matches API - GET endpoints", () => {
  it("should return 200 and an empty array when no matches exist", async () => {
    const res = await request(app).get("/api/matches");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 and a match by valid ID", async () => {
    const match = await Match.create({
      teamA: "Lions FC",
      teamB: "Tigers FC",
      date: new Date(),
      venue: "National Stadium",
      status: "scheduled",
    });

    const res = await request(app).get(`/api/matches/${match._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.teamA).toBe("Lions FC");
    expect(res.body.teamB).toBe("Tigers FC");
  });

  it("should return 404 if match not found", async () => {
    const res = await request(app).get("/api/matches/650000000000000000000004");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Match not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/api/matches/not-a-valid-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid ID format");
  });

  it("should return matches filtered by status", async () => {
    await Match.create({
      teamA: "Lions FC",
      teamB: "Tigers FC",
      date: new Date(),
      venue: "National Stadium",
      status: "completed",
      score: "2-1",
    });

    const res = await request(app).get("/api/matches?status=completed");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe("completed");
    expect(res.body[0].score).toBe("2-1");
  });
});