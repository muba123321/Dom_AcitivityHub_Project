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

// Creating Form submission functionality with event listner
const activityForm = document.getElementById("activity_form");
const activityList = document.getElementById("listed_activities");

activityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("activity-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const description = document
    .getElementById("activity-description")
    .value.trim();
  const type = document.getElementById("activity-type").value.trim();
  const date = document.getElementById("activity-date").value.trim();
  const time = document.getElementById("activity-time").value.trim();
  const online = onlineRadio.checked;
  const physical = physicalRadio.checked;
  const zoomlink = online
    ? document.getElementById("online-link").value.trim()
    : "";
  const physicaladdress = physical
    ? document.getElementById("address").value.trim()
    : "";
  const image = document.getElementById("activity-image").files[0];

  // Image validation we ensure the image is not empty and to accept only jpeg and png only
  if (!image) {
    alert("Please upload an image for the activity.");
    return;
  }

  const validImageTypes = ["image/jpeg", "image/png"];
  if (!validImageTypes.includes(image.type)) {
    alert("Please upload a valid image file (JPEG or PNG).");
    return;
  }

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Phone number validation
  const phonePattern = /^[0-9]{10,15}$/; // we assume phone number length is between 10 and 15 digits
  if (!phonePattern.test(phone)) {
    alert("Please enter a valid phone number containing only digits.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push({
      name,
      email,
      phone,
      description,
      type,
      date,
      time,
      location: online ? zoomlink : physicaladdress,
      locationType: online ? "Online" : "Physical",
      imageUrl,
    });
    localStorage.setItem("activities", JSON.stringify(activities));

    // Update the activity list
    updateActivityList();
    // Switch back to home section
    toggleMenu("home");
  };
  reader.readAsDataURL(image);
});

function updateActivityList() {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activityList.innerHTML = "";

  if (activities.length === 0) {
    activityList.innerHTML = `<p>No activities yet. <br />Click the create Activities button on the top menu or the add button below <br />Create your First Activity!!!</p>
    <div id= "add_button" style="display: flex; justify-content: center; align-items: center; width: 600px; height: 400px; margin: 0 auto; border: solid black 1px">
      <i class='fas fa-plus' style="font-size: 90px;"></i>
    </div>`;

    // the button functionality is called after the updateActivityList function is initialized
    // This is to add a new activity after making sure the widget is built on the DOM when activities.length === 0.

    const addButton = document.querySelector("#add_button");

    if (addButton) {
      addButton.addEventListener("click", () => {
        toggleMenu("activity");
      });
    }
    return;
  }

  // Create a DocumentFragment for efficient DOM updates to store elements on the DOM before actually display in the homepage after creating an activity. 
  const fragment = document.createDocumentFragment();

  activities.forEach((activity, index) => {
    const li = document.createElement("li");

    // This is to create activity name
    const name = document.createElement("h3");
    name.textContent = activity.name;
    li.appendChild(name);

    // This is to create an image element if there's an image
    if (activity.imageUrl) {
      const img = document.createElement("img");
      img.src = activity.imageUrl;
      img.alt = activity.name;
      li.appendChild(img);
    }

    // This is to create activity description
    const description = document.createElement("p");
    description.textContent = `Description: ${activity.description}`;
    li.appendChild(description);

    // This is to create activity type
    const type = document.createElement("p");
    type.textContent = `Type: ${activity.type}`;
    li.appendChild(type);

    // This is to create activity date and time
    const dateTime = document.createElement("p");
    dateTime.textContent = `Date: ${activity.date} Time: ${activity.time}`;
    li.appendChild(dateTime);

    // This is to create activity location either online or physical location
    const location = document.createElement("p");
    if (activity.online) {
      location.textContent = `Location: Online (Zoom Link: ${activity.zoomlink})`;
    } else if (activity.physical) {
      location.textContent = `Location: ${activity.physicaladdress}`;
    }
    li.appendChild(location);

    // This is to create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      deleteActivity(index);
    });
    li.appendChild(deleteBtn);

    fragment.appendChild(li);
  });
  activityList.appendChild(fragment);
}
// Delete button to remove activities from the list created
function deleteActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
  updateActivityList();
}

// Initialize
updateActivityList();

toggleMenu("home");

// Browser Object Model to Check online status
function checkOnlineStatus() {
  if (!navigator.onLine) {
    alert("You are offline! Some features may not work.");
  }
}

window.addEventListener("load", checkOnlineStatus);
window.addEventListener("online", checkOnlineStatus);
window.addEventListener("offline", checkOnlineStatus);
