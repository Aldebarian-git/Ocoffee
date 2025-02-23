const notificationContainer = document.querySelector(".notification");
const notificationCloseBtn = document.querySelector(".x-icon");

// Fonction pour afficher le pop-up
function showNotification() {
  notificationContainer.classList.add("show");
}

// Fonction pour cacher le pop-up
function hideNotification() {
  notificationContainer.classList.add("hidden-notification");
  setTimeout(() => {
    notificationContainer.classList.remove("show", "hidden-notification");
  }, 300); // Attendre la fin de l'animation avant de supprimer la classe
}

// Événement pour fermer le pop-up
notificationCloseBtn.addEventListener("click", hideNotification);

// Exemple d'affichage 
setTimeout(showNotification, 100);
