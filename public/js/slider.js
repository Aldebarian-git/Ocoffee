document.addEventListener("DOMContentLoaded", () => {
  const articles = document.querySelectorAll(".article-news-nouveaute");
  const prevBtn = document.querySelector(".last-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentIndex = 0;

  function updateNewsDisplay(direction) {
    // Supprimer la classe active de l'article actuel
    articles[currentIndex].classList.remove("activ");

    // Calculer l'index du nouvel article en fonction de la direction
    if (direction === "next") {
      currentIndex = (currentIndex + 1) % articles.length; // Si on dépasse, recommence au début
    } else {
      currentIndex = (currentIndex - 1 + articles.length) % articles.length; // Si on est au début, recommence à la fin
    }

    // Ajouter la classe active à l'article suivant
    articles[currentIndex].classList.add("activ");
  }

  // Bouton suivant
  nextBtn.addEventListener("click", () => {
    updateNewsDisplay("next");
  });

  // Bouton précédent
  prevBtn.addEventListener("click", () => {
    updateNewsDisplay("prev");
  });

  // Afficher la première carte au chargement
  articles[currentIndex].classList.add("activ");
});
