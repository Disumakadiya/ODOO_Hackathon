async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('../data/users.json');
  const users = await res.json();

  const matchedUser = users.find(
    user => user.email === email && user.password === password
  );

  if (matchedUser) {
    alert("✅ Login successful!");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    window.location.href = "index.html";
  } else {
    alert("❌ Invalid email or password!");
  }
}
