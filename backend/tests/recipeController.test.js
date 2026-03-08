const test = require("node:test");
const assert = require("node:assert/strict");
const Recipe = require("../models/Recipe");
const { listRecipes } = require("../controllers/recipeController");

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

test("listRecipes returns paginated payload with page size 50", async () => {
  const originalCount = Recipe.countDocuments;
  const originalFind = Recipe.find;

  Recipe.countDocuments = async () => 120;
  Recipe.find = () => ({
    sort: () => ({
      skip: () => ({
        limit: async () => Array.from({ length: 50 }, (_, index) => ({ name: `Food ${index + 1}` })),
      }),
    }),
  });

  const req = { query: { page: "1", dietType: "veg", search: "paneer" } };
  const res = createRes();

  await listRecipes(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.page, 1);
  assert.equal(res.body.pageSize, 50);
  assert.equal(res.body.items.length, 50);
  assert.equal(res.body.total, 120);
  assert.equal(res.body.hasMore, true);

  Recipe.countDocuments = originalCount;
  Recipe.find = originalFind;
});
