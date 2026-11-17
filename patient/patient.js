const patReg = document.getElementById("patientRegForm");
if (patReg) {
  patReg.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("patName").value.trim();
    const id = document.getElementById("patId").value.trim();
    const age = document.getElementById("patAge").value.trim();
    const username = document.getElementById("patUser").value.trim();
    const password = document.getElementById("patPass").value;
    if (!fullName || !id || !age || !username || !password) {
      document.getElementById("errPatName").textContent = "Please fill all fields";
      return;
    }
    const users = HMSStorage.get("hms_patient_users", []);
    users.push({ id, fullName, age, username, password });
    HMSStorage.set("hms_patient_users", users);
    window.location.href = "login.html";
  });
}

const patLogin = document.getElementById("patientLoginForm");
if (patLogin) {
  patLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("patLoginId").value.trim();
    const pass = document.getElementById("patLoginPass").value;
    const ans = document.getElementById("patCaptchaAns").value.trim();
    if (parseInt(ans, 10) !== 9) {
      document.getElementById("patLoginErr").textContent = "Invalid security check answer";
      return;
    }
    const users = HMSStorage.get("hms_patient_users", []);
    const found = users.find((u) => u.id === id && u.password === pass);
    if (!found) {
      document.getElementById("patLoginErr").textContent = "Invalid Patient ID or password";
      return;
    }
    window.location.href = "dashboard.html";
  });
}

const patNav = document.getElementById("patDashNav");
if (patNav) {
  const btns = patNav.querySelectorAll("button[data-tab]");
  const tabs = document.querySelectorAll(".tab-section");
  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(b.dataset.tab).classList.add("active");
    });
  });

  function renderPat() {
    const apts = HMSStorage.get("hms_appointments", []);
    const bills = HMSStorage.get("hms_bills", []);
    const fdbs = HMSStorage.get("hms_feedbacks", []);

    document.getElementById("aptBody").innerHTML = apts
      .map(
        (a) =>
          `<tr><td>${a.id}</td><td>${a.doctor}</td><td>${a.dept}</td><td>${a.date}</td><td>${a.status}</td><td><button class="btn-danger" data-del-apt="${a.id}">Cancel</button></td></tr>`
      )
      .join("");

    document.getElementById("billBody").innerHTML = bills
      .map(
        (b) =>
          `<tr><td>${b.id}</td><td>${b.item}</td><td>${b.amount}</td><td>${b.status}</td><td><button class="btn-primary" data-pay-bill="${b.id}">Pay</button></td></tr>`
      )
      .join("");

    document.getElementById("fdbBody").innerHTML = fdbs
      .map((f) => `<tr><td>${f.id}</td><td>${f.rating}</td><td>${f.comment}</td></tr>`)
      .join("");
  }

  document.getElementById("addAptBtn").addEventListener("click", () => {
    const doctor = document.getElementById("aptDoc").value.trim();
    const dept = document.getElementById("aptDept").value.trim();
    const date = document.getElementById("aptDate").value.trim();
    if (!doctor || !dept || !date) return;
    const list = HMSStorage.get("hms_appointments", []);
    list.push({ id: "APT-" + Date.now().toString().slice(-4), doctor, dept, date, status: "Confirmed" });
    HMSStorage.set("hms_appointments", list);
    renderPat();
  });

  document.getElementById("addFdbBtn").addEventListener("click", () => {
    const rating = document.getElementById("fdbRating").value;
    const comment = document.getElementById("fdbComment").value.trim();
    if (!comment) return;
    const list = HMSStorage.get("hms_feedbacks", []);
    list.push({ id: "FDB-" + Date.now().toString().slice(-4), rating, comment });
    HMSStorage.set("hms_feedbacks", list);
    document.getElementById("fdbComment").value = "";
    renderPat();
  });

  document.addEventListener("click", (e) => {
    if (e.target.dataset.delApt) {
      HMSStorage.set(
        "hms_appointments",
        HMSStorage.get("hms_appointments", []).filter((x) => x.id !== e.target.dataset.delApt)
      );
      renderPat();
    }
    if (e.target.dataset.payBill) {
      const updated = HMSStorage.get("hms_bills", []).map((b) =>
        b.id === e.target.dataset.payBill ? { ...b, status: "Paid" } : b
      );
      HMSStorage.set("hms_bills", updated);
      renderPat();
    }
  });

  renderPat();
}
