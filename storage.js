const HMSStorage = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  seedDefaults() {
    if (!localStorage.getItem("hms_admin_users")) {
      this.set("hms_admin_users", [
        {
          id: "ADM-1234",
          fullName: "Rifat Rudro",
          email: "admin@hospital.com",
          phone: "01712345678",
          gender: "Male",
          role: "Super Admin",
          permissions: ["Doctors", "Nurses", "Patients", "Reports"],
          username: "admin",
          password: "Admin123"
        }
      ]);
    }
    if (!localStorage.getItem("hms_doctor_users")) {
      this.set("hms_doctor_users", [
        {
          id: "DOC-1001",
          fullName: "Dr. Karim Ahmed",
          department: "Cardiology",
          username: "doctor",
          password: "Doctor123"
        }
      ]);
    }
    if (!localStorage.getItem("hms_nurse_users")) {
      this.set("hms_nurse_users", [
        {
          id: "NRS-2001",
          fullName: "Nurse Salma Akter",
          department: "General Ward",
          username: "nurse",
          password: "Nurse123"
        }
      ]);
    }
    if (!localStorage.getItem("hms_patient_users")) {
      this.set("hms_patient_users", [
        {
          id: "PAT-3001",
          fullName: "Tanvir Hasan",
          age: "28",
          username: "patient",
          password: "Patient123"
        }
      ]);
    }
    if (!localStorage.getItem("hms_staff")) {
      this.set("hms_staff", [
        {
          id: "STF-101",
          name: "Dr. Karim Ahmed",
          role: "Doctor",
          department: "Cardiology",
          phone: "01711000001"
        },
        {
          id: "STF-102",
          name: "Nurse Salma Akter",
          role: "Nurse",
          department: "General Ward",
          phone: "01711000002"
        }
      ]);
    }
    if (!localStorage.getItem("hms_departments")) {
      this.set("hms_departments", [
        { id: "DEPT-01", name: "Cardiology", head: "Dr. Karim Ahmed", beds: 25 },
        { id: "DEPT-02", name: "General Ward", head: "Dr. Mahbub Alam", beds: 40 }
      ]);
    }
    if (!localStorage.getItem("hms_reports")) {
      this.set("hms_reports", [
        { id: "REP-01", title: "Daily OPD Summary", category: "Operations", status: "Completed" },
        { id: "REP-02", title: "Pharmacy Stock Audit", category: "Inventory", status: "Reviewed" }
      ]);
    }
    if (!localStorage.getItem("hms_prescriptions")) {
      this.set("hms_prescriptions", [
        { id: "PRX-01", patient: "Tanvir Hasan", diagnosis: "Viral Fever", medicine: "Paracetamol 500mg" }
      ]);
    }
    if (!localStorage.getItem("hms_schedules")) {
      this.set("hms_schedules", [
        { id: "SCH-01", date: "2026-11-20", time: "10:00 AM", patient: "Tanvir Hasan" }
      ]);
    }
    if (!localStorage.getItem("hms_leaves")) {
      this.set("hms_leaves", [
        { id: "LEV-01", from: "2026-11-25", to: "2026-11-26", reason: "Family Event", status: "Pending" }
      ]);
    }
    if (!localStorage.getItem("hms_vitals")) {
      this.set("hms_vitals", [
        { id: "VIT-01", patient: "Tanvir Hasan", bp: "120/80 mmHg", temp: "98.6 F", pulse: "76 bpm" }
      ]);
    }
    if (!localStorage.getItem("hms_medlogs")) {
      this.set("hms_medlogs", [
        { id: "MED-01", patient: "Tanvir Hasan", medicine: "Paracetamol", time: "08:00 AM", status: "Given" }
      ]);
    }
    if (!localStorage.getItem("hms_shifts")) {
      this.set("hms_shifts", [
        { id: "SHF-01", current: "Morning (08:00-16:00)", requested: "Evening (16:00-00:00)", status: "Pending" }
      ]);
    }
    if (!localStorage.getItem("hms_appointments")) {
      this.set("hms_appointments", [
        { id: "APT-01", doctor: "Dr. Karim Ahmed", dept: "Cardiology", date: "2026-11-22", status: "Confirmed" }
      ]);
    }
    if (!localStorage.getItem("hms_bills")) {
      this.set("hms_bills", [
        { id: "BIL-01", item: "Consultation Fee", amount: "800 BDT", status: "Unpaid" }
      ]);
    }
    if (!localStorage.getItem("hms_feedbacks")) {
      this.set("hms_feedbacks", [
        { id: "FDB-01", rating: "5/5", comment: "Clean environment and helpful staff." }
      ]);
    }
  }
};

HMSStorage.seedDefaults();
