document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".learn-more");
  const introductionContainer = document.getElementById("introduction");
  const introductionPicture =document.querySelector(".introductionPicture")

  if (btn && introductionContainer) {
    const container = btn.closest(".hidden-content-container");
    const buttonText = btn.querySelector(".button-text");

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      container.classList.toggle("actived");

      if (container.classList.contains("actived")) {
        // ✅ Expand: Augmente la hauteur de #introduction
        introductionContainer.style.maxHeight = "2500px";
        buttonText.textContent = "Réduire";
        introductionPicture.style.display = "none";
      } else {
        // ✅ Collapse: Réinitialise la hauteur
        introductionContainer.style.maxHeight = "";
        buttonText.textContent = "En savoir plus";
        introductionPicture.style.display = "block";
      }
    });
  }
});
