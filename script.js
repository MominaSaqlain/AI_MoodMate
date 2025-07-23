console.log("✅ script.js loaded");

// 🧠 Text Mood Detection
function analyzeMood() {
  const text = document.getElementById("userInput").value;

  fetch('http://127.0.0.1:5000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerHTML = `🧠 Detected Mood: <b>${data.mood}</b>`;
      showPlaylist(data.songs);
      saveMood(data.mood, "text");
    })
    .catch(err => {
      document.getElementById("result").innerHTML = "❌ Error detecting mood.";
      console.error("Text error:", err);
    });
}

// 📷 Image Mood Detection
function analyzeImage() {
  const input = document.getElementById('imageInput');
  const file = input.files[0];

  if (!file) {
    alert('Please select an image first!');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  fetch('http://127.0.0.1:5000/analyze_image', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        document.getElementById("result").innerHTML = `📷 Detected Mood: <b>${data.mood}</b>`;
        showPlaylist(data.songs);
        saveMood(data.mood, "image");
      }
    })
    .catch(err => {
      document.getElementById("result").innerHTML = "❌ Error detecting image mood.";
      console.error("Image error:", err);
    });
}

// 🎵 Show Playlist
function showPlaylist(songs) {
  let html = `<h3>🎵 Recommended Playlist:</h3>`;
  songs.forEach(song => {
    html += `<a href="${song.link}" target="_blank">${song.title}</a>`;
  });
  document.getElementById("playlist").innerHTML = html;
}

// 🌗 Dark/Light Mode
function toggleTheme() {
  console.log("🔘 toggleTheme called");
  document.body.classList.toggle("dark-mode");
}

// ♻️ Reset App
function resetApp() {
  console.log("🔄 resetApp called");
  document.getElementById("userInput").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("playlist").innerHTML = "";
}

// 💾 Save Mood
function saveMood(mood, type) {
  const user = localStorage.getItem("moodmate_user");
  if (!user) return;

  const historyKey = "mood_history_" + user;
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];

  history.push({
    type: type,
    mood: mood,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(historyKey, JSON.stringify(history));
}

// 📚 Toggle History
function toggleHistory() {
  const section = document.getElementById("historySection");
  section.style.display = section.style.display === "none" ? "block" : "none";

  if (section.style.display === "block") {
    loadMoodHistory();
  }
}

// 🧠 Load Mood History
function loadMoodHistory() {
  const user = localStorage.getItem("moodmate_user");
  const historyKey = "mood_history_" + user;
  const data = JSON.parse(localStorage.getItem(historyKey)) || [];

  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";

  data.reverse().forEach((item, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td>${item.mood}</td>
      <td>${item.type}</td>
      <td>${item.date}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// 🧹 Clear Mood History
function clearMoodHistory() {
  const confirmClear = confirm("Are you sure you want to delete your entire mood history?");
  if (!confirmClear) return;

  const user = localStorage.getItem("moodmate_user");
  const historyKey = "mood_history_" + user;
  localStorage.setItem(historyKey, JSON.stringify([]));

  alert("Mood history cleared ✅");
  loadMoodHistory();
}
