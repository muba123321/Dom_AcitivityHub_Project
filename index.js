/*-- creating the menu classes to apply styling from CSS --*/
const menuBar = document.querySelector("#menuBar");
menuBar.style.height = "100%";
menuBar.classList.add("menu_bar");

/*-- creating the menu items classes to apply styling from CSS --*/
const menuLinks = document.querySelectorAll("#hLink, #cLink");
menuLinks.forEach((link) => link.classList.add("menu_links"));

// Lets toggle between the home and create activity page

const homeLink = document.getElementById("hLink");
const createLink = document.getElementById("cLink");

homeLink.addEventListener("click", () => {
  console.log();
  toggleMenu("home");
});
createLink.addEventListener("click", () => {
  toggleMenu("activity");
});

function toggleMenu(page) {
  const homePage = document.getElementById("home_page");
  const createPage = document.getElementById("activity_page");
  homePage.classList.remove("active");
  createPage.classList.remove("active");
  if (page === "home") {
    homePage.classList.add("active");
    createPage.classList.remove("active");
  } else if (page === "activity") {
    createPage.classList.add("active");
    homePage.classList.remove("active");
  }
}

const onlineRadio = document.getElementById("online");
const physicalRadio = document.getElementById("physical");
const onlineLinkTextArea = document.getElementById("online-link-textarea");
const physicaladdressTextArea = document.getElementById(
  "physical-address-textarea"
);

onlineRadio.addEventListener("change", () => {
  if (onlineRadio.checked) {
    onlineLinkTextArea.style.display = "block";
    physicaladdressTextArea.style.display = "none";
  }
});

physicalRadio.addEventListener("change", () => {
  if (physicalRadio.checked) {
    onlineLinkTextArea.style.display = "none";
    physicaladdressTextArea.style.display = "block";
  }
});

toggleMenu("home");
