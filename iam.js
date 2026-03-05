// iam.js (Demo Access Control - Users & Roles)

let iamUsers = [];
let iamRoles = [];

document.addEventListener('DOMContentLoaded', loadIAMData);

function loadIAMData() {
  const storedUsers = localStorage.getItem('iamUsers');
  const storedRoles = localStorage.getItem('iamRoles');

  iamUsers = storedUsers ? JSON.parse(storedUsers) : [
    { id: 'u1', name: 'admin', email: 'admin@example.com', status: 'Active', createdAt: '2024-01-01' },
    { id: 'u2', name: 'developer', email: 'developer@example.com', status: 'Active', createdAt: '2024-01-15' }
  ];

  iamRoles = storedRoles ? JSON.parse(storedRoles) : [
    { id: 'r1', name: 'AdminRole', type: 'service', description: 'Full administrative access (demo)' },
    { id: 'r2', name: 'DeveloperRole', type: 'service', description: 'Developer access (demo)' },
    { id: 'r3', name: 'ReadOnlyRole', type: 'service', description: 'Read-only access (demo)' }
  ];

  localStorage.setItem('iamUsers', JSON.stringify(iamUsers));
  localStorage.setItem('iamRoles', JSON.stringify(iamRoles));

  renderUsers();
  renderRoles();
}

function saveUsers() {
  localStorage.setItem('iamUsers', JSON.stringify(iamUsers));
  renderUsers();
  updateStats();
}

function saveRoles() {
  localStorage.setItem('iamRoles', JSON.stringify(iamRoles));
  renderRoles();
  updateStats();
}

function renderUsers() {
  const list = document.getElementById('userList');
  if (!list) return;

  list.innerHTML = '';

  if (iamUsers.length === 0) {
    list.innerHTML = `<li class="iam-item">
      <div class="iam-details">
        <h4>No users</h4>
        <p>Add a user to see it here (demo).</p>
      </div>
    </li>`;
    return;
  }

  iamUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.className = 'iam-item';
    li.innerHTML = `
      <div class="iam-info">
        <span class="iam-avatar">👤</span>
        <div class="iam-details">
          <h4>${user.name}</h4>
          <p>${user.email || '—'}</p>
          <p>ID: user/${user.id}</p>
        </div>
        <div class="iam-status ${user.status.toLowerCase()}">${user.status}</div>
      </div>
      <div class="iam-actions">
        <button onclick="editUser(${index})" class="btn-small">Edit</button>
        <button onclick="deleteUser(${index})" class="btn-small btn-delete">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderRoles() {
  const list = document.getElementById('roleList');
  if (!list) return;

  list.innerHTML = '';

  if (iamRoles.length === 0) {
    list.innerHTML = `<li class="iam-item">
      <div class="iam-details">
        <h4>No roles</h4>
        <p>Create a role to see it here (demo).</p>
      </div>
    </li>`;
    return;
  }

  iamRoles.forEach((role, index) => {
    const li = document.createElement('li');
    li.className = 'iam-item';
    li.innerHTML = `
      <div class="iam-info">
        <span class="iam-avatar">🎭</span>
        <div class="iam-details">
          <h4>${role.name}</h4>
          <p>Type: ${role.type}</p>
          <p>${role.description}</p>
        </div>
      </div>
      <div class="iam-actions">
        <button onclick="viewRole(${index})" class="btn-small">View Policy</button>
        <button onclick="deleteRole(${index})" class="btn-small btn-delete">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function addUser() {
  const userName = (document.getElementById('userName')?.value || '').trim();
  const userEmail = (document.getElementById('userEmail')?.value || '').trim();

  if (!userName) {
    alert('Please enter a user name.');
    return;
  }

  // avoid duplicates (demo)
  if (iamUsers.some(u => u.name.toLowerCase() === userName.toLowerCase())) {
    alert('User already exists (demo). Try another name.');
    return;
  }

  const user = {
    id: 'u-' + Math.random().toString(36).slice(2, 8),
    name: userName,
    email: userEmail || `${userName}@example.com`,
    status: 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  iamUsers.push(user);
  saveUsers();

  // clear fields
  const n = document.getElementById('userName');
  const e = document.getElementById('userEmail');
  if (n) n.value = '';
  if (e) e.value = '';

  alert('Demo user created.');
}

function deleteUser(index) {
  if (confirm('Delete this demo user?')) {
    iamUsers.splice(index, 1);
    saveUsers();
  }
}

function editUser(index) {
  const user = iamUsers[index];
  if (!user) return;
  alert(`Edit User: ${user.name}\n\nDemo note: In full app this opens an edit form.`);
}

function addRole() {
  const roleName = (document.getElementById('roleName')?.value || '').trim();
  const roleType = document.getElementById('roleType')?.value || 'service';
  const roleDescription = (document.getElementById('roleDescription')?.value || '').trim();

  if (!roleName) {
    alert('Please enter a role name.');
    return;
  }

  if (iamRoles.some(r => r.name.toLowerCase() === roleName.toLowerCase())) {
    alert('Role already exists (demo). Try another name.');
    return;
  }

  const role = {
    id: 'r-' + Math.random().toString(36).slice(2, 8),
    name: roleName,
    type: roleType,
    description: roleDescription || 'Custom role (demo)',
    createdAt: new Date().toISOString().split('T')[0]
  };

  iamRoles.push(role);
  saveRoles();

  const rn = document.getElementById('roleName');
  const rd = document.getElementById('roleDescription');
  if (rn) rn.value = '';
  if (rd) rd.value = '';

  alert('Demo role created.');
}

function deleteRole(index) {
  if (confirm('Delete this demo role?')) {
    iamRoles.splice(index, 1);
    saveRoles();
  }
}

function viewRole(index) {
  const role = iamRoles[index];
  if (!role) return;

  alert(
    `Role: ${role.name}\nType: ${role.type}\n\nDemo Policy:\n{\n  "Version": "2026-01-01",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": ["read:*"],\n      "Resource": "*"\n    }\n  ]\n}`
  );
}

function showUserModal() {
  document.getElementById('userModal').style.display = 'block';
}
function closeUserModal() {
  document.getElementById('userModal').style.display = 'none';
}
function showRoleModal() {
  document.getElementById('roleModal').style.display = 'block';
}
function closeRoleModal() {
  document.getElementById('roleModal').style.display = 'none';
}

/* Tabs */
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabName + 'Tab').style.display = 'block';
  document.getElementById(tabName + 'Btn').classList.add('active');
}

/* Stats (called from HTML too) */
function updateStats() {
  const userCount = document.getElementById('userCount');
  const activeUsers = document.getElementById('activeUsers');
  const roleCount = document.getElementById('roleCount');

  if (userCount) userCount.textContent = iamUsers.length;
  if (activeUsers) activeUsers.textContent = iamUsers.filter(u => u.status === 'Active').length;
  if (roleCount) roleCount.textContent = iamRoles.length;
}

/* Close modal on outside click */
window.onclick = function(event) {
  const userModal = document.getElementById('userModal');
  const roleModal = document.getElementById('roleModal');
  if (event.target === userModal) userModal.style.display = 'none';
  if (event.target === roleModal) roleModal.style.display = 'none';
};