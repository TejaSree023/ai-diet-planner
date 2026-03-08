const test = require("node:test");
const assert = require("node:assert/strict");
const Recipe = require("../models/Recipe");
const { chatbotReply } = require("../controllers/chatbotController");

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

test("chatbot returns explanation for BMI query", async () => {
  const req = { body: { message: "What is BMI?" } };
  const res = createRes();

  await chatbotReply(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body.reply, /bmi/i);
  assert.deepEqual(res.body.foods, []);
});

test("chatbot returns foods for high protein query", async () => {
  const originalFind = Recipe.find;

  Recipe.find = () => ({
    sort: () => ({
      limit: () => ({
        lean: async () => [
          { name: "Paneer", protein: 18, calories: 260, carbs: 8, fat: 18, fibre: 2, dietType: "veg", category: "main-course" },
        ],
      }),
    }),
  });

  const req = { body: { message: "Suggest high protein foods" } };
  const res = createRes();

  await chatbotReply(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body.reply, /high protein/i);
  assert.equal(res.body.foods.length, 1);
  assert.equal(res.body.foods[0].name, "Paneer");

  Recipe.find = originalFind;
});
