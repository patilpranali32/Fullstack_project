// rds.js (Demo Managed Database)

let rdsDatabases = [];

document.addEventListener('DOMContentLoaded', loadDatabases);

function loadDatabases() {
  const stored = localStorage.getItem('rdsDatabases');
  rdsDatabases = stored ? JSON.parse(stored) : [];
  renderDatabases();
}

function saveDatabases() {
  localStorage.setItem('rdsDatabases', JSON.stringify(rdsDatabases));
  renderDatabases();
}

function renderDatabases() {
  const list = document.getElementById('dbList');
  if (!list) return;

  list.innerHTML = '';

  if (rdsDatabases.length === 0) {
    list.innerHTML = `<li class="db-item">
      <div class="db-details">
        <h4>No databases yet</h4>
        <p>Create a database to see it listed here (demo).</p>
      </div>
    </li>`;
    return;
  }

  rdsDatabases.forEach((db, index) => {
    const li = document.createElement('li');
    li.className = 'db-item';

    li.innerHTML = `
      <div class="db-info">
        <span class="db-icon">🗄️</span>

        <div class="db-details">
          <h4>${db.name}</h4>
          <p>Engine: ${db.engine} ${db.engineVersion}</p>
          <p>Instance: ${db.instanceClass} | Storage: ${db.storage} GB</p>
          <p>Multi-zone: ${db.multiAZ ? 'Yes' : 'No'} | Region: ${db.region}</p>
          <p class="db-endpoint">Endpoint: ${db.endpoint}</p>
        </div>

        <div class="db-status ${db.status.toLowerCase()}">${db.status}</div>
      </div>

      <div class="db-actions">
        <button onclick="toggleDatabase(${index})"
          class="btn-small ${db.status === 'Available' ? 'btn-stop' : 'btn-start'}">
          ${db.status === 'Available' ? 'Stop' : 'Start'}
        </button>

        <button onclick="showConnection(${index})" class="btn-small">
          Connect
        </button>

        <button onclick="deleteDatabase(${index})" class="btn-small btn-delete">
          Delete
        </button>
      </div>
    `;

    list.appendChild(li);
  });
}

function addDatabase() {
  const dbName = (document.getElementById('dbName')?.value || '').trim() || ('app-db-' + Math.floor(Math.random() * 1000));
  const engine = document.getElementById('dbEngine')?.value || 'mysql';
  const engineVersion = document.getElementById('dbVersion')?.value || '8.0';
  const instanceClass = document.getElementById('dbInstance')?.value || 'db.t3.micro';
  const storage = document.getElementById('dbStorage')?.value || '20';
  const multiAZ = document.getElementById('dbMultiAZ')?.checked || false;
  const region = document.getElementById('dbRegion')?.value || 'us-east-1';
  const username = document.getElementById('dbUsername')?.value || 'admin';
  const password = document.getElementById('dbPassword')?.value || 'password123';

  if (!dbName) {
    alert('Please enter a DB identifier.');
    return;
  }

  const db = {
    id: 'db-' + Math.random().toString(36).slice(2, 10),
    name: dbName,
    engine,
    engineVersion,
    instanceClass,
    storage,
    multiAZ,
    region,
    status: 'Available',

    // IMPORTANT: use demo domain, not amazonaws.com
    endpoint: `${dbName}.${region}.db.demo.local`,

    port: engine === 'mysql' ? 3306 : engine === 'postgres' ? 5432 : engine === 'sqlserver' ? 1433 : 1521,
    username,
    createdAt: new Date().toISOString()
  };

  rdsDatabases.push(db);
  saveDatabases();
  alert('Demo database created successfully!');
}

function deleteDatabase(index) {
  if (confirm('Delete this demo database?')) {
    rdsDatabases.splice(index, 1);
    saveDatabases();
  }
}

function toggleDatabase(index) {
  const db = rdsDatabases[index];
  if (!db) return;

  db.status = db.status === 'Available' ? 'Stopped' : 'Available';
  saveDatabases();
}

function showConnection(index) {
  const db = rdsDatabases[index];
  if (!db) return;

  alert(
    `Demo Connection Details:\n\n` +
    `Endpoint: ${db.endpoint}\n` +
    `Port: ${db.port}\n` +
    `Username: ${db.username}\n\n` +
    `Note: This is a UI demo. No real database is created.`
  );
}

function showDbModal() {
  document.getElementById('dbModal').style.display = 'block';
}

function closeDbModal() {
  document.getElementById('dbModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('dbModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};