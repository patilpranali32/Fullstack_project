// lambda.js (Demo Functions)

let lambdaFunctions = [];

document.addEventListener('DOMContentLoaded', loadFunctions);

function loadFunctions() {
  const stored = localStorage.getItem('lambdaFunctions');
  lambdaFunctions = stored ? JSON.parse(stored) : [];
  renderFunctions();
}

function saveFunctions() {
  localStorage.setItem('lambdaFunctions', JSON.stringify(lambdaFunctions));
  renderFunctions();
}

function renderFunctions() {
  const list = document.getElementById('lambdaList');
  if (!list) return;

  list.innerHTML = '';

  if (lambdaFunctions.length === 0) {
    list.innerHTML = `<li class="lambda-item">
      <div class="lambda-details">
        <h4>No functions yet</h4>
        <p>Create a function to see it listed here (demo).</p>
      </div>
    </li>`;
    return;
  }

  lambdaFunctions.forEach((func, index) => {
    const li = document.createElement('li');
    li.className = 'lambda-item';

    li.innerHTML = `
      <div class="lambda-info">
        <span class="lambda-icon">ƒ</span>
        <div class="lambda-details">
          <h4>${func.name}</h4>
          <p>Runtime: ${func.runtime}</p>
          <p>Memory: ${func.memory} MB | Timeout: ${func.timeout}s</p>
          <p>ID: ${func.functionId}</p>
        </div>
        <div class="lambda-status">Active</div>
      </div>

      <div class="lambda-actions">
        <button onclick="testFunction(${index})" class="btn-small btn-primary">Test</button>
        <button onclick="viewFunction(${index})" class="btn-small">Config</button>
        <button onclick="deleteFunction(${index})" class="btn-small btn-delete">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function addFunction() {
  const funcName = (document.getElementById('funcName')?.value || '').trim() || 'my-function-demo';
  const runtime = document.getElementById('funcRuntime')?.value || 'nodejs18';
  const memory = Number(document.getElementById('funcMemory')?.value || 128);
  const timeout = Number(document.getElementById('funcTimeout')?.value || 3);
  const description = document.getElementById('funcDescription')?.value || 'Demo function';
  const code = document.getElementById('funcCode')?.value || '';

  if (!funcName) {
    alert('Please enter a function name.');
    return;
  }

  const func = {
    functionId: 'fn-' + Math.random().toString(36).slice(2, 10),
    name: funcName,
    runtime,
    memory,
    timeout,
    description,
    code,
    lastModified: new Date().toISOString(),
    version: 'v1'
  };

  lambdaFunctions.push(func);
  saveFunctions();
  alert('Demo function created successfully!');
}

function deleteFunction(index) {
  if (confirm('Delete this demo function?')) {
    lambdaFunctions.splice(index, 1);
    saveFunctions();
  }
}

function testFunction(index) {
  const func = lambdaFunctions[index];
  const testEvent = prompt('Enter test event (JSON):', '{}');
  if (testEvent === null) return;

  try {
    JSON.parse(testEvent);
    alert(
      `Demo execution success ✅\n\n` +
      `Function: ${func.name}\n` +
      `Response:\n{ "statusCode": 200, "body": { "message": "Hello from Function (Demo)!" } }`
    );
  } catch (e) {
    alert('Invalid JSON in test event');
  }
}

function viewFunction(index) {
  const func = lambdaFunctions[index];
  alert(
    `Function Configuration (Demo):\n\n` +
    `Name: ${func.name}\n` +
    `Runtime: ${func.runtime}\n` +
    `Memory: ${func.memory} MB\n` +
    `Timeout: ${func.timeout}s\n` +
    `ID: ${func.functionId}\n` +
    `Version: ${func.version}`
  );
}

function showLambdaModal() {
  document.getElementById('lambdaModal').style.display = 'block';
}

function closeLambdaModal() {
  document.getElementById('lambdaModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('lambdaModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};