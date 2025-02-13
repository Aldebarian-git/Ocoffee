document.addEventListener("DOMContentLoaded", () => {
  const preferencesSelect = document.getElementById("preferences");
  const articles = document.querySelectorAll(".article-news");

  
  const normalizeString = (str) => {
    return str
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/\s+/g, "") 
      .toLowerCase(); 
  };

  // Fonction pour filtrer les articles
  const filterArticles = (selectedPreference) => {
    const normalizedPreference = normalizeString(selectedPreference);
    console.log(normalizedPreference);

    // Filtrer les articles en fonction de la préférence choisie
    articles.forEach((article) => {
      const articleClasses = article.classList.value; 
      if (normalizedPreference === "" || normalizeString(articleClasses).includes(normalizedPreference)) {
        article.classList.remove("hidden"); 
      } else {
        article.classList.add("hidden");
      }
    });
  };

  // Ajouter un événement pour filtrer les articles lors du changement de sélection
  preferencesSelect.addEventListener("change", (event) => {
    filterArticles(event.target.value); 
  });
});


