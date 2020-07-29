const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// -----------------------------------------------------------------

// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
// https://www.themealdb.com/api/json/v1/1/random.php
// https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772

// -----------------------------------------------------------------
// Searches for meal

function searchMeal(e) {
  e.preventDefault();

  // Clear the single meal
  single_mealEl.innerHTML = ""

  // getting typed search value
  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((response) => response.json())
      .then(data => {
        // console.log(data);
        resultHeading.innerHTML = `<h2>Search results for term '${term}':</h2>`;


        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>There are no search results for '${term}'. Try a different one</h2>`
        } else {
          mealsEl.innerHTML = data.meals
            .map(meal => `
                <div class="meal">
                  <img src=${meal.strMealThumb}>
                  <div data-mealID="${meal.idMeal}" class="meal-info">
                    <h3>
                      ${meal.strMeal}
                    </h3>
                  </div>
                </div>
            `).join("")
        }
      })
    // clearing Search Text
    search.value = ""
  } else {
    alert("Type Something To Search")
  }
}

// Get MEal using the id
function getMealByID(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal)
    })
}

// Add meal To the DOM

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i < 21; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      break
    }
  }
  console.log(ingredients);

  single_mealEl.innerHTML = `
    <div class='single-meal'>
      <h1>${meal.strMeal}</h1>
      <img src='${meal.strMealThumb}'>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>This meal is from ${meal.strArea} ❤ </p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}
// Random meal

function getAMeal() {
  mealsEl.innerHTML = ""
  resultHeading.innerHTML = ""
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0]
      addMealToDOM(meal)
    })
}

// Event Listeners

submit.addEventListener("submit", searchMeal)
random.addEventListener("click", getAMeal)

mealsEl.addEventListener("click", (e) => {
  // This checks for all the elemnts in the mealsEl with a class of  meal-info
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info")
    } else {
      return false
    }

  })
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid")
    getMealByID(mealID)
    // console.log(mealID);
  }
})