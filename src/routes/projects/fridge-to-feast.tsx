import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/projects/fridge-to-feast")({
  head: () => ({
    meta: [
      {
        title: "Fridge to Feast — Norbert Reyes",
      },
      {
        name: "description",
        content:
          "Fridge to Feast: type in what's in your fridge and see which Thai and Filipino dishes you can cook. A small web app by Norbert Reyes.",
      },
      {
        property: "og:title",
        content: "Fridge to Feast — Norbert Reyes",
      },
      {
        property: "og:description",
        content:
          "Type in your fridge contents and get matching Thai and Filipino recipes with toddler-safety flags.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FridgeToFeast,
});

type Cuisine = "thai" | "filipino";

type Recipe = {
  name: string;
  cuisine: Cuisine;
  ingredients: string[];
  toddlerSafe: boolean;
  timeMinutes: number;
};

type MatchResult = {
  name: string;
  cuisine: Cuisine;
  matchPercent: number;
  missingIngredients: string[];
  toddlerSafe: boolean;
  timeMinutes: number;
};

const RECIPES: Recipe[] = [
  {
    name: "Pad Thai",
    cuisine: "thai",
    ingredients: [
      "rice noodles",
      "eggs",
      "tofu",
      "peanuts",
      "bean sprouts",
      "garlic",
      "fish sauce",
    ],
    toddlerSafe: false,
    timeMinutes: 25,
  },
  {
    name: "Green Curry",
    cuisine: "thai",
    ingredients: [
      "coconut milk",
      "chicken",
      "rice",
      "curry paste",
      "fish sauce",
      "bell pepper",
      "onion",
    ],
    toddlerSafe: false,
    timeMinutes: 35,
  },
  {
    name: "Mango Sticky Rice",
    cuisine: "thai",
    ingredients: ["rice", "mango", "coconut milk", "sugar", "salt"],
    toddlerSafe: true,
    timeMinutes: 30,
  },
  {
    name: "Tom Yum Soup",
    cuisine: "thai",
    ingredients: [
      "chicken",
      "mushrooms",
      "lemongrass",
      "fish sauce",
      "chili",
      "lime",
      "cilantro",
    ],
    toddlerSafe: false,
    timeMinutes: 25,
  },
  {
    name: "Adobo",
    cuisine: "filipino",
    ingredients: ["chicken", "soy sauce", "vinegar", "garlic", "onion", "rice"],
    toddlerSafe: true,
    timeMinutes: 40,
  },
  {
    name: "Sinigang",
    cuisine: "filipino",
    ingredients: [
      "pork",
      "tamarind",
      "rice",
      "kangkong",
      "onion",
      "garlic",
      "radish",
    ],
    toddlerSafe: true,
    timeMinutes: 50,
  },
  {
    name: "Lumpia",
    cuisine: "filipino",
    ingredients: [
      "ground pork",
      "carrots",
      "garlic",
      "spring roll wrappers",
      "onion",
    ],
    toddlerSafe: true,
    timeMinutes: 35,
  },
  {
    name: "Halo-Halo",
    cuisine: "filipino",
    ingredients: ["sweet beans", "coconut milk", "rice", "sugar", "ice"],
    toddlerSafe: true,
    timeMinutes: 20,
  },
];

function findMatches(
  fridgeIngredients: string[],
  recipes: Recipe[]
): MatchResult[] {
  const normalizedFridge = fridgeIngredients.map((ing) =>
    ing.trim().toLowerCase()
  );

  const results: MatchResult[] = recipes.map((recipe) => {
    const missingIngredients = recipe.ingredients.filter(
      (ingredient) =>
        !normalizedFridge.includes(ingredient.trim().toLowerCase())
    );
    const matchCount = recipe.ingredients.length - missingIngredients.length;
    const matchPercent =
      recipe.ingredients.length > 0
        ? Math.round((matchCount / recipe.ingredients.length) * 100)
        : 0;

    return {
      name: recipe.name,
      cuisine: recipe.cuisine,
      matchPercent,
      missingIngredients,
      toddlerSafe: recipe.toddlerSafe,
      timeMinutes: recipe.timeMinutes,
    };
  });

  return results.sort((a, b) => b.matchPercent - a.matchPercent);
}

function ResultCard({ result }: { result: MatchResult }) {
  return (
    <article className="rounded-xl border border-border bg-card/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight">
            {result.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            {result.cuisine === "thai" ? "Thai" : "Filipino"} ·{" "}
            {result.timeMinutes} min
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-border px-2 py-1 font-mono text-xs font-semibold text-primary">
          {result.matchPercent}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${result.matchPercent}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {result.toddlerSafe && (
          <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">
            Toddler-safe
          </span>
        )}
        {result.missingIngredients.length > 0 ? (
          <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
            Missing: {result.missingIngredients.join(", ")}
          </span>
        ) : (
          <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">
            You have everything
          </span>
        )}
      </div>
    </article>
  );
}

function FridgeToFeast() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleAdd = () => {
    const ingredients = input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (ingredients.length === 0) {
      setResults(null);
      return;
    }
    setResults(findMatches(ingredients, RECIPES).slice(0, 5));
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-background font-sans text-foreground antialiased"
    >
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-5">
          <Link
            to="/"
            className="font-mono text-sm font-medium tracking-tight"
          >
            norby<span className="text-primary">.ca</span>
          </Link>
          <Link
            to="/"
            hash="projects"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All projects
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="hero-grid pointer-events-none absolute inset-0"
          />
          <div className="relative mx-auto w-full max-w-2xl px-5 py-16">
            <p className="font-mono text-xs text-primary">P·04</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Fridge to Feast
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Type in what's in your fridge, separated by commas, and see
              which Thai and Filipino dishes you can cook right now — with
              toddler-safety flags for family meals.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-card/60 p-5">
              <label
                htmlFor="ingredients"
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                Fridge contents
              </label>
              <textarea
                id="ingredients"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. chicken, rice, coconut milk"
                rows={3}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Find dishes
              </button>
            </div>

            {results !== null && (
              <div className="mt-8">
                {results.length > 0 ? (
                  <div className="grid gap-3">
                    {results.map((result) => (
                      <ResultCard key={result.name} result={result} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No matches yet — try adding a few more ingredients.
                  </p>
                )}
              </div>
            )}

            <p className="mt-10 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
              8 dishes · Thai &amp; Filipino · Milestone 1 of the build
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-6">
          <p className="font-mono text-[11px] text-muted-foreground">
            © 2026 Norbert Reyes · norby.ca
          </p>
          <a
            href="#top"
            className="font-mono text-[11px] text-primary transition-colors hover:text-foreground"
          >
            TOP ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
