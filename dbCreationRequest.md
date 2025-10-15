# NutriBuddy Database Requirements

## Required Tables
- `nutrition_searches`
- `meal_plans`
- `meal_plan_meals`
- `meal_plan_items`
- `recipes`
- `recipe_ingredients`

## Optional Tables
- `recipe_bookmarks`
- `blog_posts`
- `db_health`

The NutriBuddy application needs the following tables in Aurora PostgreSQL (or equivalent). All tables are scoped per user via a `user_id` column (unless noted otherwise). Primary keys can be UUIDs or ULIDs generated in the Lambda layer.

---

## 1. `nutrition_searches`
Stores the results of food lookups so the dashboard can show history.

| Column       | Type        | Notes                                         |
|--------------|-------------|-----------------------------------------------|
| id           | UUID/TEXT   | Primary key                                   |
| user_id      | UUID/TEXT   | Owner of the lookup                           |
| query        | TEXT        | Raw user input (e.g., `"120 g salmon"`)      |
| food_name    | TEXT        | Normalized food label                         |
| quantity     | TEXT        | Display value                                 |
| measure      | TEXT        | Display unit                                  |
| weight       | NUMERIC     | Grams                                         |
| calories     | NUMERIC     |                                               |
| protein      | NUMERIC     | grams                                         |
| carbs        | NUMERIC     | grams                                         |
| fat          | NUMERIC     | grams                                         |
| sugar        | NUMERIC     | grams                                         |
| sodium       | NUMERIC     | mg                                            |
| fiber        | NUMERIC     | grams                                         |
| cautions     | JSONB       | Array of strings (e.g., allergens)            |
| created_at   | TIMESTAMP   | Default `now()`                               |

Indexes: `(user_id, created_at DESC)`.

---

## 2. `meal_plans`
Top-level meal plan metadata.

| Column           | Type        | Notes                                                    |
|------------------|-------------|----------------------------------------------------------|
| id               | UUID/TEXT   | Primary key                                              |
| user_id          | UUID/TEXT   | Owner                                                    |
| name             | TEXT        | Plan title                                               |
| status           | TEXT        | `active`, `draft`, or `archived`                         |
| start_date       | DATE        | Optional                                                 |
| end_date         | DATE        | Optional                                                 |
| notes            | TEXT        | Optional free-text                                       |
| nutrition_totals | JSONB       | Cached totals (calories, macros, sugar, sodium, fibre)   |
| updated_at       | TIMESTAMP   | Automatically updated                                    |

### 2.1 `meal_plan_meals`
Represents sections inside a plan (Breakfast, Lunch, etc.).

| Column      | Type        | Notes                        |
|-------------|-------------|------------------------------|
| id          | UUID/TEXT   | Primary key                  |
| plan_id     | UUID/TEXT   | FK → `meal_plans.id`         |
| label       | TEXT        | e.g., Breakfast, Dinner      |
| scheduled_at| TEXT        | Optional display time        |
| sort_order  | INTEGER     | Optional ordering field      |

### 2.2 `meal_plan_items`
Individual food entries within a meal.

| Column    | Type        | Notes                                        |
|-----------|-------------|----------------------------------------------|
| id        | UUID/TEXT   | Primary key                                  |
| meal_id   | UUID/TEXT   | FK → `meal_plan_meals.id`                    |
| name      | TEXT        | Food name                                    |
| calories  | NUMERIC     |                                              |
| protein   | NUMERIC     | grams                                        |
| carbs     | NUMERIC     | grams                                        |
| fat       | NUMERIC     | grams                                        |
| sugar     | NUMERIC     | grams                                        |
| sodium    | NUMERIC     | mg                                           |
| fiber     | NUMERIC     | grams                                        |
| quantity  | TEXT        | Display quantity                             |
| measure   | TEXT        | Display unit                                 |
| weight    | NUMERIC     | grams                                        |

Indexes: `(plan_id)`, `(meal_id)`.

---

## 3. `recipes`
Central recipe catalog, including user favourites.

| Column        | Type      | Notes                                              |
|---------------|-----------|----------------------------------------------------|
| id            | UUID/SERIAL| Primary key                                        |
| user_id       | UUID/TEXT | Optional (for user-generated recipes)              |
| name          | TEXT      |                                                    |
| prep_time     | INTEGER   | Minutes                                            |
| cook_time     | INTEGER   | Minutes                                            |
| total_time    | INTEGER   | Minutes                                            |
| step_count    | INTEGER   |                                                    |
| servings      | INTEGER   |                                                    |
| categories    | JSONB     | Array of strings                                   |
| cuisines      | JSONB     | Array of strings                                   |
| instructions  | JSONB     | Array of steps                                    |
| nutrition     | JSONB     | calories, fat, sugar, sodium, protein, satFat, fibre |

### 3.1 `recipe_ingredients`

| Column    | Type      | Notes                          |
|-----------|-----------|--------------------------------|
| id        | UUID/SERIAL| Primary key                    |
| recipe_id | FK        | → `recipes.id`                |
| name      | TEXT      | Ingredient name                |
| quantity  | TEXT      |                                |
| unit      | TEXT      |                                |
| misc      | TEXT      | Extra description (e.g., “chopped”) |

### 3.2 `recipe_bookmarks` (optional)
Stores user favourites.

| Column    | Type      | Notes                           |
|-----------|-----------|---------------------------------|
| recipe_id | FK        | → `recipes.id`                 |
| user_id   | UUID/TEXT | Owner                           |
| saved_at  | TIMESTAMP | Default `now()`                 |

Indexes: `(user_id, recipe_id)` unique.

---

## 4. `blog_posts`
Used if we decide to serve blog content from the backend.

| Column       | Type    | Notes                                     |
|--------------|---------|-------------------------------------------|
| slug         | TEXT    | Primary key                               |
| title        | TEXT    |                                           |
| excerpt      | TEXT    | Short summary                             |
| body         | JSONB   | Array of paragraphs or markdown blocks    |
| reading_time | TEXT    | e.g., `"6 min read"`                      |
| published_at | DATE    |                                           |
| image        | TEXT    | URL                                       |
| tags         | JSONB   | Optional array of strings                 |
| author       | TEXT    | Optional                                  |

---

## 5. `db_health`
A simple heartbeat table (optional if health check is stateless).

| Column     | Type      | Notes                         |
|------------|-----------|-------------------------------|
| checked_at | TIMESTAMP | When the probe ran            |
| status     | TEXT      | `"ok"`, `"error"`, etc.        |

---

## General Notes
- Add foreign key constraints between parent/child tables (cascade deletes on meals/items if a plan is removed).
- Index `user_id` columns to support per-user queries.
- JSONB columns allow us to store nutrient hashes exactly as the Lambda returns them, while still enabling aggregated SQL if needed later.

This structure mirrors the objects already used in the frontend Pinia stores, so once the tables exist we can swap the local storage for real API calls without further schema changes.
