import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFavoriteRecipes, fetchRecipes, toggleFavoriteRecipe } from "../services/recipeService";
import SkeletonCard from "../components/ui/SkeletonCard";

const QUICK_FILTERS = {
  protein: { label: "High Protein", params: { minProtein: 15 } },
  lowCal: { label: "Under 300 kcal", params: { maxCalories: 300 } },
  fibre: { label: "High Fibre", params: { minFibre: 5 } },
  veg: { label: "Vegetarian", params: { dietType: "veg" } },
  nonVeg: { label: "Non-Veg", params: { dietType: "non-veg" } },
};

const STORAGE_KEY = "recipeFilters.v1";

const RecipeBookPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  })();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || stored.search || "");
  const [dietType, setDietType] = useState(searchParams.get("dietType") || stored.dietType || "");
  const [category, setCategory] = useState(searchParams.get("category") || stored.category || "");
  const [quickFilter, setQuickFilter] = useState(searchParams.get("quick") || stored.quickFilter || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFavorites = async () => {
    try {
      const favoriteData = await fetchFavoriteRecipes();
      setFavorites(favoriteData.map((item) => item._id));
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    const queryDiet = searchParams.get("dietType") || "";
    const queryCategory = searchParams.get("category") || "";
    const queryQuick = searchParams.get("quick") || "";

    setSearch((prev) => (prev === querySearch ? prev : querySearch));
    setDietType((prev) => (prev === queryDiet ? prev : queryDiet));
    setCategory((prev) => (prev === queryCategory ? prev : queryCategory));
    setQuickFilter((prev) => (prev === queryQuick ? prev : queryQuick));
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (dietType) params.dietType = dietType;
    if (category) params.category = category;
    if (quickFilter) params.quick = quickFilter;

    setSearchParams(params, { replace: true });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search, dietType, category, quickFilter }));
  }, [search, dietType, category, quickFilter, setSearchParams]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setMessage("");

      const quickParams = QUICK_FILTERS[quickFilter]?.params || {};

      const response = await fetchRecipes({
        search: search || undefined,
        dietType: (quickParams.dietType || dietType) || undefined,
        category: category || undefined,
        minProtein: quickParams.minProtein,
        maxCalories: quickParams.maxCalories,
        minFibre: quickParams.minFibre,
        page: 1,
      });

      const incoming = response.items || [];
      setRecipes(incoming);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [search, dietType, category, quickFilter]);

  const toggleFavorite = async (id) => {
    const wasFavorite = favorites.includes(id);
    setFavorites((prev) => (wasFavorite ? prev.filter((item) => item !== id) : [...prev, id]));

    try {
      const data = await toggleFavoriteRecipe(id);
      setFavorites(data.favoriteRecipes.map((item) => item.toString()));
    } catch {
      setFavorites((prev) => (wasFavorite ? [...prev, id] : prev.filter((item) => item !== id)));
      setMessage("Could not update favorites right now");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDietType("");
    setCategory("");
    setQuickFilter("");
    setMessage("");
  };

  return (
    <section className="space-y-4">
      <div className="card page-header">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Recipe Library</p>
        <h2 className="mb-3 mt-1 text-3xl font-semibold text-[#5E4436]">Search healthy recipes</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" placeholder="Search recipes" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={dietType} onChange={(e) => setDietType(e.target.value)}>
            <option value="">All</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
            <option value="egg">Egg</option>
          </select>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="main-course">Main Course</option>
            <option value="snacks">Snacks</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(QUICK_FILTERS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              className={`quick-chip ${quickFilter === id ? "active" : ""}`}
              onClick={() => setQuickFilter((prev) => (prev === id ? "" : id))}
            >
              {config.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className="btn-secondary !py-1.5 text-sm" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      )}

      {!loading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <article key={recipe._id} className="card hover-card overflow-hidden p-0">
            <div className="h-36 bg-gradient-to-br from-[#F2E7D8] via-[#E7F1E3] to-[#F8ECDD] p-4 text-3xl">
              {recipe.dietType === "veg" ? "🥬" : "🍗"}
            </div>

            <div className="space-y-2 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#5D4436]">{recipe.name}</h3>
                <button className="btn-secondary !px-3 !py-1 text-xs" onClick={() => toggleFavorite(recipe._id)} type="button">
                  {favorites.includes(recipe._id) ? "Saved" : "Save"}
                </button>
              </div>

              <p className="text-sm text-[#7A5D4A]">{recipe.preparationTime} mins | {recipe.dietType}</p>
              <p className="text-sm text-[#7A5D4A]">{recipe.calories} kcal | P {recipe.protein} | C {recipe.carbs} | F {recipe.fat}</p>
              <p className="line-clamp-2 text-sm text-[#856755]">{(recipe.ingredients || []).join(", ") || "Nutrition-focused recipe"}</p>

              <div className="flex flex-wrap gap-2">
                {(recipe.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-xl bg-[#F3E8D9] px-2 py-1 text-xs text-[#6E5442]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>}

      {message && (
        <div className="card text-center">
          <p className="text-sm text-rose-500">{message}</p>
        </div>
      )}

      {recipes.length === 0 && (
        <div className="card empty-state text-center">
          <p className="text-lg font-semibold text-[#4A3A2D]">No recipes match these filters</p>
          <p className="text-sm text-[#7A5D4A]">Try a broader search or reset all filters to explore the full library.</p>
          <button type="button" className="btn mt-2" onClick={clearFilters}>
            Show All Recipes
          </button>
        </div>
      )}
    </section>
  );
};

export default RecipeBookPage;
