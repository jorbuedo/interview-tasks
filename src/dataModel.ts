/**
 * This task explanation is a bit vague and open ended, which is in
 * itself a recipe for disaster.
 * Example usage on the test file.
 */

interface Recipe {
  name: string
  ingredients: Array<Ingredient>
}

interface Ingredient {
  name: IngredientName
  allergens: Array<Allergen>
  foodTypes: Array<FoodType>
  // Let's assume the calories of a regular serving of the ingredient
  calories: number
}

export const hasAllergens =
  (allergens: Array<Allergen>) => (recipe: Recipe) => {
    return Boolean(
      recipe.ingredients.find((ingredient) =>
        Boolean(
          ingredient.allergens.find((allergen) => allergens.includes(allergen))
        )
      )
    )
  }

export const hasFoodTypes =
  (foodTypes: Array<FoodType>) => (recipe: Recipe) => {
    return Boolean(
      recipe.ingredients.find((ingredient) =>
        Boolean(
          ingredient.foodTypes.find((foodType) => foodTypes.includes(foodType))
        )
      )
    )
  }

export const hasIngredients =
  (ingredients: Array<IngredientName>) => (recipe: Recipe) => {
    return Boolean(
      recipe.ingredients.find((ingredient) =>
        ingredients.includes(ingredient.name)
      )
    )
  }

const getNewRecipeName = (oldName: string) => {
  return `custom ${oldName.replace('custom ', '')}`
}

export const removeAllergens =
  (allergens: Array<Allergen>) => (recipe: Recipe) => {
    if (!hasAllergens(allergens)(recipe)) {
      return recipe
    }
    const newRecipe = {
      name: getNewRecipeName(recipe.name),
      ingredients: recipe.ingredients.filter((ingredient) =>
        Boolean(
          ingredient.allergens.find((allergen) => !allergens.includes(allergen))
        )
      ),
    }

    return newRecipe
  }

export const removeFoodTypes =
  (foodTypes: Array<FoodType>) => (recipe: Recipe) => {
    if (!hasFoodTypes(foodTypes)(recipe)) {
      return recipe
    }
    const newRecipe = {
      name: getNewRecipeName(recipe.name),
      ingredients: recipe.ingredients.filter(
        (ingredient) =>
          !ingredient.foodTypes.find((foodType) => foodTypes.includes(foodType))
      ),
    }

    return newRecipe
  }

export const removeIngredients =
  (ingredients: Array<IngredientName>) => (recipe: Recipe) => {
    if (!hasIngredients(ingredients)(recipe)) {
      return recipe
    }

    const newRecipe = {
      name: getNewRecipeName(recipe.name),
      ingredients: recipe.ingredients.filter(
        (ingredient) => !ingredients.includes(ingredient.name)
      ),
    }

    return newRecipe
  }

/**
 * This way is a bit iffy. May be better to add a quantity modifier to the
 * ingredients. But without a better acceptance criteria, the KISS principle
 * applies.
 */
export const doubleIngredients =
  (ingredients: Array<IngredientName>) => (recipe: Recipe) => {
    if (!hasIngredients(ingredients)(recipe)) {
      return recipe
    }

    const newRecipe = {
      name: getNewRecipeName(recipe.name),
      ingredients: recipe.ingredients.flatMap((ingredient) =>
        ingredients.includes(ingredient.name)
          ? [ingredient, ingredient]
          : [ingredient]
      ),
    }

    return newRecipe
  }

export const getCalories = (recipe: Recipe) => {
  return recipe.ingredients.reduce(
    (calories, ingredient) => calories + ingredient.calories,
    0
  )
}

/**
 * Allergen and FoodTypes would be better of as entries coming from a data
 * store, like a db. But for the purposes of this test, literal types should
 * suffice.
 */
type Allergen =
  | 'gluten'
  | 'crustacean'
  | 'mollusk'
  | 'egg'
  | 'fish'
  | 'peanut'
  | 'soy'
  | 'dairy'
  | 'nuts'
  | 'celery'
  | 'sulfites'
  | 'sesame'
  | 'lupine'
  | 'mustard'

type FoodType =
  | 'vegetable'
  | 'meat'
  | 'fish'
  | 'insect'
  | 'mushroom'
  | 'nut'
  | 'shellfish'
  | 'seafood'
  | 'fruit'
  | 'sauce'
  | 'dairy'
  | 'protein'
  | 'fat'
  | 'cheese'
  | 'grain'
  | 'spice'

type IngredientName =
  | 'mozzarella'
  | 'parmesan'
  | 'gouda'
  | 'goat cheese'
  | 'ricotta'
  | 'cheddar'
  | 'pecorino romano'
  | 'blue cheese'
  | 'provolone'
  | 'dough'
  | 'cherry'
  | 'olive oil'
  | 'button'
  | 'shitake'
  | 'portabella'
  | 'cremini'
  | 'morel'
  | 'truffle'
  | 'onion'
  | 'corn'
  | 'pinapple'
  | 'olive'
  | 'oregano'
  | 'basil'
  | 'thyme'
  | 'ham'
  | 'beef'
  | 'chicken'
  | 'bacon'
  | 'pepperoni'
  | 'tuna'
  | 'salmon'
  | 'shrimp'
  | 'jalapeño pepper'
  | 'tomato'
  | 'barbacue'
  | 'spicy sauce'
  | 'carbonara'

/**
 * These definitely shouldn't be hardcoded in the source code.
 * Ask the real calories to a real nutritionist.
 */
const ingredients: Array<Ingredient> = [
  {
    name: 'mozzarella',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 53,
  },
  {
    name: 'parmesan',
    allergens: ['dairy', 'egg'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 86,
  },
  {
    name: 'gouda',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 32,
  },
  {
    name: 'goat cheese',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 51,
  },
  {
    name: 'ricotta',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 97,
  },
  {
    name: 'cheddar',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 56,
  },
  {
    name: 'pecorino romano',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 63,
  },
  {
    name: 'blue cheese',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 23,
  },
  {
    name: 'provolone',
    allergens: ['dairy'],
    foodTypes: ['protein', 'cheese', 'dairy'],
    calories: 45,
  },
  {
    name: 'dough',
    allergens: ['gluten', 'soy'],
    foodTypes: ['grain'],
    calories: 200,
  },
  {
    name: 'cherry',
    allergens: [],
    foodTypes: ['vegetable'],
    calories: 1,
  },
  {
    name: 'olive oil',
    allergens: [],
    foodTypes: ['fat'],
    calories: 50,
  },
  {
    name: 'button',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 12,
  },
  {
    name: 'shitake',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 14,
  },
  {
    name: 'portabella',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 15,
  },
  {
    name: 'cremini',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 16,
  },
  {
    name: 'morel',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 11,
  },
  {
    name: 'truffle',
    allergens: [],
    foodTypes: ['mushroom'],
    calories: 10,
  },
  {
    name: 'onion',
    allergens: [],
    foodTypes: ['vegetable'],
    calories: 23,
  },
  {
    name: 'corn',
    allergens: [],
    foodTypes: ['vegetable', 'grain', 'fruit'],
    calories: 33,
  },
  {
    name: 'pinapple',
    allergens: [],
    foodTypes: ['fruit'],
    calories: 44,
  },
  {
    name: 'olive',
    allergens: ['sulfites'],
    foodTypes: ['vegetable'],
    calories: 22,
  },
  {
    name: 'oregano',
    allergens: ['gluten'],
    foodTypes: ['spice'],
    calories: 1,
  },
  {
    name: 'basil',
    allergens: [],
    foodTypes: ['spice'],
    calories: 2,
  },
  {
    name: 'thyme',
    allergens: [],
    foodTypes: ['spice'],
    calories: 3,
  },
  {
    name: 'ham',
    allergens: ['soy', 'dairy'],
    foodTypes: ['meat', 'protein'],
    calories: 78,
  },
  {
    name: 'beef',
    allergens: ['soy'],
    foodTypes: ['meat', 'protein'],
    calories: 88,
  },
  {
    name: 'chicken',
    allergens: ['soy', 'dairy'],
    foodTypes: ['meat', 'protein'],
    calories: 55,
  },
  {
    name: 'bacon',
    allergens: [],
    foodTypes: ['meat', 'protein', 'fat'],
    calories: 99,
  },
  {
    name: 'pepperoni',
    allergens: ['soy', 'dairy', 'mustard'],
    foodTypes: ['meat', 'protein', 'fat'],
    calories: 89,
  },
  {
    name: 'tuna',
    allergens: ['fish'],
    foodTypes: ['fish', 'seafood'],
    calories: 44,
  },
  {
    name: 'salmon',
    allergens: ['fish'],
    foodTypes: ['fish', 'seafood'],
    calories: 55,
  },
  {
    name: 'shrimp',
    allergens: ['crustacean', 'sulfites'],
    foodTypes: ['seafood'],
    calories: 77,
  },
  {
    name: 'jalapeño pepper',
    allergens: [],
    foodTypes: ['vegetable'],
    calories: 22,
  },
  {
    name: 'tomato',
    allergens: ['sulfites', 'dairy'],
    foodTypes: ['sauce'],
    calories: 25,
  },
  {
    name: 'barbacue',
    allergens: ['celery', 'dairy'],
    foodTypes: ['sauce'],
    calories: 40,
  },
  {
    name: 'spicy sauce',
    allergens: ['sulfites', 'dairy'],
    foodTypes: ['sauce'],
    calories: 30,
  },
  {
    name: 'carbonara',
    allergens: ['dairy'],
    foodTypes: ['sauce'],
    calories: 60,
  },
]

/**
 * This would be SQL or similar if the data was in a db
 */
const getIngredients = (...ingredient: Array<IngredientName>) =>
  ingredients.filter(({ name }) => ingredient.includes(name))

/**
 * OMG what have I done? Now I'll have to open an italian restaurant.
 */
export const recipes: Array<Recipe> = [
  {
    name: 'americana',
    ingredients: getIngredients(
      'dough',
      'pepperoni',
      'bacon',
      'onion',
      'mozzarella',
      'tomato'
    ),
  },
  {
    name: 'barbacue',
    ingredients: getIngredients(
      'dough',
      'beef',
      'bacon',
      'onion',
      'mozzarella',
      'barbacue'
    ),
  },
  {
    name: 'carbonara',
    ingredients: getIngredients(
      'dough',
      'ham',
      'button',
      'onion',
      'mozzarella',
      'carbonara'
    ),
  },
  {
    name: 'cheese lovers',
    ingredients: getIngredients(
      'dough',
      'mozzarella',
      'blue cheese',
      'cheddar',
      'gouda',
      'tomato'
    ),
  },
  {
    name: 'hawaii',
    ingredients: getIngredients(
      'dough',
      'pinapple',
      'ham',
      'mozzarella',
      'tomato'
    ),
  },
  {
    name: 'kebab',
    ingredients: getIngredients(
      'dough',
      'chicken',
      'onion',
      'cherry',
      'mozzarella',
      'spicy sauce',
      'tomato'
    ),
  },
  {
    name: 'margarita',
    ingredients: getIngredients('dough', 'mozzarella', 'tomato'),
  },
  {
    name: 'meat lovers',
    ingredients: getIngredients(
      'dough',
      'beef',
      'bacon',
      'pepperoni',
      'ham',
      'mozzarella',
      'tomato'
    ),
  },
  {
    name: 'chicken',
    ingredients: getIngredients(
      'dough',
      'chicken',
      'button',
      'corn',
      'mozzarella',
      'tomato'
    ),
  },
  {
    name: 'supreme',
    ingredients: getIngredients(
      'dough',
      'beef',
      'pepperoni',
      'onion',
      'jalapeño pepper',
      'mozzarella',
      'button'
    ),
  },
  {
    name: 'veggie',
    ingredients: getIngredients(
      'dough',
      'onion',
      'corn',
      'jalapeño pepper',
      'button',
      'mozzarella',
      'tomato'
    ),
  },
  {
    name: 'cheese haven',
    ingredients: getIngredients(
      'dough',
      'mozzarella',
      'parmesan',
      'gouda',
      'goat cheese',
      'blue cheese',
      'ricotta',
      'provolone',
      'pecorino romano'
    ),
  },
  {
    name: 'mediterranean',
    ingredients: getIngredients(
      'dough',
      'olive oil',
      'cherry',
      'parmesan',
      'oregano',
      'basil',
      'tomato'
    ),
  },
  {
    name: 'the last of us',
    ingredients: getIngredients(
      'dough',
      'button',
      'shitake',
      'portabella',
      'cremini',
      'morel',
      'truffle',
      'tomato'
    ),
  },
]
