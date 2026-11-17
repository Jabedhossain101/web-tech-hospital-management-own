const docReg = document.getElementById("doctorRegForm");
if (docReg) {
  docReg.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("docName").value.trim();
    const id = document.getElementById("docId").value.trim();
    const department = document.getElementById("docDept").value.trim();
    const username = document.getElementById("docUser").value.trim();
    const password = document.getElementById("docPass").value;
    if (!fullName || !id || !department || !username || !password) {
      document.getElementById("errDocName").textContent = "Please fill all fields";
      return;
    }
    const users = HMSStorage.get("hms_doctor_users", []);
    users.push({ id, fullName, department, username, password });
    HMSStorage.set("hms_doctor_users", users);
    window.location.href = "login.html";
  });
}

const docLogin = document.getElementById("doctorLoginForm");
if (docLogin) {
  docLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("docLoginId").value.trim();
    const pass = document.getElementById("docLoginPass").value;
    const ans = document.getElementById("docCaptchaAns").value.trim();
    if (parseInt(ans, 10) !== 9) {
      document.getElementById("docLoginErr").textContent = "Invalid security check answer";
      return;
    }
    const users = HMSStorage.get("hms_doctor_users", []);
    const found = users.find((u) => u.id === id && u.password === pass);
    if (!found) {
      document.getElementById("docLoginErr").textContent = "Invalid Doctor ID or password";
      return;
    }
    window.location.href = "dashboard.html";
  });
}

const docNav = document.getElementById("docDashNav");
if (docNav) {
  const btns = docNav.querySelectorAll("button[data-tab]");
  const tabs = document.querySelectorAll(".tab-section");
  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(b.dataset.tab).classList.add("active");
    });
  });

  function renderDoc() {
    const rxs = HMSStorage.get("hms_prescriptions", []);
    const schs = HMSStorage.get("hms_schedules", []);
    const levs = HMSStorage.get("hms_leaves", []);

    document.getElementById("rxBody").innerHTML = rxs
      .map(
        (r) =>
          `<tr><td>${r.id}</td><td>${r.patient}</td><td>${r.diagnosis}</td><td>${r.medicine}</td><td><button class="btn-danger" data-del-rx="${r.id}">Delete</button></td></tr>`
      )
      .join("");

    document.getElementById("schBody").innerHTML = schs
      .map(
        (s) =>
          `<tr><td>${s.id}</td><td>${s.date}</td><td>${s.time}</td><td>${s.patient}</td><td><button class="btn-danger" data-del-sch="${s.id}">Delete</button></td></tr>`
      )
      .join("");

    document.getElementById("levBody").innerHTML = levs
      .map((l) => `<tr><td>${l.id}</td><td>${l.from}</td><td>${l.to}</td><td>${l.reason}</td><td>${l.status}</td></tr>`)
      .join("");
  }

  document.getElementById("addRxBtn").addEventListener("click", () => {
    const patient = document.getElementById("rxPatient").value.trim();
    const diagnosis = document.getElementById("rxDiag").value.trim();
    const medicine = document.getElementById("rxMed").value.trim();
    if (!patient || !diagnosis || !medicine) return;
    const list = HMSStorage.get("hms_prescriptions", []);
    list.push({ id: "PRX-" + Date.now().toString().slice(-4), patient, diagnosis, medicine });
    HMSStorage.set("hms_prescriptions", list);
    renderDoc();
  });

  document.getElementById("addSchBtn").addEventListener("click", () => {
    const date = document.getElementById("schDate").value.trim();
    const time = document.getElementById("schTime").value.trim();
    const patient = document.getElementById("schPatient").value.trim();
    if (!date || !time || !patient) return;
    const list = HMSStorage.get("hms_schedules", []);
    list.push({ id: "SCH-" + Date.now().toString().slice(-4), date, time, patient });
    HMSStorage.set("hms_schedules", list);
    renderDoc();
  });

  document.getElementById("addLevBtn").addEventListener("click", () => {
    const from = document.getElementById("levFrom").value.trim();
    const to = document.getElementById("levTo").value.trim();
    const reason = document.getElementById("levReason").value.trim();
    if (!from || !to || !reason) return;
    const list = HMSStorage.get("hms_leaves", []);
    list.push({ id: "LEV-" + Date.now().toString().slice(-4), from, to, reason, status: "Pending" });
    HMSStorage.set("hms_leaves", list);
    renderDoc();
  });

  document.addEventListener("click", (e) => {
    if (e.target.dataset.delRx) {
      HMSStorage.set(
        "hms_prescriptions",
        HMSStorage.get("hms_prescriptions", []).filter((x) => x.id !== e.target.dataset.delRx)
      );
      renderDoc();
    }
    if (e.target.dataset.delSch) {
      HMSStorage.set(
        "hms_schedules",
        HMSStorage.get("hms_schedules", []).filter((x) => x.id !== e.target.dataset.delSch)
      );
      renderDoc();
    }
  });

  renderDoc();
}
