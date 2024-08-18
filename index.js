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

// Form submission
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

  // Image validation
  if (image) {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(image.type)) {
      alert("Please upload a valid image file (JPEG or PNG).");
      return;
    }
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
    activityList.innerHTML = `<p>No activities yet. <br />Click the create Activities button on the top Menu to <br />Create your First Activity!!!</p>
    <div style="display: flex; justify-content: center; align-items: center; width: 600px; height: 400px; margin: 0 auto; border: solid black 1px">
      <i class='fas fa-plus' style="font-size: 90px;"></i>
    </div>`;
    return;
  }

  activities.forEach((activity, index) => {
    const li = document.createElement("li");

    // Create the activity details
    const name = document.createElement("h3");
    name.textContent = activity.name;
    li.appendChild(name);

    // Create an image element if there's an image
    if (activity.imageUrl) {
      const img = document.createElement("img");
      img.src = activity.imageUrl;
      img.alt = activity.name;

      li.appendChild(img);
    }

    const description = document.createElement("p");
    description.textContent = `Description: ${activity.description}`;
    li.appendChild(description);

    const type = document.createElement("p");
    type.textContent = `Type: ${activity.type}`;
    li.appendChild(type);

    const dateTime = document.createElement("p");
    dateTime.textContent = `Date: ${activity.date} Time: ${activity.time}`;
    li.appendChild(dateTime);

    const location = document.createElement("p");
    if (activity.online) {
      location.textContent = `Location: Online (Zoom Link: ${activity.zoomlink})`;
    } else if (activity.physical) {
      location.textContent = `Location: ${activity.physicaladdress}`;
    }
    li.appendChild(location);

    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      deleteActivity(index);
    });
    li.appendChild(deleteBtn);

    activityList.appendChild(li);
  });
}
function deleteActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
  updateActivityList();
}

// Initialize
updateActivityList();
toggleMenu("home");
