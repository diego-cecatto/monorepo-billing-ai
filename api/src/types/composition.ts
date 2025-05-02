export interface Product {
  name: string;
  ingredients: Record<string, Ingredient>;
  isGlutenFree: boolean;
  isNutFree: boolean;
  isVegetarian: boolean;
  isLactoseFree: boolean;
  allergens: string[];
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: Unit;
}

export enum Unit {
  Milliliter = "ml",
  Gram = "g",
  Kilogram = "kg",
  Pound = "lb",
  Teaspoon = "tsp",
  Tablespoon = "tbsp",
  Cup = "cup",
}
