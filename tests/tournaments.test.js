const request = require("supertest");
const app = require("../server");
const Tournament = require("../models/Tournament");
const db = require("./setup");

jest.setTimeout(30000);

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Tournaments GET endpoints", () => {
  it("should return all tournaments", async () => {
    await Tournament.create({ name: "Champions Cup" });
    const res = await request(app).get("/api/tournaments");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Champions Cup");
  });

  it("should return a specific tournament by ID", async () => {
    const tournament = await Tournament.create({ name: "World Cup" });
    const res = await request(app).get(`/api/tournaments/${tournament._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("World Cup");
  });

  it("should return 404 for non-existent tournament ID", async () => {
    const fakeId = "507f1f77bcf86cd799439011"; // valid ObjectId but not in DB
    const res = await request(app).get(`/api/tournaments/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 400 for invalid tournament ID format", async () => {
    const res = await request(app).get("/api/tournaments/not-a-valid-id");
    expect(res.statusCode).toBe(400);
  });
});
