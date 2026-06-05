import fs from "fs";
import path from "path";

const categoriesPath = path.join(process.cwd(), "content/categories.json");

/**
 * Read the current category list from the local JSON file.
 * Used at build time for static generation.
 */
export function getCategories(): string[] {
  try {
    if (!fs.existsSync(categoriesPath)) return [];
    const raw = fs.readFileSync(categoriesPath, "utf8");
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
