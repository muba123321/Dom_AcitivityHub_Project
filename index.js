
/*-- creating the menu classes to apply styling from CSS --*/
const menuBar = document.querySelector("#menuBar");
menuBar.style.height = "100%";
menuBar.classList.add("menu_bar");

/*-- creating the menu items classes to apply styling from CSS --*/
const menuLinks = document.querySelectorAll("#hLink, #cLink");
menuLinks.forEach((link) => link.classList.add("menu_links"));
