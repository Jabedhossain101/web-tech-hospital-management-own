const regForm = document.getElementById("adminRegisterForm");
if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const adminId = document.getElementById("adminId").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const genderEl = document.querySelector("input[name='gender']:checked");
    const role = document.getElementById("adminRole").value;
    const permEls = Array.from(document.querySelectorAll("input[name='perm']:checked"));
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    let valid = true;

    if (!fullName) {
      document.getElementById("errFullName").textContent = "Please enter the name";
      valid = false;
    }
    if (!adminId) {
      document.getElementById("errAdminId").textContent = "Please enter the Admin ID";
      valid = false;
    }
    if (!email) {
      document.getElementById("errEmail").textContent = "Please enter the email";
      valid = false;
    }
    if (!phone) {
      document.getElementById("errPhone").textContent = "Please enter the phone number";
      valid = false;
    }
    if (!genderEl) {
      document.getElementById("errGender").textContent = "Please select the gender";
      valid = false;
    }
    if (!role) {
      document.getElementById("errRole").textContent = "Please select the admin role";
      valid = false;
    }
    if (permEls.length === 0) {
      document.getElementById("errPerm").textContent = "Please select at least one permission";
      valid = false;
    }
    if (username.length < 4 || username.length > 15) {
      document.getElementById("errUsername").textContent = "Please enter a username";
      valid = false;
    }
    const passValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!passValid) {
      document.getElementById("errPassword").textContent = "Please enter a password";
      valid = false;
    }
    if (password !== confirmPassword || !confirmPassword) {
      document.getElementById("errConfirmPassword").textContent = "Please confirm the password";
      valid = false;
    }

    const banner = document.getElementById("regBanner");
    if (!valid) {
      banner.textContent = "Please fix the errors marked in red.";
      banner.className = "status-banner";
      banner.style.display = "block";
      return;
    }

    const users = HMSStorage.get("hms_admin_users", []);
    users.push({
      id: adminId,
      fullName,
      email,
      phone,
      gender: genderEl.value,
      role,
      permissions: permEls.map((p) => p.value),
      username,
      password
    });
    HMSStorage.set("hms_admin_users", users);
    banner.textContent = "Registration successful! Redirecting to login...";
    banner.className = "status-banner success";
    banner.style.display = "block";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);
  });
}

const loginForm = document.getElementById("adminLoginForm");
if (loginForm) {
  let a = 9;
  let b = 3;
  const qEl = document.getElementById("captchaQuestion");
  const newBtn = document.getElementById("newCaptchaBtn");
  const togglePass = document.getElementById("togglePassword");
  const passInput = document.getElementById("loginPassword");

  function setCaptcha() {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    qEl.textContent = `What is ${a} + ${b} ?`;
  }

  newBtn.addEventListener("click", setCaptcha);
  togglePass.addEventListener("change", function () {
    passInput.type = this.checked ? "text" : "password";
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const adminId = document.getElementById("loginAdminId").value.trim();
    const password = passInput.value;
    const ans = document.getElementById("captchaAnswer").value.trim();
    const banner = document.getElementById("loginBanner");

    document.getElementById("errLoginId").textContent = "";
    document.getElementById("errLoginPassword").textContent = "";
    document.getElementById("errCaptcha").textContent = "";

    let ok = true;
    if (!adminId) {
      document.getElementById("errLoginId").textContent = "Please enter Admin ID";
      ok = false;
    }
    if (!password) {
      document.getElementById("errLoginPassword").textContent = "Please enter password";
      ok = false;
    }
    if (parseInt(ans, 10) !== a + b) {
      document.getElementById("errCaptcha").textContent = "Incorrect security answer";
      ok = false;
    }
    if (!ok) return;

    const users = HMSStorage.get("hms_admin_users", []);
    const matched = users.find((u) => u.id === adminId && u.password === password);
    if (!matched) {
      banner.textContent = "Invalid Admin ID or Password.";
      banner.className = "status-banner";
      banner.style.display = "block";
      return;
    }

    HMSStorage.set("hms_active_admin", matched);
    window.location.href = "dashboard.html";
  });
}

const dashNav = document.getElementById("adminDashNav");
if (dashNav) {
  const buttons = dashNav.querySelectorAll("button[data-tab]");
  const sections = document.querySelectorAll(".tab-section");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  const activeAdmin = HMSStorage.get("hms_active_admin", null);
  const infoEl = document.getElementById("activeAdminInfo");
  if (infoEl) {
    if (activeAdmin && activeAdmin.fullName) {
      infoEl.textContent = `Logged in as ${activeAdmin.fullName} (${activeAdmin.id}) | Role: ${activeAdmin.role} | Permissions: ${(activeAdmin.permissions || []).join(", ")}`;
    } else {
      infoEl.textContent = "Logged in as Default Admin (ADM-1234) | Role: Super Admin";
    }
  }

  function renderAll() {
    const staff = HMSStorage.get("hms_staff", []);
    const depts = HMSStorage.get("hms_departments", []);
    const reports = HMSStorage.get("hms_reports", []);

    document.getElementById("statStaffCount").textContent = staff.length;
    document.getElementById("statDeptCount").textContent = depts.length;
    document.getElementById("statReportCount").textContent = reports.length;

    const query = (document.getElementById("staffSearchInput").value || "").toLowerCase();
    const staffBody = document.getElementById("staffTableBody");
    staffBody.innerHTML = "";
    staff
      .filter((s) => s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query))
      .forEach((s) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.role}</td>
          <td>${s.department}</td>
          <td>${s.phone}</td>
          <td><button class="btn-danger" data-del-staff="${s.id}">Delete</button></td>
        `;
        staffBody.appendChild(tr);
      });

    const deptBody = document.getElementById("deptTableBody");
    deptBody.innerHTML = "";
    depts.forEach((d) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.head}</td>
        <td>${d.beds}</td>
        <td><button class="btn-danger" data-del-dept="${d.id}">Delete</button></td>
      `;
      deptBody.appendChild(tr);
    });

    const reportBody = document.getElementById("reportTableBody");
    reportBody.innerHTML = "";
    reports.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td>${r.status}</td>
        <td><button class="btn-danger" data-del-report="${r.id}">Delete</button></td>
      `;
      reportBody.appendChild(tr);
    });
  }

  document.getElementById("addStaffBtn").addEventListener("click", () => {
    const name = document.getElementById("staffName").value.trim();
    const role = document.getElementById("staffRole").value;
    const department = document.getElementById("staffDept").value.trim();
    const phone = document.getElementById("staffPhone").value.trim();
    if (!name || !department || !phone) return;
    const list = HMSStorage.get("hms_staff", []);
    list.push({ id: "STF-" + Date.now().toString().slice(-4), name, role, department, phone });
    HMSStorage.set("hms_staff", list);
    document.getElementById("staffName").value = "";
    document.getElementById("staffDept").value = "";
    document.getElementById("staffPhone").value = "";
    renderAll();
  });

  document.getElementById("addDeptBtn").addEventListener("click", () => {
    const name = document.getElementById("deptName").value.trim();
    const head = document.getElementById("deptHead").value.trim();
    const beds = document.getElementById("deptBeds").value.trim();
    if (!name || !head || !beds) return;
    const list = HMSStorage.get("hms_departments", []);
    list.push({ id: "DEPT-" + Date.now().toString().slice(-4), name, head, beds });
    HMSStorage.set("hms_departments", list);
    document.getElementById("deptName").value = "";
    document.getElementById("deptHead").value = "";
    document.getElementById("deptBeds").value = "";
    renderAll();
  });

  document.getElementById("addReportBtn").addEventListener("click", () => {
    const title = document.getElementById("reportTitle").value.trim();
    const category = document.getElementById("reportCategory").value;
    if (!title) return;
    const list = HMSStorage.get("hms_reports", []);
    list.push({ id: "REP-" + Date.now().toString().slice(-4), title, category, status: "Generated" });
    HMSStorage.set("hms_reports", list);
    document.getElementById("reportTitle").value = "";
    renderAll();
  });

  document.getElementById("staffSearchInput").addEventListener("input", renderAll);

  document.addEventListener("click", (e) => {
    if (e.target.dataset.delStaff) {
      const updated = HMSStorage.get("hms_staff", []).filter((i) => i.id !== e.target.dataset.delStaff);
      HMSStorage.set("hms_staff", updated);
      renderAll();
    }
    if (e.target.dataset.delDept) {
      const updated = HMSStorage.get("hms_departments", []).filter((i) => i.id !== e.target.dataset.delDept);
      HMSStorage.set("hms_departments", updated);
      renderAll();
    }
    if (e.target.dataset.delReport) {
      const updated = HMSStorage.get("hms_reports", []).filter((i) => i.id !== e.target.dataset.delReport);
      HMSStorage.set("hms_reports", updated);
      renderAll();
    }
  });

  renderAll();
}
