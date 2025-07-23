// ✅ User Login
function loginUser() {
  const username = document.getElementById("usernameInput").value.trim();

  if (!username) {
    alert("Please enter your name!");
    return;
  }

  // Save username
  localStorage.setItem("moodmate_user", username);

  // Initialize mood history if not present
  const historyKey = "mood_history_" + username;
  if (!localStorage.getItem(historyKey)) {
    localStorage.setItem(historyKey, JSON.stringify([]));
  }

  showApp(username);
}

// ✅ Logout and reset
function logoutUser() {
  localStorage.removeItem("moodmate_user");
  location.reload();
}

// ✅ Auto-login check on load
function checkLogin() {
  const username = localStorage.getItem("moodmate_user");

  if (username) {
    showApp(username);
  }
}

// ✅ Show app section after login
function showApp(username) {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("appSection").style.display = "block";
  document.getElementById("greetingText").innerText = `Hello, ${username}! Let’s match your mood with music 🎵`;
}
