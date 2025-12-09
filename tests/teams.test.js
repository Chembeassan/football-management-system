const request = require("supertest");
const app = require("../server");
const db = require("./setup"); // in-memory MongoDB setup

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
    // Insert a team directly
    const teamRes = await request(app)
      .post("/api/teams")
      .send({
        name: "Lions FC",
        coach: "Coach A",
        stadium: "Stadium A",
        points: 5,
      });

    const res = await request(app).get(`/api/teams/${teamRes.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Lions FC");
  });

  it("should return 404 if team not found", async () => {
    const res = await request(app).get("/api/teams/650000000000000000000004");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Team not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/api/teams/not-a-valid-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid ID format");
  });

  it("should return 200 and standings sorted by points", async () => {
    await request(app)
      .post("/api/teams")
      .send({
        name: "Team A",
        coach: "Coach A",
        stadium: "Stadium A",
        points: 10,
      });

    await request(app)
      .post("/api/teams")
      .send({
        name: "Team B",
        coach: "Coach B",
        stadium: "Stadium B",
        points: 20,
      });

    const res = await request(app).get("/api/teams/standings");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("Team B"); // highest points first
  });
});
