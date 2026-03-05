// auth.js (Demo Authentication using localStorage)

// helper: simple email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function showError(msg) {
  const error = document.getElementById("error");
  if (error) error.innerText = msg;
}

function clearError() {
  const error = document.getElementById("error");
  if (error) error.innerText = "";
}

// REGISTER
function register() {
  clearError();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim().toLowerCase();
  const password = document.getElementById("password")?.value;

  if (!name || !email || !password) {
    showError("All fields are required!");
    return;
  }
  if (!isValidEmail(email)) {
    showError("Enter a valid email address!");
    return;
  }
  if (password.length < 6) {
    showError("Password must be at least 6 characters!");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("demoUser", JSON.stringify(user));

  alert("Demo account created successfully!");
  window.location.href = "index.html";
}

// LOGIN
function login() {
  clearError();

  const email = document.getElementById("email")?.value.trim().toLowerCase();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showError("Please fill all fields!");
    return;
  }

  const storedUserRaw = localStorage.getItem("demoUser");
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

  if (!storedUser) {
    showError("No demo account found. Please create one first.");
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUserName", storedUser.name);
    window.location.href = "dashboard.html";
  } else {
    showError("Invalid email or password!");
  }
}

// protect private pages
function requireAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") window.location.href = "index.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUserName");
  window.location.href = "index.html";
}