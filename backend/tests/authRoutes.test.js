const test = require("node:test");
const assert = require("node:assert/strict");
const User = require("../models/User");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

const router = require("../routes/authRoutes");

const getHandler = (path, method) => {
  const layer = router.stack.find((entry) => entry.route && entry.route.path === path);
  return layer.route.stack.find((stackEntry) => stackEntry.method === method).handle;
};

const createRes = () => {
  const res = { statusCode: 200, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

test("register returns 400 when required fields missing", async () => {
  const handler = getHandler("/register", "post");
  const req = { body: { email: "a@b.com" } };
  const res = createRes();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /required/i);
});

test("register returns 201 on success", async () => {
  const handler = getHandler("/register", "post");
  const originalFindOne = User.findOne;
  const originalCreate = User.create;

  User.findOne = async () => null;
  User.create = async () => ({
    _id: "507f1f77bcf86cd799439011",
    name: "Test",
    email: "test@example.com",
  });

  const req = { body: { name: "Test", email: "test@example.com", password: "secret123" } };
  const res = createRes();

  await handler(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.user.email, "test@example.com");
  assert.ok(res.body.token);

  User.findOne = originalFindOne;
  User.create = originalCreate;
});

test("login returns 401 on invalid credentials", async () => {
  const handler = getHandler("/login", "post");
  const originalFindOne = User.findOne;

  User.findOne = async () => null;

  const req = { body: { email: "test@example.com", password: "bad" } };
  const res = createRes();

  await handler(req, res);

  assert.equal(res.statusCode, 401);
  assert.match(res.body.message, /invalid credentials/i);

  User.findOne = originalFindOne;
});
