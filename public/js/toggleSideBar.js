const sideBar = document.getElementById("side-bar");
const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  sideBar.classList.toggle("active");
});
