const apiBase = "http://127.0.0.1:8000";

// Problem List
async function loadProblemList() {
  const res = await fetch(`${apiBase}/problems`);
  const problems = await res.json();
  let html = "<ul>";
  problems.forEach(p => {
    html += `<li>
      <span>${p.title} (${p.stars}⭐)</span>
      <button onclick="viewProblem(${p.id})">Solve</button>
    </li>`;
  });
  html += "</ul>";
  document.getElementById("content").innerHTML = html;
}

// Problem Detail
async function viewProblem(id) {
  const res = await fetch(`${apiBase}/problems/${id}`);
  const problem = await res.json();
  document.getElementById("content").innerHTML = `
    <h2>${problem.title}</h2>
    <p>${problem.statement}</p>
    <textarea id="code" rows="5">print("Hello World")</textarea><br>
    <button onclick="runCode(${id})">Run Code</button>
    <pre id="result"></pre>
  `;
}

// Run Code
async function runCode(problemId) {
  const code = document.getElementById("code").value;
  const res = await fetch(`${apiBase}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_id: problemId, code, language: "python" })
  });
  const data = await res.json();
  document.getElementById("result").innerText = data.result || "Check console";
}

// Profile + Badges
async function loadProfile() {
  const userRes = await fetch(`${apiBase}/users/me`);
  const badgesRes = await fetch(`${apiBase}/badges`);
  const user = await userRes.json();
  const badges = await badgesRes.json();

  let html = `<div class="profile-card">
    <h2>${user.display_name || "Demo User"}</h2>
    <p>Email: ${user.email || "demo@example.com"}</p>
    <h3>Badges</h3>
    <div>`;
  badges.forEach(b => {
    html += `<img class="badge" src="http://127.0.0.1:8000/static/badges/${b.icon_path}" title="${b.name}">`;
  });
  html += `</div></div>`;
  document.getElementById("content").innerHTML = html;
}
