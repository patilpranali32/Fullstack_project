// s3.js (Demo Bucket Management)
let s3Buckets = [];

document.addEventListener('DOMContentLoaded', loadBuckets);

function loadBuckets() {
  const stored = localStorage.getItem('s3Buckets');
  s3Buckets = stored ? JSON.parse(stored) : [];
  renderBuckets();
}

function saveBuckets() {
  localStorage.setItem('s3Buckets', JSON.stringify(s3Buckets));
  renderBuckets();
}

// demo name rule
function isValidBucketName(name){
  return /^[a-z0-9-]{3,63}$/.test(name);
}

function renderBuckets() {
  const list = document.getElementById('bucketList');
  if (!list) return;

  list.innerHTML = '';

  if (s3Buckets.length === 0) {
    list.innerHTML = `<li class="bucket-item">
      <div class="bucket-details">
        <h4>No buckets yet</h4>
        <p>Create a bucket to start storing demo objects.</p>
      </div>
    </li>`;
    return;
  }

  s3Buckets.forEach((bucket, index) => {
    const li = document.createElement('li');
    li.className = 'bucket-item';

    li.innerHTML = `
      <div class="bucket-info">
        <span class="bucket-icon">🪣</span>
        <div class="bucket-details">
          <h4>${bucket.name}</h4>
          <p>Region: ${bucket.region} | Objects: ${bucket.objects.length}</p>
          <p class="bucket-date">Created: ${new Date(bucket.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="bucket-actions">
        <button onclick="uploadObject(${index})" class="btn-small btn-primary">Upload</button>
        <button onclick="viewObjects(${index})" class="btn-small">View Objects</button>
        <button onclick="deleteBucket(${index})" class="btn-small btn-delete">Delete</button>
      </div>

      <div class="bucket-objects" id="objects-${index}" style="display: none;">
        <h5>Objects in bucket:</h5>
        <ul>
          ${bucket.objects.map(obj => `<li>📄 ${obj.name} (${obj.size})</li>`).join('') || '<li>No objects</li>'}
        </ul>
      </div>
    `;

    list.appendChild(li);
  });
}

function addBucket() {
  const nameInput = document.getElementById('bucketName');
  const region = document.getElementById('bucketRegion')?.value || 'us-east-1';

  const rawName = (nameInput?.value || '').trim().toLowerCase();

  if (!rawName) {
    alert('Please enter a bucket name.');
    return;
  }

  if (!isValidBucketName(rawName)) {
    alert('Invalid bucket name. Use lowercase letters, numbers, and hyphens (3–63 chars).');
    return;
  }

  // demo uniqueness check
  const exists = s3Buckets.some(b => b.name === rawName);
  if (exists) {
    alert('Bucket name already exists in this demo. Try another name.');
    return;
  }

  const bucket = {
    name: rawName,
    region,
    objects: [],
    createdAt: new Date().toISOString(),
    properties: {
      versioning: document.getElementById('enableVersioning')?.checked || false,
      encryption: document.getElementById('enableEncryption')?.checked ? 'AES-256' : 'None',
      publicAccess: false
    }
  };

  s3Buckets.push(bucket);
  saveBuckets();

  if (nameInput) nameInput.value = '';
  alert('Demo bucket created successfully!');
}

function deleteBucket(index) {
  if (confirm('Delete this demo bucket? All objects will be deleted.')) {
    s3Buckets.splice(index, 1);
    saveBuckets();
  }
}

function uploadObject(bucketIndex) {
  const fileName = prompt('Enter file name (demo):');
  if (!fileName) return;

  const fileSize = (Math.random() * 10).toFixed(2) + ' MB';

  const mockObject = {
    name: fileName,
    size: fileSize,
    uploadedAt: new Date().toISOString()
  };

  s3Buckets[bucketIndex].objects.push(mockObject);
  saveBuckets();
  alert('Demo file uploaded successfully!');
}

function viewObjects(bucketIndex) {
  const objectsDiv = document.getElementById(`objects-${bucketIndex}`);
  if (!objectsDiv) return;
  objectsDiv.style.display = objectsDiv.style.display === 'none' ? 'block' : 'none';
}

// Modal
function showBucketModal() {
  document.getElementById('bucketModal').style.display = 'block';
}

function closeBucketModal() {
  document.getElementById('bucketModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('bucketModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};