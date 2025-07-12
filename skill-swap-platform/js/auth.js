async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // 🔁 Load users from users.json
  const res = await fetch('../data/users.json');
  const users = await res.json();

  // 🆕 Load registered users from localStorage
  const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // 🧠 Combine both lists
  const combinedUsers = [...users, ...storedUsers];

  // 🔍 Match user
  const matchedUser = combinedUsers.find(
    user => user.email === email && user.password === password
  );

  // ✅ If matched
  if (matchedUser) {
    alert("✅ Login successful!");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    window.location.href = "profile.html"; // Redirect to profile
  } else {
    alert("❌ Invalid email or password!");
  }
}
