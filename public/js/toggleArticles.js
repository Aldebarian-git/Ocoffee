// toggleArticles.js
function toggleArticlesVisibility() {
  const toggleButton = document.getElementById("toggleAllBtn");
  const articles = document.querySelectorAll(".article-news");

  // Fonction pour afficher/masquer les articles supplémentaires
  toggleButton.addEventListener("click", function () {
    articles.forEach((article) => {
      article.classList.remove("hidden");
    });
  });
}

toggleArticlesVisibility();
