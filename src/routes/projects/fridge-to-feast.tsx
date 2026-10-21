import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";

export const Route = createFileRoute("/projects/fridge-to-feast")({
  head: () => ({
    meta: [
      {
        title: "Fridge to Feast — Norbert Reyes",
      },
      {
        name: "description",
        content:
          "Fridge to Feast: type in what's in your fridge or snap a fridge photo and see which Thai and Filipino dishes you can cook. A small web app by Norbert Reyes.",
      },
      {
        property: "og:title",
        content: "Fridge to Feast — Norbert Reyes",
      },
      {
        property: "og:description",
        content:
          "Type in your fridge contents or snap a photo, and get matching Thai and Filipino recipes with toddler-safety flags.",
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
  const normalizedFridge = fridgeIngredients
    .map((ing) => ing.trim().toLowerCase())
    .filter((ing) => ing.length > 0);

  const results: MatchResult[] = recipes.map((recipe) => {
    const missingIngredients = recipe.ingredients.filter(
      (ingredient) =>
        !normalizedFridge.some(
          (fridgeItem) =>
            fridgeItem.includes(ingredient.trim().toLowerCase()) ||
            ingredient.trim().toLowerCase().includes(fridgeItem)
        )
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

// Milestone 2: real vision detection via the Gemini API.
// The visitor's own API key is used (stored only in their browser) —
// this static site has no backend to keep a key secret on.
const API_KEY_STORAGE = "fridge-to-feast-gemini-key";

// Downscale a photo before sending it — keeps uploads fast and costs low.
function fileToBase64(
  file: File
): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1024;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process the photo."));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      resolve({ data: dataUrl.split(",")[1], mimeType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that photo file."));
    };
    img.src = url;
  });
}

// Ask Gemini Vision for every food item in the photo, with portions.
async function detectIngredients(
  apiKey: string,
  image: { data: string; mimeType: string }
): Promise<string[]> {
  const prompt =
    "List every food item visible in this photo of a fridge or pantry — " +
    "proteins, vegetables, condiments, spices, everything. For each item, " +
    "give the food name and an estimated portion (for example ~300g, ~1 can, x6). " +
    'Respond ONLY with a JSON array like [{"item":"chicken breast","portion":"~300g"}]. ' +
    "If no food is visible, respond with [].";

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: { mime_type: image.mimeType, data: image.data },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    if (res.status === 400 || res.status === 403) {
      throw new Error(
        "The vision API rejected the request — check that the API key below is valid."
      );
    }
    if (res.status === 402) {
      throw new Error(
        "The vision API says payment is required — the API balance may be empty."
      );
    }
    throw new Error(`The vision API returned an error (${res.status}).`);
  }

  const json = await res.json();
  const text: string =
    json?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "";

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error("Couldn't read any ingredients from that photo.");
  }

  const parsed: Array<{ item?: string; portion?: string }> = JSON.parse(
    match[0]
  );
  return parsed
    .filter((d) => typeof d.item === "string" && d.item.trim().length > 0)
    .map((d) =>
      d.portion ? `${d.item!.trim()} ${d.portion.trim()}` : d.item!.trim()
    );
}

function FridgeToFeast() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(
    () =>
      (typeof window !== "undefined" &&
        window.localStorage.getItem(API_KEY_STORAGE)) ||
      ""
  );

  const saveApiKey = (value: string) => {
    setApiKey(value);
    try {
      window.localStorage.setItem(API_KEY_STORAGE, value);
    } catch {
      // localStorage unavailable — the key just won't persist between visits.
    }
  };

  const handleAdd = () => {
    const ingredients = input
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (ingredients.length === 0) {
      setResults(null);
      return;
    }
    setResults(findMatches(ingredients, RECIPES).slice(0, 5));
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image — please choose a photo of your fridge.");
      return;
    }

    if (!apiKey.trim()) {
      setError(
        "Add your Gemini API key in the field below first — photo detection runs on your own key, stored only in this browser."
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Real vision call: photo → Gemini → detected items with portions
    try {
      const image = await fileToBase64(file);
      const detectedItems = await detectIngredients(apiKey.trim(), image);

      if (detectedItems.length === 0) {
        setError("No food spotted in that photo — try a closer, brighter shot.");
        setIsProcessing(false);
        return;
      }

      // Append, never replace, what the user already typed
      const currentInput = input.trim();
      const newList = currentInput
        ? currentInput + "\n" + detectedItems.join("\n")
        : detectedItems.join("\n");

      setInput(newList);
      setIsProcessing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process photo. Please try again."
      );
      setIsProcessing(false);
    }
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
              Type in what's in your fridge, or snap a photo of it, and see
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
                placeholder={"e.g. chicken, rice, coconut milk"}
                rows={3}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
                Comma- or newline-separated · photo items are appended below
                what you've typed
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  {isProcessing ? "Analysing…" : "Snap Fridge Photo"}
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Find dishes
                </button>
              </div>
              <div className="mt-5 border-t border-border pt-4">
                <label
                  htmlFor="vision-key"
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
                >
                  Gemini API key (for photo detection)
                </label>
                <input
                  id="vision-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  placeholder="Paste your Gemini API key — kept only in this browser"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground/70">
                  Photo detection uses your own Gemini key, stored only in
                  this browser and sent only to Google's API. Typing
                  ingredients by hand always works without a key.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-destructive">
                  Error
                </p>
                <p className="mt-1 text-sm text-foreground">{error}</p>
              </div>
            )}

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
              8 dishes · Thai &amp; Filipino · Milestone 2: photo input
              (append) — real Gemini vision detection
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
