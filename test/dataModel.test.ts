import { describe, expect, test, assert } from 'vitest'
import {
  recipes,
  hasAllergens,
  hasFoodTypes,
  hasIngredients,
  removeIngredients,
  doubleIngredients,
  removeFoodTypes,
  getCalories,
} from '../src/dataModel'

describe('Pizza data model', () => {
  test('when user checks they want to only see pizza with mushrooms', () => {
    const hasMushroom = hasFoodTypes(['mushroom'])
    expect(recipes.filter(hasMushroom).map(({ name }) => name))
      .toMatchInlineSnapshot(`
      [
        "carbonara",
        "chicken",
        "supreme",
        "veggie",
        "the last of us",
      ]
    `)
  })

  test('when user wants to highlight any pizzas that might contain soy in it', () => {
    const hasSoy = hasAllergens(['soy'])
    expect(recipes.filter(hasSoy).map(({ name }) => name))
      .toMatchInlineSnapshot(`
      [
        "americana",
        "barbacue",
        "carbonara",
        "cheese lovers",
        "hawaii",
        "kebab",
        "margarita",
        "meat lovers",
        "chicken",
        "supreme",
        "veggie",
        "cheese haven",
        "mediterranean",
        "the last of us",
      ]
    `)
  })

  test('when user checks they do not want Jalapeño pepper', () => {
    const hasPepper = hasIngredients(['jalapeño pepper'])

    const pizzaWithPepper = recipes.find(hasPepper)
    assert(pizzaWithPepper) // We know there's some on the dataset

    const removePepper = removeIngredients(['jalapeño pepper'])
    const pizzaWithoutPepper = removePepper(pizzaWithPepper)

    const withIngredients = pizzaWithPepper.ingredients.map(({ name }) => name)
    const withoutIngredients = pizzaWithoutPepper.ingredients.map(
      ({ name }) => name
    )

    expect(withIngredients).toContain('jalapeño pepper')
    expect(withoutIngredients).not.toContain('jalapeño pepper')
    expect(withoutIngredients).toEqual(
      expect.arrayContaining(
        withIngredients.filter((i) => i !== 'jalapeño pepper')
      )
    )
  })

  test('when user checks they want double cheese', () => {
    // Cmon, you have to specify what cheese!
    const doubleCheese = doubleIngredients([
      'mozzarella',
      'parmesan',
      'gouda',
      'goat cheese',
      'ricotta',
      'cheddar',
      'pecorino romano',
      'blue cheese',
      'provolone',
    ])
    const margarita = recipes.find(({ name }) => name === 'margarita')
    assert(margarita)

    const doubleCheeseMargarita = doubleCheese(margarita)

    expect(
      margarita.ingredients.filter(({ name }) => name === 'mozzarella').length
    ).toBe(1)

    expect(
      doubleCheeseMargarita.ingredients.filter(
        ({ name }) => name === 'mozzarella'
      ).length
    ).toBe(2)
  })

  test('when user wants to check what the selected pizza will look like with no meat', () => {
    const removeMeat = removeFoodTypes(['meat'])

    const meatLover = recipes.find(({ name }) => name === 'meat lovers')
    assert(meatLover)

    const heartBreak = removeMeat(meatLover)

    expect(heartBreak.ingredients.map(({ name }) => name))
      .toMatchInlineSnapshot(`
        [
          "mozzarella",
          "dough",
          "tomato",
        ]
      `)
  })

  test('when user wants to check what the number of calories will be for the resulting recipe', () => {
    const doubleCheese = doubleIngredients([
      'mozzarella',
      'parmesan',
      'gouda',
      'goat cheese',
      'ricotta',
      'cheddar',
      'pecorino romano',
      'blue cheese',
      'provolone',
    ])
    const cheeseHaven = recipes.find(({ name }) => name === 'cheese haven')
    assert(cheeseHaven)

    const doubleCheeseHaven = doubleCheese(cheeseHaven)

    expect(getCalories(cheeseHaven)).toBeLessThan(
      getCalories(doubleCheeseHaven)
    )

    expect(getCalories(doubleCheeseHaven)).toMatchInlineSnapshot('1100')
  })

  test('just curious what will show up with all the conditions at once', () => {
    const hasMushroom = hasFoodTypes(['mushroom'])
    const hasSoy = hasAllergens(['soy'])
    const removePepper = removeIngredients(['jalapeño pepper'])
    const doubleCheese = doubleIngredients([
      'mozzarella',
      'parmesan',
      'gouda',
      'goat cheese',
      'ricotta',
      'cheddar',
      'pecorino romano',
      'blue cheese',
      'provolone',
    ])
    const removeMeat = removeFoodTypes(['meat'])

    const acceptableRecipes = recipes
      .filter(hasMushroom)
      .filter(hasSoy)
      .map(removePepper)
      .map(doubleCheese)
      .map(removeMeat)
      .map((recipe) => ({ name: recipe.name, calories: getCalories(recipe) }))

    expect(acceptableRecipes).toMatchInlineSnapshot(`
      [
        {
          "calories": 479,
          "name": "custom carbonara",
        },
        {
          "calories": 431,
          "name": "custom chicken",
        },
        {
          "calories": 518,
          "name": "custom supreme",
        },
        {
          "calories": 399,
          "name": "custom veggie",
        },
        {
          "calories": 303,
          "name": "the last of us",
        },
      ]
    `)

    // Get it? The last of us? Because it's all mushrooms! ツ
  })
})
