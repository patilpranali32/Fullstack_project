// ec2.js (Demo VM Instance Management)

let ec2Instances = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadInstances);

function loadInstances() {
  const stored = localStorage.getItem('ec2Instances');
  ec2Instances = stored ? JSON.parse(stored) : [];
  renderTable();
}

function saveInstances() {
  localStorage.setItem('ec2Instances', JSON.stringify(ec2Instances));
  renderTable();
}

function renderTable() {
  const body = document.getElementById('ec2TableBody');
  if (!body) return;

  body.innerHTML = "";

  ec2Instances.forEach((instance, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${instance.id}</td>
      <td><span class="status-badge ${instance.status.toLowerCase()}">${instance.status}</span></td>
      <td>${instance.type}</td>
      <td>${instance.ami}</td>
      <td>${instance.region}</td>
      <td>
        <button onclick="toggleInstance(${index})"
          class="btn-small ${instance.status === 'Running' ? 'btn-stop' : 'btn-start'}">
          ${instance.status === 'Running' ? 'Stop' : 'Start'}
        </button>
        <button onclick="deleteInstance(${index})" class="btn-small btn-delete">Delete</button>
      </td>
    `;

    body.appendChild(tr);
  });
}

function addInstance() {
  const ami = document.getElementById('amiSelect')?.value || 'linux-2';
  const instanceType = document.getElementById('instanceType')?.value || 't3.micro';

  // FIX: region should come from instanceRegion (modal), fallback to regionSelect
  const region =
    document.getElementById('instanceRegion')?.value ||
    document.getElementById('regionSelect')?.value ||
    'us-east-1';

  const keyPair = document.getElementById('keyPair')?.value || 'demo-keypair';
  const securityGroup = document.getElementById('securityGroup')?.value || 'default';

  const instance = {
    id: 'vm-' + Math.random().toString(36).slice(2, 10),
    status: 'Running',
    type: instanceType,
    ami,
    region,
    keyPair,
    securityGroup,
    createdAt: new Date().toISOString()
  };

  ec2Instances.push(instance);
  saveInstances();
  alert('Demo VM launched successfully!');
}

function toggleInstance(index) {
  const instance = ec2Instances[index];
  if (!instance) return;

  instance.status = instance.status === 'Running' ? 'Stopped' : 'Running';
  saveInstances();
}

function deleteInstance(index) {
  if (confirm('Delete this demo VM?')) {
    ec2Instances.splice(index, 1);
    saveInstances();
  }
}

// Modal functions
function showLaunchModal() {
  document.getElementById('launchModal').style.display = 'block';
}

function closeLaunchModal() {
  document.getElementById('launchModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('launchModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};