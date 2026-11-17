const nurseReg = document.getElementById("nurseRegForm");
if (nurseReg) {
  nurseReg.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("nurseName").value.trim();
    const id = document.getElementById("nurseId").value.trim();
    const department = document.getElementById("nurseDept").value.trim();
    const username = document.getElementById("nurseUser").value.trim();
    const password = document.getElementById("nursePass").value;
    if (!fullName || !id || !department || !username || !password) {
      document.getElementById("errNurseName").textContent = "Please fill all fields";
      return;
    }
    const users = HMSStorage.get("hms_nurse_users", []);
    users.push({ id, fullName, department, username, password });
    HMSStorage.set("hms_nurse_users", users);
    window.location.href = "login.html";
  });
}

const nurseLogin = document.getElementById("nurseLoginForm");
if (nurseLogin) {
  nurseLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("nurseLoginId").value.trim();
    const pass = document.getElementById("nurseLoginPass").value;
    const ans = document.getElementById("nurseCaptchaAns").value.trim();
    if (parseInt(ans, 10) !== 9) {
      document.getElementById("nurseLoginErr").textContent = "Invalid security check answer";
      return;
    }
    const users = HMSStorage.get("hms_nurse_users", []);
    const found = users.find((u) => u.id === id && u.password === pass);
    if (!found) {
      document.getElementById("nurseLoginErr").textContent = "Invalid Nurse ID or password";
      return;
    }
    window.location.href = "dashboard.html";
  });
}

const nurseNav = document.getElementById("nurseDashNav");
if (nurseNav) {
  const btns = nurseNav.querySelectorAll("button[data-tab]");
  const tabs = document.querySelectorAll(".tab-section");
  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(b.dataset.tab).classList.add("active");
    });
  });

  function renderNurse() {
    const vitals = HMSStorage.get("hms_vitals", []);
    const meds = HMSStorage.get("hms_medlogs", []);
    const shifts = HMSStorage.get("hms_shifts", []);

    document.getElementById("vitBody").innerHTML = vitals
      .map(
        (v) =>
          `<tr><td>${v.id}</td><td>${v.patient}</td><td>${v.bp}</td><td>${v.temp}</td><td>${v.pulse}</td><td><button class="btn-danger" data-del-vit="${v.id}">Delete</button></td></tr>`
      )
      .join("");

    document.getElementById("medBody").innerHTML = meds
      .map((m) => `<tr><td>${m.id}</td><td>${m.patient}</td><td>${m.medicine}</td><td>${m.time}</td><td>${m.status}</td></tr>`)
      .join("");

    document.getElementById("shfBody").innerHTML = shifts
      .map((s) => `<tr><td>${s.id}</td><td>${s.current}</td><td>${s.requested}</td><td>${s.status}</td></tr>`)
      .join("");
  }

  document.getElementById("addVitBtn").addEventListener("click", () => {
    const patient = document.getElementById("vitPatient").value.trim();
    const bp = document.getElementById("vitBp").value.trim();
    const temp = document.getElementById("vitTemp").value.trim();
    const pulse = document.getElementById("vitPulse").value.trim();
    if (!patient || !bp || !temp || !pulse) return;
    const list = HMSStorage.get("hms_vitals", []);
    list.push({ id: "VIT-" + Date.now().toString().slice(-4), patient, bp, temp, pulse });
    HMSStorage.set("hms_vitals", list);
    renderNurse();
  });

  document.getElementById("addMedBtn").addEventListener("click", () => {
    const patient = document.getElementById("medPatient").value.trim();
    const medicine = document.getElementById("medName").value.trim();
    const time = document.getElementById("medTime").value.trim();
    if (!patient || !medicine || !time) return;
    const list = HMSStorage.get("hms_medlogs", []);
    list.push({ id: "MED-" + Date.now().toString().slice(-4), patient, medicine, time, status: "Given" });
    HMSStorage.set("hms_medlogs", list);
    renderNurse();
  });

  document.getElementById("addShfBtn").addEventListener("click", () => {
    const current = document.getElementById("shfCurrent").value.trim();
    const requested = document.getElementById("shfReq").value.trim();
    if (!current || !requested) return;
    const list = HMSStorage.get("hms_shifts", []);
    list.push({ id: "SHF-" + Date.now().toString().slice(-4), current, requested, status: "Pending" });
    HMSStorage.set("hms_shifts", list);
    renderNurse();
  });

  document.addEventListener("click", (e) => {
    if (e.target.dataset.delVit) {
      HMSStorage.set(
        "hms_vitals",
        HMSStorage.get("hms_vitals", []).filter((x) => x.id !== e.target.dataset.delVit)
      );
      renderNurse();
    }
  });

  renderNurse();
}
