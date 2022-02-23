const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("search-input");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

// event listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
input.addEventListener("keyup", enterKey);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
  document.getElementById("ytPlayer").removeAttribute("src", null);
});

// get meal list sesuai sama ingredients
function getMealList() {
  let searchInputTxt = input.value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item meal-hover" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                    <div class = "meal-name">
                            <h3 class="text-center fw-bold">${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn d-flex justify-content-center align-items-stretch btn btn-outline-warning">Lihat Resep</a>
                        </div>
                    </div>
                `;
        });
        console.log(data.meals);
        mealList.classList.remove("notFound");
      } else {
        html =
          "Maaf kami tidak dapat menemukan makanan dengan bahan ini. Gunakan kata dalam bahasa inggris saat memasukkan bahan.";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// Trigger Button with Enter (keyCode == 13 is Enter)
function enterKey(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let linkYoutube = meal.strYoutube;
  console.log(linkYoutube);
  let idYoutube = linkYoutube.split("=");
  console.log(idYoutube[1]);
  let html = `
          <h2 class = "recipe-title">${meal.strMeal}</h2>
          <p class = "recipe-category">${meal.strCategory}</p>
          <div class = "recipe-instruct">
              <h3>Instructions:</h3>
              <p>${meal.strInstructions}</p>
          </div>
          <div class = "recipe-link d-flex justify-content-center">
              <iframe id="ytPlayer" width="560" height="315" src="https://www.youtube.com/embed/${idYoutube[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
      `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
