let allUsers = [];
let currentPage = 1;
const usersPerPage = 3;

window.onload = loadUsers;

async function loadUsers() {
  const res = await fetch('../data/users.json');
  const jsonUsers = await res.json();

  const localUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 👇 Make sure current user is included in the display list
  const filteredLocal = localUsers.filter(u => u.email !== currentUser?.email);
  const allUsers = [...jsonUsers, ...filteredLocal];

  // ✅ If currentUser is not in json or registered list, add manually
  if (currentUser && !allUsers.some(u => u.email === currentUser.email)) {
    allUsers.push(currentUser);
  }

  window.allUsers = allUsers; // for pagination
  displayUsersPaginated(currentPage);
}


function displayUsersPaginated(page) {
  const start = (page - 1) * usersPerPage;
  const end = start + usersPerPage;
  const pageUsers = allUsers.slice(start, end);
  displayUsers(pageUsers);
  renderPagination(allUsers.length, page);
}

function displayUsers(users) {
  const container = document.getElementById('userList');
  container.innerHTML = '';
  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <img src="${user.photo}" alt="${user.name}">
      <div>
        <h3>${user.name}</h3>
        <div class="skills">
          <div class="skill-label">Skill Offered =></div>
          ${user.skillsOffered.map(skill => `<span>${skill}</span>`).join('')}
          <div class="skill-label">Skill Wanted =></div>
          ${user.skillsWanted.map(skill => `<span>${skill}</span>`).join('')}
        </div>
        <div class="rating">⭐ ${user.rating}/5</div>
      </div>
      <button class="request-btn">Request</button>
    `;
    container.appendChild(card);
  });
}

function renderPagination(totalUsers, current) {
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (current > 1) {
    const prev = document.createElement('button');
    prev.textContent = '<';
    prev.onclick = () => changePage(current - 1);
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === current) btn.classList.add('active');
    btn.onclick = () => changePage(i);
    pagination.appendChild(btn);
  }

  if (current < totalPages) {
    const next = document.createElement('button');
    next.textContent = '>';
    next.onclick = () => changePage(current + 1);
    pagination.appendChild(next);
  }
}

function changePage(newPage) {
  currentPage = newPage;
  displayUsersPaginated(newPage);
}

function searchUsers() {
  const query = document.getElementById('searchSkill').value.toLowerCase();
  const availability = document.getElementById('availabilityFilter').value;

  fetch('../data/users.json')
    .then(res => res.json())
    .then(users => {
      const filtered = users.filter(u => {
        const hasSkill = [...u.skillsOffered, ...u.skillsWanted].some(skill =>
          skill.toLowerCase().includes(query)
        );
        const matchAvailability = availability ? u.availability === availability : true;
        return hasSkill && matchAvailability;
      });
      allUsers = filtered;
      currentPage = 1;
      displayUsersPaginated(currentPage);
    });
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  const profileImg = document.querySelector(".profile-icon");
  if (profileImg) {
    profileImg.src = currentUser.photo;
    profileImg.title = currentUser.name;
  }
}
}
