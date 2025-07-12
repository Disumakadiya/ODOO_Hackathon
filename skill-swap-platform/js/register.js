function registerUser(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const availability = document.getElementById("availability").value;
  const skillsOffered = document.getElementById("skillsOffered").value.split(",").map(s => s.trim());
  const skillsWanted = document.getElementById("skillsWanted").value.split(",").map(s => s.trim());

  // Load existing users
  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Check for duplicate
  const alreadyExists = existingUsers.some(user => user.email === email);
  if (alreadyExists) {
    alert("❌ User already registered with this email!");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    availability,
    skillsOffered,
    skillsWanted,
    rating: 0,
    photo: "../images/default-profile.png"
  };

  existingUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
  alert("✅ Registered successfully! Now you can login.");
  window.location.href = "login.html";
}
