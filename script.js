const searchBtn = document.querySelector("#search-btn");
const typedText = document.querySelector("#search-box");
const searchDisplay = document.querySelector("#search-result");
const searchComment = document.querySelector("#search-comment");

searchBtn.addEventListener("click", searched);
typedText.addEventListener("keydown", searched);

function searched(e) {
  if (typedText.value.length <= 0) return;

  if (e.key === "Enter" || e.type === "click")
    produceSearchResults(typedText.value);
}

async function loadResults(searchTerm) {
  const link =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchTerm;
  try {
    const response = await fetch(link);

    const data = await response.json();

    if (!data.meals) return [];

    const searchResults = [];

    for (let i = 0; i < data.meals.length; i++) {
      const currentMeal = {};
      currentMeal.name = data.meals[i].strMeal;
      currentMeal.thumbnail = data.meals[i].strMealThumb;
      currentMeal.youtube = data.meals[i].strYoutube;
      currentMeal.ingredients = Object.entries(data.meals[i])
        .filter(
          ([key, value]) => key.startsWith("strIngredient") && value.length > 0,
        )
        .map(([key, value]) => value);

      currentMeal.instructions = data.meals[i].strInstructions.replace(
        /[\r\n]/g,
        " ",
      );

      searchResults.push(currentMeal);
    }

    return searchResults;
  } catch (error) {
    searchComment.textContent = "could not load results, try again";
    searchBtn.disabled = false;
  }
}

async function produceSearchResults(searchTerm) {
  searchBtn.disabled = true;
  searchDisplay.innerHTML = "";
  searchComment.classList.add("search-comment");
  searchComment.innerHTML = `<span class="loading"></span>Searching for ${searchTerm}...`;
  try {
    const results = await loadResults(searchTerm);
    if (Array.isArray(results) && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const currentItem = results[i];

        searchComment.textContent = `Search results for ${searchTerm}:`;
        const scrollToInfo = document.createElement("a");
        scrollToInfo.href = "#meal-information";
        scrollToInfo.classList.add("scroll-to-info");

        const card = document.createElement("div");
        card.classList.add("recipe-card");

        const img = document.createElement("img");
        img.src = currentItem.thumbnail;
        img.alt = "recipe image";
        img.classList.add("recipe-image");

        card.appendChild(img);

        const recipeInfo = document.createElement("div");
        recipeInfo.textContent = currentItem.name;
        recipeInfo.classList.add("recipe-info");

        const resultTag = document.createElement("small");
        resultTag.textContent = searchTerm;
        resultTag.classList.add("tag");

        recipeInfo.appendChild(resultTag);

        card.appendChild(recipeInfo);

        card.addEventListener("click", () => {
          mealInformation(currentItem, searchTerm);
        });

        scrollToInfo.appendChild(card);

        searchDisplay.appendChild(scrollToInfo);
      }
      searchBtn.disabled = false;
    } else {
      searchComment.textContent = "could not load results, try again";
      searchBtn.disabled = false;
    }
  } catch (error) {
    searchComment.textContent = "could not load results, try again";
    searchBtn.disabled = false;
  }
}

const mealDashboard = document.querySelector(".food-content");

function mealInformation(currentItem, searchTerm) {
  mealDashboard.innerHTML = "";
  const foodInfo = document.createElement("div");
  foodInfo.classList.add("food-info");

  const img = document.createElement("img");
  img.src = currentItem.thumbnail;
  img.alt = "food-image";
  foodInfo.appendChild(img);

  const h3 = document.createElement("h3");
  h3.textContent = currentItem.name;
  foodInfo.appendChild(h3);

  const small = document.createElement("small");
  small.textContent = searchTerm;
  foodInfo.appendChild(small);
  mealDashboard.appendChild(foodInfo);

  const h4 = document.createElement("h4");
  h4.textContent = "Instructions";
  mealDashboard.appendChild(h4);

  const p = document.createElement("p");
  p.textContent = currentItem.instructions;
  mealDashboard.appendChild(p);

  const ingredientsHeading = document.createElement("h4");
  ingredientsHeading.textContent = "Ingredients";
  ingredientsHeading.style.color = "#181818";
  mealDashboard.appendChild(ingredientsHeading);

  const ul = document.createElement("ul");

  for (let i of currentItem.ingredients) {
    const li = document.createElement("li");

    const checkMark = document.createElement("i");
    checkMark.classList.add("fas", "fa-check");

    li.appendChild(checkMark);
    li.textContent = i;

    ul.appendChild(li);
  }

  mealDashboard.appendChild(ul);

  const a = document.createElement("a");
  a.href = currentItem.youtube;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.classList.add("youtube-link");

  const youtubeBtn = document.createElement("button");
  youtubeBtn.classList.add("youtube-btn");

  const youtubeIcon = document.createElement("i");
  youtubeIcon.classList.add("fab", "fa-youtube");
  youtubeBtn.appendChild(youtubeIcon);
  youtubeBtn.appendChild(document.createTextNode(" Watch Video"));

  a.appendChild(youtubeBtn);
  mealDashboard.appendChild(a);
}

const backBtn = document.querySelector(".back-btn");
backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchDisplay.scrollIntoView({ behavior: "smooth" });
  mealDashboard.innerHTML = "";
});
