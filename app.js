/* =========================================================
   LAUNDRY MANAGER PWA
   FILE 3 — app.js
   VERSION 4.0.0
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const APP_VERSION = "4.0.0";
const DB_NAME = "LaundryManagerDB";
const DB_VERSION = 1;

let db = null;

let state = {
  settings: {
    appName: "Laundry Manager",
    showCommission: true,
    darkMode: false
  },

  employees: [],
  items: [],
  tiers: [],
  jobs: [],

  editingEmployeeId: null,
  editingItemId: null,
  editingTierId: null
};


/* =========================================================
   HELPER
========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatCurrency(value) {

  const number = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function formatNumber(value) {

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showElement(element) {

  if (!element) return;

  element.classList.remove("hidden");
}

function hideElement(element) {

  if (!element) return;

  element.classList.add("hidden");
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "info") {

  let container = $("#toastContainer");

  if (!container) {

    container = document.createElement("div");

    container.id = "toastContainer";

    container.className = "toast-container";

    document.body.appendChild(container);
  }

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <span>${icons[type] || "ℹ️"}</span>
    <div>${escapeHTML(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = "0";

    toast.style.transform = "translateX(20px)";

    setTimeout(() => toast.remove(), 300);

  }, 3500);
}


/* =========================================================
   INDEXED DB
========================================================= */

function openDatabase() {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {

      db = event.target.result;

      if (!db.objectStoreNames.contains("settings")) {

        db.createObjectStore("settings", {
          keyPath: "key"
        });
      }

      if (!db.objectStoreNames.contains("employees")) {

        db.createObjectStore("employees", {
          keyPath: "id"
        });
      }

      if (!db.objectStoreNames.contains("items")) {

        db.createObjectStore("items", {
          keyPath: "id"
        });
      }

      if (!db.objectStoreNames.contains("tiers")) {

        db.createObjectStore("tiers", {
          keyPath: "id"
        });
      }

      if (!db.objectStoreNames.contains("jobs")) {

        db.createObjectStore("jobs", {
          keyPath: "id"
        });
      }
    };

    request.onsuccess = () => {

      db = request.result;

      resolve(db);
    };
  });
}


function dbGetAll(storeName) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(storeName, "readonly");

    const store = transaction.objectStore(storeName);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}


function dbGet(storeName, key) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(storeName, "readonly");

    const store = transaction.objectStore(storeName);

    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}


function dbPut(storeName, data) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(storeName, "readwrite");

    const store = transaction.objectStore(storeName);

    const request = store.put(data);

    request.onsuccess = () => resolve(true);

    request.onerror = () => reject(request.error);
  });
}


function dbDelete(storeName, key) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(storeName, "readwrite");

    const store = transaction.objectStore(storeName);

    const request = store.delete(key);

    request.onsuccess = () => resolve(true);

    request.onerror = () => reject(request.error);
  });
}


function dbClear(storeName) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(storeName, "readwrite");

    const store = transaction.objectStore(storeName);

    const request = store.clear();

    request.onsuccess = () => resolve(true);

    request.onerror = () => reject(request.error);
  });
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

  try {

    const settingsData = await dbGetAll("settings");

    settingsData.forEach(item => {

      if (item.key === "appSettings") {

        state.settings = {
          ...state.settings,
          ...item.value
        };
      }
    });

    state.employees = await dbGetAll("employees");

    state.items = await dbGetAll("items");

    state.tiers = await dbGetAll("tiers");

    state.jobs = await dbGetAll("jobs");

  } catch (error) {

    console.error(error);

    showToast(
      "Gagal membaca database",
      "error"
    );
  }
}


/* =========================================================
   SAVE SETTINGS
========================================================= */

async function saveSettings() {

  await dbPut("settings", {
    key: "appSettings",
    value: state.settings
  });
}


/* =========================================================
   DEFAULT DATA
========================================================= */

async function createDefaultData() {

  if (state.tiers.length === 0) {

    const defaultTier = {
      id: generateId("tier"),
      name: "Tier 1",
      description: "Parameter standar",
      createdAt: new Date().toISOString()
    };

    state.tiers.push(defaultTier);

    await dbPut("tiers", defaultTier);
  }
}


/* =========================================================
   APP NAME
========================================================= */

function updateAppName() {

  const appName = state.settings.appName || "Laundry Manager";

  document.title = appName;

  const appNameElements = $all("[data-app-name]");

  appNameElements.forEach(element => {
    element.textContent = appName;
  });

  const settingInput = $("#settingAppName");

  if (settingInput) {

    settingInput.value = appName;
  }
}


/* =========================================================
   DARK MODE
========================================================= */

function updateDarkMode() {

  document.body.classList.toggle(
    "dark-mode",
    Boolean(state.settings.darkMode)
  );

  const toggle = $("#darkModeToggle");

  if (toggle) {

    toggle.checked = Boolean(
      state.settings.darkMode
    );
  }
}


/* =========================================================
   COMMISSION VISIBILITY
========================================================= */

function updateCommissionVisibility() {

  const show = Boolean(
    state.settings.showCommission
  );

  document.body.classList.toggle(
    "hide-commission",
    !show
  );

  const toggle = $("#commissionSwitch");

  if (toggle) {

    toggle.checked = show;
  }
}


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(pageName) {

  $all(".page").forEach(page => {

    page.classList.remove("active");
  });

  const targetPage = $(`#page-${pageName}`);

  if (targetPage) {

    targetPage.classList.add("active");
  }

  $all(".nav-item").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  const titles = {

    dashboard: "Dashboard",

    input: "Input Laundry",

    whatsapp: "Import WhatsApp",

    jobs: "Data Pekerjaan",

    reports: "Laporan",

    employees: "Karyawan",

    items: "Item Laundry",

    tiers: "Tier / Parameter",

    backup: "Backup & Restore",

    settings: "Pengaturan"
  };

  const title = titles[pageName] || "Laundry Manager";

  const pageTitle = $("#pageTitle");

  if (pageTitle) {

    pageTitle.textContent = title;
  }

  closeSidebar();

  if (pageName === "dashboard") {

    renderDashboard();
  }

  if (pageName === "jobs") {

    renderJobs();
  }

  if (pageName === "employees") {

    renderEmployees();
  }

  if (pageName === "items") {

    renderItems();
  }

  if (pageName === "tiers") {

    renderTiers();
  }

  if (pageName === "reports") {

    renderReports();
  }
}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

  const sidebar = $("#sidebar");

  const overlay = $("#sidebarOverlay");

  if (sidebar) {

    sidebar.classList.add("open");
  }

  if (overlay) {

    overlay.classList.add("show");
  }
}


function closeSidebar() {

  const sidebar = $("#sidebar");

  const overlay = $("#sidebarOverlay");

  if (sidebar) {

    sidebar.classList.remove("open");
  }

  if (overlay) {

    overlay.classList.remove("show");
  }
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  const today = todayISO();

  const todayJobs = state.jobs.filter(job => {

    return job.date === today;
  });

  const totalQty = todayJobs.reduce(
    (total, job) => total + Number(job.qty || 0),
    0
  );

  const totalCommission = todayJobs.reduce(
    (total, job) => total + Number(job.commission || 0),
    0
  );

  setText(
    "#statTodayJobs",
    todayJobs.length
  );

  setText(
    "#statTodayQty",
    formatNumber(totalQty)
  );

  setText(
    "#statEmployees",
    state.employees.length
  );

  setText(
    "#statCommission",
    formatCurrency(totalCommission)
  );

  renderRecentJobs();
}


function renderRecentJobs() {

  const container = $("#recentJobs");

  if (!container) return;

  const jobs = [...state.jobs]
    .sort((a, b) => {

      return new Date(b.createdAt)
        - new Date(a.createdAt);
    })
    .slice(0, 5);

  if (jobs.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>📭</span>
        <h3>Belum ada pekerjaan</h3>
        <p>Masukkan data laundry untuk mulai.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = jobs.map(job => {

    return `
      <div class="recent-job">

        <div class="recent-job-left">

          <div class="recent-job-icon">
            🧺
          </div>

          <div>

            <strong>
              ${escapeHTML(job.itemName)}
            </strong>

            <small>
              ${formatDate(job.date)}
              •
              ${formatNumber(job.qty)}
              ${escapeHTML(job.unit || "")}
            </small>

          </div>

        </div>

        <strong>
          ${formatNumber(job.qty)}
          ${escapeHTML(job.unit || "")}
        </strong>

      </div>
    `;

  }).join("");
}


/* =========================================================
   EMPLOYEE
========================================================= */

function renderEmployeeOptions() {

  const select = $("#jobEmployee");

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Pilih Karyawan
    </option>
  `;

  state.employees.forEach(employee => {

    const option = document.createElement("option");

    option.value = employee.id;

    option.textContent = employee.name;

    select.appendChild(option);
  });
}


function renderEmployees() {

  const container = $("#employeeList");

  if (!container) return;

  if (state.employees.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>👷</span>
        <h3>Belum ada karyawan</h3>
        <p>Tambahkan karyawan terlebih dahulu.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = state.employees.map(employee => {

    return `
      <div class="employee-card">

        <div class="employee-card-header">

          <div class="employee-avatar">
            👤
          </div>

          <div class="employee-info">

            <strong>
              ${escapeHTML(employee.name)}
            </strong>

            <small>
              ${escapeHTML(
                employee.description || "-"
              )}
            </small>

          </div>

          <div class="table-actions">

            <button
              class="table-action"
              onclick="editEmployee('${employee.id}')"
              title="Edit"
            >
              ✏️
            </button>

            <button
              class="table-action"
              onclick="deleteEmployee('${employee.id}')"
              title="Hapus"
            >
              🗑️
            </button>

          </div>

        </div>

        <div class="employee-commission">

          <span>
            Komisi Default
          </span>

          <strong>
            ${formatCurrency(employee.commission || 0)}
          </strong>

        </div>

      </div>
    `;

  }).join("");
}


async function saveEmployee() {

  const nameInput = $("#employeeName");

  if (!nameInput) return;

  const name = nameInput.value.trim();

  if (!name) {

    showToast(
      "Nama karyawan wajib diisi",
      "warning"
    );

    return;
  }

  const commission = Number(
    $("#employeeCommission")?.value || 0
  );

  const description =
    $("#employeeDescription")?.value.trim() || "";

  let employee;

  if (state.editingEmployeeId) {

    employee = state.employees.find(
      item => item.id === state.editingEmployeeId
    );

    if (!employee) return;

    employee.name = name;

    employee.commission = commission;

    employee.description = description;

    employee.updatedAt =
      new Date().toISOString();

  } else {

    employee = {

      id: generateId("emp"),

      name,

      commission,

      description,

      createdAt:
        new Date().toISOString()
    };

    state.employees.push(employee);
  }

  await dbPut(
    "employees",
    employee
  );

  closeEmployeeModal();

  renderEmployees();

  renderEmployeeOptions();

  showToast(
    "Data karyawan berhasil disimpan",
    "success"
  );
}


function openEmployeeModal() {

  state.editingEmployeeId = null;

  setValue("#employeeName", "");

  setValue("#employeeCommission", 0);

  setValue("#employeeDescription", "");

  setText(
    "#employeeModalTitle",
    "Tambah Karyawan"
  );

  showElement($("#employeeModal"));
}


function closeEmployeeModal() {

  hideElement($("#employeeModal"));

  state.editingEmployeeId = null;
}


window.editEmployee = function(id) {

  const employee = state.employees.find(
    item => item.id === id
  );

  if (!employee) return;

  state.editingEmployeeId = id;

  setValue(
    "#employeeName",
    employee.name
  );

  setValue(
    "#employeeCommission",
    employee.commission
  );

  setValue(
    "#employeeDescription",
    employee.description
  );

  setText(
    "#employeeModalTitle",
    "Edit Karyawan"
  );

  showElement($("#employeeModal"));
};


window.deleteEmployee = async function(id) {

  const employee = state.employees.find(
    item => item.id === id
  );

  if (!employee) return;

  const confirmDelete = confirm(
    `Hapus karyawan "${employee.name}"?`
  );

  if (!confirmDelete) return;

  await dbDelete("employees", id);

  state.employees =
    state.employees.filter(
      item => item.id !== id
    );

  renderEmployees();

  renderEmployeeOptions();

  showToast(
    "Karyawan berhasil dihapus",
    "success"
  );
};


/* =========================================================
   ITEMS
========================================================= */

function renderItemOptions() {

  const select = $("#jobItem");

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Pilih Item
    </option>
  `;

  state.items.forEach(item => {

    const option =
      document.createElement("option");

    option.value = item.id;

    option.textContent =
      `${item.name} (${item.unit})`;

    select.appendChild(option);
  });
}


function renderItems() {

  const container = $("#itemList");

  if (!container) return;

  if (state.items.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>🧺</span>
        <h3>Belum ada item</h3>
        <p>Tambahkan jenis laundry dan kode.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = state.items.map(item => {

    const codes =
      Array.isArray(item.codes)
        ? item.codes.join(", ")
        : item.codes;

    return `
      <div class="item-card">

        <div class="table-actions"
             style="position:absolute;right:15px;top:15px">

          <button
            class="table-action"
            onclick="editItem('${item.id}')"
          >
            ✏️
          </button>

          <button
            class="table-action"
            onclick="deleteItem('${item.id}')"
          >
            🗑️
          </button>

        </div>

        <h4>
          ${escapeHTML(item.name)}
        </h4>

        <div class="item-meta">

          <span class="badge">
            ${escapeHTML(item.unit)}
          </span>

          <span class="badge success">
            ${escapeHTML(codes)}
          </span>

        </div>

        <strong>
          Komisi:
          ${formatCurrency(item.commission || 0)}
        </strong>

      </div>
    `;

  }).join("");
}


async function saveItem() {

  const name =
    $("#itemName")?.value.trim();

  if (!name) {

    showToast(
      "Nama item wajib diisi",
      "warning"
    );

    return;
  }

  const codeText =
    $("#itemCodes")?.value || "";

  const codes = codeText
    .split(",")
    .map(code => code.trim().toLowerCase())
    .filter(Boolean);

  const unit =
    $("#itemUnit")?.value || "KG";

  const commission =
    Number($("#itemCommission")?.value || 0);

  const tierId =
    $("#itemTier")?.value || "";

  let item;

  if (state.editingItemId) {

    item = state.items.find(
      data => data.id === state.editingItemId
    );

    if (!item) return;

    item.name = name;

    item.codes = codes;

    item.unit = unit;

    item.commission = commission;

    item.tierId = tierId;

    item.updatedAt =
      new Date().toISOString();

  } else {

    item = {

      id: generateId("item"),

      name,

      codes,

      unit,

      commission,

      tierId,

      createdAt:
        new Date().toISOString()
    };

    state.items.push(item);
  }

  await dbPut(
    "items",
    item
  );

  closeItemModal();

  renderItems();

  renderItemOptions();

  showToast(
    "Item berhasil disimpan",
    "success"
  );
}


function renderTierOptions() {

  const select = $("#itemTier");

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Tanpa Tier
    </option>
  `;

  state.tiers.forEach(tier => {

    const option =
      document.createElement("option");

    option.value = tier.id;

    option.textContent = tier.name;

    select.appendChild(option);
  });
}


function openItemModal() {

  state.editingItemId = null;

  setValue("#itemName", "");

  setValue("#itemCodes", "");

  setValue("#itemCommission", 0);

  setValue("#itemUnit", "KG");

  renderTierOptions();

  setText(
    "#itemModalTitle",
    "Tambah Item"
  );

  showElement($("#itemModal"));
}


function closeItemModal() {

  hideElement($("#itemModal"));

  state.editingItemId = null;
}


window.editItem = function(id) {

  const item = state.items.find(
    data => data.id === id
  );

  if (!item) return;

  state.editingItemId = id;

  renderTierOptions();

  setValue("#itemName", item.name);

  setValue(
    "#itemCodes",
    Array.isArray(item.codes)
      ? item.codes.join(", ")
      : item.codes
  );

  setValue("#itemUnit", item.unit);

  setValue(
    "#itemCommission",
    item.commission
  );

  setValue(
    "#itemTier",
    item.tierId || ""
  );

  setText(
    "#itemModalTitle",
    "Edit Item"
  );

  showElement($("#itemModal"));
};


window.deleteItem = async function(id) {

  const item = state.items.find(
    data => data.id === id
  );

  if (!item) return;

  if (!confirm(
    `Hapus item "${item.name}"?`
  )) return;

  await dbDelete(
    "items",
    id
  );

  state.items =
    state.items.filter(
      data => data.id !== id
    );

  renderItems();

  renderItemOptions();

  showToast(
    "Item berhasil dihapus",
    "success"
  );
};


/* =========================================================
   TIER
========================================================= */

function renderTiers() {

  const container = $("#tierList");

  if (!container) return;

  if (state.tiers.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>📊</span>
        <h3>Belum ada tier</h3>
        <p>Tambahkan parameter sesuai kebutuhan.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = state.tiers.map(tier => {

    return `
      <div class="tier-card">

        <div>

          <strong>
            ${escapeHTML(tier.name)}
          </strong>

          <small>
            ${escapeHTML(
              tier.description || "-"
            )}
          </small>

        </div>

        <div class="table-actions">

          <button
            class="table-action"
            onclick="editTier('${tier.id}')"
          >
            ✏️
          </button>

          <button
            class="table-action"
            onclick="deleteTier('${tier.id}')"
          >
            🗑️
          </button>

        </div>

      </div>
    `;

  }).join("");
}


async function saveTier() {

  const name =
    $("#tierName")?.value.trim();

  if (!name) {

    showToast(
      "Nama tier wajib diisi",
      "warning"
    );

    return;
  }

  const description =
    $("#tierDescription")?.value.trim() || "";

  let tier;

  if (state.editingTierId) {

    tier = state.tiers.find(
      item => item.id === state.editingTierId
    );

    if (!tier) return;

    tier.name = name;

    tier.description = description;

    tier.updatedAt =
      new Date().toISOString();

  } else {

    tier = {

      id: generateId("tier"),

      name,

      description,

      createdAt:
        new Date().toISOString()
    };

    state.tiers.push(tier);
  }

  await dbPut(
    "tiers",
    tier
  );

  closeTierModal();

  renderTiers();

  renderTierOptions();

  showToast(
    "Tier berhasil disimpan",
    "success"
  );
}


function openTierModal() {

  state.editingTierId = null;

  setValue("#tierName", "");

  setValue("#tierDescription", "");

  setText(
    "#tierModalTitle",
    "Tambah Tier"
  );

  showElement($("#tierModal"));
}


function closeTierModal() {

  hideElement($("#tierModal"));

  state.editingTierId = null;
}


window.editTier = function(id) {

  const tier = state.tiers.find(
    item => item.id === id
  );

  if (!tier) return;

  state.editingTierId = id;

  setValue("#tierName", tier.name);

  setValue(
    "#tierDescription",
    tier.description
  );

  setText(
    "#tierModalTitle",
    "Edit Tier"
  );

  showElement($("#tierModal"));
};


window.deleteTier = async function(id) {

  if (state.tiers.length <= 1) {

    showToast(
      "Minimal harus ada 1 tier",
      "warning"
    );

    return;
  }

  const tier = state.tiers.find(
    item => item.id === id
  );

  if (!tier) return;

  if (!confirm(
    `Hapus tier "${tier.name}"?`
  )) return;

  await dbDelete(
    "tiers",
    id
  );

  state.tiers =
    state.tiers.filter(
      item => item.id !== id
    );

  renderTiers();

  renderTierOptions();

  showToast(
    "Tier berhasil dihapus",
    "success"
  );
};


/* =========================================================
   COMMISSION CALCULATION
========================================================= */

function calculateCommission(
  employee,
  item,
  qty
) {

  let commission = 0;

  const employeeCommission =
    Number(employee?.commission || 0);

  const itemCommission =
    Number(item?.commission || 0);

  /*
    LOGIKA KOMISI:

    1. Komisi Item
    2. Komisi Karyawan
    3. Digabung
  */

  commission =
    (employeeCommission + itemCommission)
    * Number(qty || 0);

  return commission;
}


/* =========================================================
   JOB
========================================================= */

async function saveJob() {

  const employeeId =
    $("#jobEmployee")?.value;

  const itemId =
    $("#jobItem")?.value;

  const qty =
    Number($("#jobQty")?.value || 0);

  const date =
    $("#jobDate")?.value || todayISO();

  const customer =
    $("#jobCustomer")?.value.trim() || "";

  if (!employeeId) {

    showToast(
      "Pilih karyawan",
      "warning"
    );

    return;
  }

  if (!itemId) {

    showToast(
      "Pilih item",
      "warning"
    );

    return;
  }

  if (!qty || qty <= 0) {

    showToast(
      "Jumlah harus lebih dari 0",
      "warning"
    );

    return;
  }

  const employee =
    state.employees.find(
      item => item.id === employeeId
    );

  const item =
    state.items.find(
      data => data.id === itemId
    );

  if (!employee || !item) {

    showToast(
      "Data tidak ditemukan",
      "error"
    );

    return;
  }

  const commission =
    calculateCommission(
      employee,
      item,
      qty
    );

  const job = {

    id: generateId("job"),

    employeeId,

    employeeName:
      employee.name,

    itemId,

    itemName:
      item.name,

    unit:
      item.unit,

    qty,

    customer,

    commission,

    date,

    createdAt:
      new Date().toISOString()
  };

  state.jobs.push(job);

  await dbPut(
    "jobs",
    job
  );

  resetJobForm();

  renderDashboard();

  renderJobs();

  showToast(
    "Pekerjaan berhasil ditambahkan",
    "success"
  );
}


function resetJobForm() {

  setValue("#jobEmployee", "");

  setValue("#jobItem", "");

  setValue("#jobQty", "");

  setValue("#jobCustomer", "");

  setValue("#jobDate", todayISO());
}


/* =========================================================
   JOBS TABLE
========================================================= */

function renderJobs() {

  const tbody = $("#jobsTableBody");

  if (!tbody) return;

  const jobs = [...state.jobs]
    .sort((a, b) => {

      return new Date(b.createdAt)
        - new Date(a.createdAt);
    });

  if (jobs.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <span>📭</span>
            <h3>Belum ada data</h3>
          </div>
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = jobs.map(job => {

    return `
      <tr>

        <td>
          ${formatDate(job.date)}
        </td>

        <td>
          ${escapeHTML(job.employeeName)}
        </td>

        <td>
          ${escapeHTML(job.customer || "-")}
        </td>

        <td>
          ${escapeHTML(job.itemName)}
        </td>

        <td>
          ${formatNumber(job.qty)}
          ${escapeHTML(job.unit)}
        </td>

        <td class="commission-column">
          ${formatCurrency(job.commission)}
        </td>

        <td>

          <button
            class="table-action"
            onclick="deleteJob('${job.id}')"
          >
            🗑️
          </button>

        </td>

      </tr>
    `;

  }).join("");
}


window.deleteJob = async function(id) {

  const job = state.jobs.find(
    item => item.id === id
  );

  if (!job) return;

  if (!confirm(
    "Hapus data pekerjaan ini?"
  )) return;

  await dbDelete(
    "jobs",
    id
  );

  state.jobs =
    state.jobs.filter(
      item => item.id !== id
    );

  renderJobs();

  renderDashboard();

  showToast(
    "Data berhasil dihapus",
    "success"
  );
};


/* =========================================================
   WHATSAPP PARSER
========================================================= */

function parseWhatsAppText(text) {

  const lines =
    text.split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  const results = [];

  lines.forEach(line => {

    const normalized =
      line.toLowerCase()
        .replace(/,/g, ".");

    /*
      Contoh:

      desi cks 5kg
      wanto cks 5
      yadi sepatu 2
      andi spt 2
    */

    const parts =
      normalized.split(/\s+/);

    if (parts.length < 3) return;

    const customer =
      parts[0];

    const code =
      parts[1];

    const qtyText =
      parts.slice(2).join(" ");

    const qtyMatch =
      qtyText.match(
        /(\d+(?:\.\d+)?)/
      );

    if (!qtyMatch) return;

    const qty =
      Number(qtyMatch[1]);

    const item =
      findItemByCode(code);

    if (!item) {

      results.push({

        line,

        status: "error",

        customer,

        code,

        qty,

        message:
          "Kode item tidak ditemukan"
      });

      return;
    }

    results.push({

      line,

      status: "success",

      customer,

      itemId:
        item.id,

      itemName:
        item.name,

      code,

      qty,

      unit:
        item.unit
    });

  });

  return results;
}


function findItemByCode(code) {

  const normalizedCode =
    String(code)
      .toLowerCase()
      .trim();

  return state.items.find(item => {

    const codes =
      Array.isArray(item.codes)
        ? item.codes
        : String(item.codes)
            .split(",");

    return codes.some(itemCode => {

      return String(itemCode)
        .trim()
        .toLowerCase()
        === normalizedCode;

    });

  });
}


function previewWhatsApp() {

  const text =
    $("#whatsappInput")?.value || "";

  if (!text.trim()) {

    showToast(
      "Masukkan teks WhatsApp",
      "warning"
    );

    return;
  }

  const results =
    parseWhatsAppText(text);

  renderWhatsAppPreview(results);

  window.whatsappParsedData =
    results;
}


function renderWhatsAppPreview(results) {

  const container =
    $("#whatsappPreview");

  if (!container) return;

  if (results.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>⚠️</span>
        <h3>Format tidak ditemukan</h3>
        <p>
          Contoh:
          desi cks 5kg
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <table>

      <thead>

        <tr>

          <th>Status</th>

          <th>Customer</th>

          <th>Item</th>

          <th>Jumlah</th>

        </tr>

      </thead>

      <tbody>

        ${results.map(result => {

          if (result.status === "error") {

            return `
              <tr>

                <td>❌</td>

                <td>
                  ${escapeHTML(
                    result.customer
                  )}
                </td>

                <td>
                  ${escapeHTML(
                    result.code
                  )}
                </td>

                <td>
                  ${formatNumber(
                    result.qty
                  )}
                </td>

              </tr>
            `;
          }

          return `
            <tr>

              <td>✅</td>

              <td>
                ${escapeHTML(
                  result.customer
                )}
              </td>

              <td>
                ${escapeHTML(
                  result.itemName
                )}
              </td>

              <td>
                ${formatNumber(
                  result.qty
                )}
                ${escapeHTML(
                  result.unit
                )}
              </td>

            </tr>
          `;

        }).join("")}

      </tbody>

    </table>
  `;
}


async function importWhatsApp() {

  const employeeId =
    $("#whatsappEmployee")?.value;

  if (!employeeId) {

    showToast(
      "Pilih karyawan terlebih dahulu",
      "warning"
    );

    return;
  }

  const employee =
    state.employees.find(
      item => item.id === employeeId
    );

  if (!employee) return;

  const results =
    window.whatsappParsedData || [];

  const successResults =
    results.filter(
      result =>
        result.status === "success"
    );

  if (successResults.length === 0) {

    showToast(
      "Tidak ada data valid",
      "warning"
    );

    return;
  }

  const date =
    $("#whatsappDate")?.value
    || todayISO();

  for (const result of successResults) {

    const item =
      state.items.find(
        data => data.id === result.itemId
      );

    if (!item) continue;

    const commission =
      calculateCommission(
        employee,
        item,
        result.qty
      );

    const job = {

      id: generateId("job"),

      employeeId,

      employeeName:
        employee.name,

      itemId:
        item.id,

      itemName:
        item.name,

      customer:
        result.customer,

      qty:
        result.qty,

      unit:
        item.unit,

      commission,

      date,

      createdAt:
        new Date().toISOString()
    };

    state.jobs.push(job);

    await dbPut(
      "jobs",
      job
    );
  }

  renderDashboard();

  renderJobs();

  showToast(
    `${successResults.length} pekerjaan berhasil diimport`,
    "success"
  );
}


/* =========================================================
   REPORT
========================================================= */

function getReportJobs(
  startDate,
  endDate,
  employeeId
) {

  return state.jobs.filter(job => {

    if (
      startDate
      && job.date < startDate
    ) return false;

    if (
      endDate
      && job.date > endDate
    ) return false;

    if (
      employeeId
      && job.employeeId !== employeeId
    ) return false;

    return true;
  });
}


function renderReports() {

  renderReportEmployeeOptions();

  const today = todayISO();

  setValue(
    "#reportStartDate",
    today
  );

  setValue(
    "#reportEndDate",
    today
  );
}


function renderReportEmployeeOptions() {

  const select =
    $("#reportEmployee");

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Semua Karyawan
    </option>
  `;

  state.employees.forEach(employee => {

    const option =
      document.createElement("option");

    option.value = employee.id;

    option.textContent =
      employee.name;

    select.appendChild(option);
  });
}


function generateReport() {

  const startDate =
    $("#reportStartDate")?.value;

  const endDate =
    $("#reportEndDate")?.value;

  const employeeId =
    $("#reportEmployee")?.value;

  const jobs =
    getReportJobs(
      startDate,
      endDate,
      employeeId
    );

  renderReportSummary(jobs);

  renderReportTable(jobs);

  window.currentReportJobs =
    jobs;
}


function renderReportSummary(jobs) {

  const totalQty =
    jobs.reduce(
      (total, job) =>
        total + Number(job.qty || 0),
      0
    );

  const totalCommission =
    jobs.reduce(
      (total, job) =>
        total + Number(job.commission || 0),
      0
    );

  setText(
    "#reportTotalJobs",
    jobs.length
  );

  setText(
    "#reportTotalQty",
    formatNumber(totalQty)
  );

  setText(
    "#reportTotalCommission",
    formatCurrency(totalCommission)
  );
}


function renderReportTable(jobs) {

  const container =
    $("#reportContent");

  if (!container) return;

  if (jobs.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <span>📊</span>
        <h3>Tidak ada data</h3>
        <p>Belum ada pekerjaan pada periode ini.</p>
      </div>
    `;

    return;
  }

  const showCommission =
    state.settings.showCommission;

  container.innerHTML = `
    <div class="table-responsive">

      <table>

        <thead>

          <tr>

            <th>Tanggal</th>

            <th>Karyawan</th>

            <th>Item</th>

            <th>Jumlah</th>

            ${
              showCommission
                ? "<th>Komisi</th>"
                : ""
            }

          </tr>

        </thead>

        <tbody>

          ${jobs.map(job => {

            return `
              <tr>

                <td>
                  ${formatDate(job.date)}
                </td>

                <td>
                  ${escapeHTML(
                    job.employeeName
                  )}
                </td>

                <td>
                  ${escapeHTML(
                    job.itemName
                  )}
                </td>

                <td>
                  ${formatNumber(job.qty)}
                  ${escapeHTML(job.unit)}
                </td>

                ${
                  showCommission
                    ? `
                      <td>
                        ${formatCurrency(
                          job.commission
                        )}
                      </td>
                    `
                    : ""
                }

              </tr>
            `;

          }).join("")}

        </tbody>

      </table>

    </div>
  `;
}


/* =========================================================
   THERMAL PRINT
========================================================= */

function printThermal() {

  const jobs =
    window.currentReportJobs || [];

  if (jobs.length === 0) {

    showToast(
      "Generate laporan terlebih dahulu",
      "warning"
    );

    return;
  }

  const totalCommission =
    jobs.reduce(
      (total, job) =>
        total + Number(job.commission || 0),
      0
    );

  const showCommission =
    state.settings.showCommission;

  let rows = "";

  jobs.forEach(job => {

    rows += `
      <tr>

        <td>
          ${escapeHTML(job.itemName)}
        </td>

        <td style="text-align:right">
          ${formatNumber(job.qty)}
          ${escapeHTML(job.unit)}
        </td>

      </tr>
    `;
  });

  const printArea =
    $("#printArea");

  if (!printArea) return;

  printArea.innerHTML = `

    <div class="thermal-print">

      <h2>
        ${escapeHTML(
          state.settings.appName
        )}
      </h2>

      <p style="text-align:center">
        LAPORAN HARIAN
      </p>

      <hr>

      <table>

        <tbody>

          ${rows}

        </tbody>

      </table>

      <hr>

      ${
        showCommission
          ? `
            <p>
              Komisi:
              <strong>
                ${formatCurrency(
                  totalCommission
                )}
              </strong>
            </p>
          `
          : ""
      }

      <p style="text-align:center">
        Terima Kasih
      </p>

    </div>
  `;

  window.print();
}


/* =========================================================
   WHATSAPP SHARE REPORT
========================================================= */

function shareReportWhatsApp() {

  const jobs =
    window.currentReportJobs || [];

  if (jobs.length === 0) {

    showToast(
      "Generate laporan terlebih dahulu",
      "warning"
    );

    return;
  }

  const grouped = {};

  jobs.forEach(job => {

    const key =
      `${job.itemName}|${job.unit}`;

    if (!grouped[key]) {

      grouped[key] = {

        itemName:
          job.itemName,

        unit:
          job.unit,

        qty: 0
      };
    }

    grouped[key].qty +=
      Number(job.qty || 0);
  });

  let text =
    `🧺 ${state.settings.appName}\n`;

  text +=
    `📅 Laporan Laundry\n\n`;

  Object.values(grouped).forEach(item => {

    text +=
      `${item.itemName}: `
      + `${formatNumber(item.qty)} `
      + `${item.unit}\n`;
  });

  if (state.settings.showCommission) {

    const totalCommission =
      jobs.reduce(
        (total, job) =>
          total
          + Number(job.commission || 0),
        0
      );

    text +=
      `\n💰 Komisi: `
      + formatCurrency(totalCommission);
  }

  const url =
    `https://wa.me/?text=`
    + encodeURIComponent(text);

  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   EXPORT JSON BACKUP
========================================================= */

function exportBackup() {

  const backup = {

    app:
      state.settings.appName,

    version:
      APP_VERSION,

    createdAt:
      new Date().toISOString(),

    settings:
      state.settings,

    employees:
      state.employees,

    items:
      state.items,

    tiers:
      state.tiers,

    jobs:
      state.jobs
  };

  const json =
    JSON.stringify(
      backup,
      null,
      2
    );

  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  const date =
    new Date()
      .toISOString()
      .split("T")[0];

  link.href = url;

  link.download =
    `LAUNDRY_MANAGER_BACKUP_${date}.json`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

  showToast(
    "Backup berhasil dibuat",
    "success"
  );
}


/* =========================================================
   RESTORE BACKUP
========================================================= */

function restoreBackup(file) {

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async event => {

    try {

      const backup =
        JSON.parse(
          event.target.result
        );

      if (!backup) {

        throw new Error(
          "File backup tidak valid"
        );
      }

      if (!confirm(
        "Restore akan mengganti data saat ini. Lanjutkan?"
      )) {

        return;
      }

      await dbClear("settings");

      await dbClear("employees");

      await dbClear("items");

      await dbClear("tiers");

      await dbClear("jobs");

      state.settings =
        backup.settings
        || state.settings;

      state.employees =
        backup.employees
        || [];

      state.items =
        backup.items
        || [];

      state.tiers =
        backup.tiers
        || [];

      state.jobs =
        backup.jobs
        || [];

      await saveSettings();

      for (const employee of state.employees) {

        await dbPut(
          "employees",
          employee
        );
      }

      for (const item of state.items) {

        await dbPut(
          "items",
          item
        );
      }

      for (const tier of state.tiers) {

        await dbPut(
          "tiers",
          tier
        );
      }

      for (const job of state.jobs) {

        await dbPut(
          "jobs",
          job
        );
      }

      updateAppName();

      updateDarkMode();

      updateCommissionVisibility();

      renderAll();

      showToast(
        "Restore berhasil",
        "success"
      );

    } catch (error) {

      console.error(error);

      showToast(
        "File backup tidak valid atau gagal diproses",
        "error"
      );
    }
  };

  reader.readAsText(file);
}


/* =========================================================
   DATABASE INFO
========================================================= */

async function updateDatabaseInfo() {

  const element =
    $("#databaseInfo");

  if (!element) return;

  try {

    const estimate =
      await navigator.storage?.estimate();

    if (!estimate) {

      element.innerHTML =
        "IndexedDB aktif";

      return;
    }

    const used =
      estimate.usage || 0;

    const quota =
      estimate.quota || 0;

    element.innerHTML = `
      <strong>IndexedDB Aktif</strong>
      <br>
      Data digunakan:
      ${formatBytes(used)}
      /
      ${formatBytes(quota)}
    `;

  } catch {

    element.textContent =
      "IndexedDB Aktif";
  }
}


function formatBytes(bytes) {

  if (!bytes) return "0 KB";

  const units =
    ["B", "KB", "MB", "GB"];

  const index =
    Math.floor(
      Math.log(bytes)
      / Math.log(1024)
    );

  return (
    bytes
      / Math.pow(1024, index)
  ).toFixed(2)
  + " "
  + units[index];
}


/* =========================================================
   SETTINGS
========================================================= */

async function saveAppName() {

  const input =
    $("#settingAppName");

  if (!input) return;

  const name =
    input.value.trim();

  if (!name) {

    showToast(
      "Nama aplikasi tidak boleh kosong",
      "warning"
    );

    return;
  }

  state.settings.appName = name;

  await saveSettings();

  updateAppName();

  showToast(
    "Nama aplikasi berhasil diubah",
    "success"
  );
}


async function toggleDarkMode() {

  state.settings.darkMode =
    !state.settings.darkMode;

  await saveSettings();

  updateDarkMode();
}


async function toggleCommission() {

  state.settings.showCommission =
    !state.settings.showCommission;

  await saveSettings();

  updateCommissionVisibility();

  renderDashboard();

  showToast(
    state.settings.showCommission
      ? "Komisi ditampilkan"
      : "Komisi disembunyikan",
    "info"
  );
}


/* =========================================================
   CLEAR ALL DATA
========================================================= */

async function clearAllData() {

  const confirmation =
    prompt(
      "Ketik HAPUS untuk menghapus semua data:"
    );

  if (confirmation !== "HAPUS") {

    showToast(
      "Penghapusan dibatalkan",
      "info"
    );

    return;
  }

  await dbClear("employees");

  await dbClear("items");

  await dbClear("tiers");

  await dbClear("jobs");

  state.employees = [];

  state.items = [];

  state.tiers = [];

  state.jobs = [];

  await createDefaultData();

  renderAll();

  showToast(
    "Semua data berhasil dihapus",
    "success"
  );
}


/* =========================================================
   ONLINE STATUS
========================================================= */

function updateOnlineStatus() {

  const online =
    navigator.onLine;

  const text =
    $("#onlineStatusText");

  const status =
    $("#onlineStatus");

  if (text) {

    text.textContent =
      online
        ? "Online"
        : "Offline";
  }

  if (status) {

    status.classList.toggle(
      "offline",
      !online
    );
  }
}


/* =========================================================
   PWA INSTALL
========================================================= */

let deferredPrompt = null;

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

    showElement(
      $("#installButton")
    );
  }
);


async function installPWA() {

  if (!deferredPrompt) {

    showToast(
      "Gunakan menu browser untuk install aplikasi",
      "info"
    );

    return;
  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  hideElement(
    $("#installButton")
  );
}


/* =========================================================
   SERVICE WORKER
========================================================= */

function registerServiceWorker() {

  if (
    "serviceWorker"
    in navigator
  ) {

    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {

        console.log(
          "Service Worker aktif"
        );

      })
      .catch(error => {

        console.error(
          "Service Worker gagal:",
          error
        );

      });
  }
}


/* =========================================================
   HELPER DOM
========================================================= */

function setText(
  selector,
  value
) {

  const element =
    $(selector);

  if (element) {

    element.textContent = value;
  }
}


function setValue(
  selector,
  value
) {

  const element =
    $(selector);

  if (element) {

    element.value =
      value ?? "";
  }
}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

  updateAppName();

  updateDarkMode();

  updateCommissionVisibility();

  renderEmployeeOptions();

  renderItemOptions();

  renderTierOptions();

  renderEmployees();

  renderItems();

  renderTiers();

  renderJobs();

  renderDashboard();

  renderReports();

  updateDatabaseInfo();
}


/* =========================================================
   EVENT LISTENER
========================================================= */

function setupEventListeners() {

  /* NAVIGATION */

  $all(".nav-item").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        showPage(
          button.dataset.page
        );

      }
    );
  });


  /* SIDEBAR */

  $("#menuButton")
    ?.addEventListener(
      "click",
      openSidebar
    );

  $("#sidebarOverlay")
    ?.addEventListener(
      "click",
      closeSidebar
    );


  /* COMMISSION */

  $("#commissionSwitch")
    ?.addEventListener(
      "change",
      toggleCommission
    );


  /* DARK MODE */

  $("#darkModeToggle")
    ?.addEventListener(
      "change",
      toggleDarkMode
    );


  /* INSTALL */

  $("#installButton")
    ?.addEventListener(
      "click",
      installPWA
    );


  /* EMPLOYEE */

  $("#addEmployeeButton")
    ?.addEventListener(
      "click",
      openEmployeeModal
    );

  $("#employeeSaveButton")
    ?.addEventListener(
      "click",
      saveEmployee
    );

  $("#employeeCancelButton")
    ?.addEventListener(
      "click",
      closeEmployeeModal
    );


  /* ITEM */

  $("#addItemButton")
    ?.addEventListener(
      "click",
      openItemModal
    );

  $("#itemSaveButton")
    ?.addEventListener(
      "click",
      saveItem
    );

  $("#itemCancelButton")
    ?.addEventListener(
      "click",
      closeItemModal
    );


  /* TIER */

  $("#addTierButton")
    ?.addEventListener(
      "click",
      openTierModal
    );

  $("#tierSaveButton")
    ?.addEventListener(
      "click",
      saveTier
    );

  $("#tierCancelButton")
    ?.addEventListener(
      "click",
      closeTierModal
    );


  /* JOB */

  $("#jobSaveButton")
    ?.addEventListener(
      "click",
      saveJob
    );

  $("#jobResetButton")
    ?.addEventListener(
      "click",
      resetJobForm
    );


  /* WHATSAPP */

  $("#whatsappPreviewButton")
    ?.addEventListener(
      "click",
      previewWhatsApp
    );

  $("#whatsappImportButton")
    ?.addEventListener(
      "click",
      importWhatsApp
    );


  /* REPORT */

  $("#generateReportButton")
    ?.addEventListener(
      "click",
      generateReport
    );

  $("#thermalPrintButton")
    ?.addEventListener(
      "click",
      printThermal
    );

  $("#shareWhatsAppButton")
    ?.addEventListener(
      "click",
      shareReportWhatsApp
    );


  /* BACKUP */

  $("#backupButton")
    ?.addEventListener(
      "click",
      exportBackup
    );

  $("#restoreInput")
    ?.addEventListener(
      "change",
      event => {

        restoreBackup(
          event.target.files[0]
        );

      }
    );


  /* SETTINGS */

  $("#saveAppNameButton")
    ?.addEventListener(
      "click",
      saveAppName
    );

  $("#clearDataButton")
    ?.addEventListener(
      "click",
      clearAllData
    );


  /* ONLINE */

  window.addEventListener(
    "online",
    updateOnlineStatus
  );

  window.addEventListener(
    "offline",
    updateOnlineStatus
  );
}


/* =========================================================
   DATE DEFAULT
========================================================= */

function setupDefaultDates() {

  const today =
    todayISO();

  setValue(
    "#jobDate",
    today
  );

  setValue(
    "#whatsappDate",
    today
  );
}


/* =========================================================
   SPLASH
========================================================= */

function hideSplashScreen() {

  const splash =
    $("#splashScreen");

  if (!splash) return;

  setTimeout(() => {

    splash.classList.add("hide");

    setTimeout(() => {

      splash.remove();

    }, 500);

  }, 700);
}


/* =========================================================
   INIT APP
========================================================= */

async function initApp() {

  try {

    updateOnlineStatus();

    await openDatabase();

    await loadData();

    await createDefaultData();

    setupDefaultDates();

    setupEventListeners();

    renderAll();

    registerServiceWorker();

    hideSplashScreen();

    console.log(
      `Laundry Manager ${APP_VERSION} Ready`
    );

  } catch (error) {

    console.error(error);

    showToast(
      "Aplikasi gagal dimulai",
      "error"
    );
  }
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initApp
);
