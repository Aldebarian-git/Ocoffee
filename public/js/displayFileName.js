document.getElementById("file").addEventListener("change", function () {
  const fileName = this.files[0]
    ? this.files[0].name
    : "Aucun fichier sélectionné";
  document.getElementById("file-name").textContent = fileName + "✔️";
});
