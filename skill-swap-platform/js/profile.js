// 🧠 Load current user
const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
  alert("❌ Please login first!");
  window.location.href = "login.html";
}

// 👤 Fill form with current user details
document.getElementById("name").value = user.name || "";
document.getElementById("availability").value = user.availability || "";
document.getElementById("skillsOffered").value = (user.skillsOffered || []).join(", ");
document.getElementById("skillsWanted").value = (user.skillsWanted || []).join(", ");

// 💾 Handle form submission
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const updatedUser = {
    ...user,
    name: document.getElementById("name").value,
    availability: document.getElementById("availability").value,
    skillsOffered: document.getElementById("skillsOffered").value.split(",").map(s => s.trim()),
    skillsWanted: document.getElementById("skillsWanted").value.split(",").map(s => s.trim())
  };

  // ✅ Save updated user to localStorage
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  // ✅ Update user in registeredUsers[]
  const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  const updatedList = allUsers.map(u => u.email === updatedUser.email ? updatedUser : u);
  localStorage.setItem("registeredUsers", JSON.stringify(updatedList));

  alert("✅ Profile updated!");
  window.location.href = "index.html"; // Redirect to home
});
