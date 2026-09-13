/* =========================================================
LAUNDRY MANAGER PWA v3.0
FILE 3: script.js
Offline • IndexedDB • WhatsApp Parser • Reports
========================================================= */

"use strict";

/* =========================================================
CONFIG
========================================================= */

const APP_VERSION = "3.0";
const DB_NAME = "LaundryManagerDB";
const DB_VERSION = 1;

let db = null;

let state = {
settings: {
appName: "Laundry Manager",
commissionVisible: true,
currency: "Rp"
},

```
currentPage: "dashboard",

employees: [],
items: [],
categories: [],
tiers: [],
productions: [],

currentProductionRows: []
```

};

/* =========================================================
DATABASE
========================================================= */

const DB_STORES = [
"settings",
"employees",
"items",
"categories",
"tiers",
"productions"
];

async function initDatabase() {

```
return new Promise((resolve, reject) => {

    const request = indexedDB.open(
        DB_NAME,
        DB_VERSION
    );

    request.onupgradeneeded = event => {

        const database = event.target.result;

        DB_STORES.forEach(store => {

            if (!database.objectStoreNames.contains(store)) {

                database.createObjectStore(
                    store,
                    {
                        keyPath: "id"
                    }
                );

            }

        });

    };


    request.onsuccess = event => {

        db = event.target.result;

        console.log("IndexedDB Ready");

        resolve(db);

    };


    request.onerror = event => {

        console.error(
            "Database Error",
            event.target.error
        );

        reject(event.target.error);

    };

});
```

}

/* =========================================================
DATABASE FUNCTIONS
========================================================= */

function dbAdd(storeName, data) {

```
return new Promise((resolve, reject) => {

    const transaction = db.transaction(
        [storeName],
        "readwrite"
    );

    const store = transaction.objectStore(
        storeName
    );

    const request = store.put(data);

    request.onsuccess = () => resolve(data);

    request.onerror = () =>
        reject(request.error);

});
```

}

function dbGet(storeName, id) {

```
return new Promise((resolve, reject) => {

    const transaction = db.transaction(
        [storeName],
        "readonly"
    );

    const store = transaction.objectStore(
        storeName
    );

    const request = store.get(id);

    request.onsuccess = () =>
        resolve(request.result);

    request.onerror = () =>
        reject(request.error);

});
```

}

function dbGetAll(storeName) {

```
return new Promise((resolve, reject) => {

    const transaction = db.transaction(
        [storeName],
        "readonly"
    );

    const store = transaction.objectStore(
        storeName
    );

    const request = store.getAll();

    request.onsuccess = () =>
        resolve(request.result || []);

    request.onerror = () =>
        reject(request.error);

});
```

}

function dbDelete(storeName, id) {

```
return new Promise((resolve, reject) => {

    const transaction = db.transaction(
        [storeName],
        "readwrite"
    );

    const store = transaction.objectStore(
        storeName
    );

    const request = store.delete(id);

    request.onsuccess = () =>
        resolve(true);

    request.onerror = () =>
        reject(request.error);

});
```

}

function dbClear(storeName) {

```
return new Promise((resolve, reject) => {

    const transaction = db.transaction(
        [storeName],
        "readwrite"
    );

    const store = transaction.objectStore(
        storeName
    );

    const request = store.clear();

    request.onsuccess = () =>
        resolve(true);

    request.onerror = () =>
        reject(request.error);

});
```

}

/* =========================================================
UTILITIES
========================================================= */

function generateId(prefix = "id") {

```
return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
        .toString(36)
        .substring(2, 9)
);
```

}

function escapeHtml(value) {

```
return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}

function formatNumber(value) {

```
return new Intl.NumberFormat(
    "id-ID",
    {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }
).format(
    Number(value || 0)
);
```

}

function formatCurrency(value) {

```
return (
    state.settings.currency +
    " " +
    new Intl.NumberFormat(
        "id-ID",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(
        Number(value || 0)
    )
);
```

}

function parseNumber(value) {

```
if (
    value === null ||
    value === undefined
) {
    return 0;
}

let text = String(value)
    .trim()
    .replace(/\s/g, "");

/*
   Support:
   2,5
   2.5
   1.000
   1.000,5
*/

if (
    text.includes(",") &&
    text.includes(".")
) {

    text = text
        .replace(/\./g, "")
        .replace(",", ".");

} else if (
    text.includes(",")
) {

    text = text.replace(",", ".");

}

const number = Number(text);

return Number.isFinite(number)
    ? number
    : 0;
```

}

function getToday() {

```
const now = new Date();

const year = now.getFullYear();

const month = String(
    now.getMonth() + 1
).padStart(2, "0");

const day = String(
    now.getDate()
).padStart(2, "0");

return `${year}-${month}-${day}`;
```

}

function formatDate(dateValue) {

```
if (!dateValue) {
    return "-";
}

const date = new Date(
    dateValue + "T00:00:00"
);

return new Intl.DateTimeFormat(
    "id-ID",
    {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }
).format(date);
```

}

function formatDateTime(value) {

```
if (!value) {
    return "-";
}

return new Intl.DateTimeFormat(
    "id-ID",
    {
        dateStyle: "medium",
        timeStyle: "short"
    }
).format(
    new Date(value)
);
```

}

/* =========================================================
TOAST
========================================================= */

function showToast(
message,
type = "success"
) {

```
let container =
    document.getElementById(
        "toastContainer"
    );

if (!container) {

    container =
        document.querySelector(
            ".toast-container"
        );

}

if (!container) {

    console.log(
        `[${type}] ${message}`
    );

    return;

}

const icons = {
    success:
        "fa-circle-check",

    error:
        "fa-circle-xmark",

    warning:
        "fa-triangle-exclamation"
};


const toast =
    document.createElement("div");

toast.className =
    `toast ${type}`;

toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.success}"></i>
    <div class="toast-message">
        ${escapeHtml(message)}
    </div>
`;

container.appendChild(toast);

setTimeout(() => {

    toast.style.opacity = "0";

    toast.style.transform =
        "translateX(30px)";

    setTimeout(() => {

        toast.remove();

    }, 300);

}, 3500);
```

}

/* =========================================================
MODAL
========================================================= */

function openModal(modalId) {

```
const modal =
    document.getElementById(modalId);

if (!modal) {
    return;
}

modal.classList.add("active");

document.body.style.overflow =
    "hidden";

const firstInput =
    modal.querySelector(
        "input, select, textarea, button"
    );

if (firstInput) {

    setTimeout(() => {

        firstInput.focus();

    }, 150);

}
```

}

function closeModal(modalId) {

```
const modal =
    document.getElementById(modalId);

if (!modal) {
    return;
}

modal.classList.remove("active");

document.body.style.overflow = "";
```

}

function closeAllModals() {

```
document
    .querySelectorAll(".modal.active")
    .forEach(modal => {

        modal.classList.remove("active");

    });

document.body.style.overflow = "";
```

}

/* =========================================================
LOAD DATA
========================================================= */

async function loadAllData() {

```
state.employees =
    await dbGetAll("employees");

state.items =
    await dbGetAll("items");

state.categories =
    await dbGetAll("categories");

state.tiers =
    await dbGetAll("tiers");

state.productions =
    await dbGetAll("productions");

const settings =
    await dbGet(
        "settings",
        "app_settings"
    );

if (settings) {

    state.settings = {
        ...state.settings,
        ...settings
    };

}
```

}

/* =========================================================
DEFAULT DATA
========================================================= */

async function createDefaultData() {

```
if (
    state.categories.length === 0
) {

    const defaults = [
        {
            id: generateId("cat"),
            name: "Laundry"
        },
        {
            id: generateId("cat"),
            name: "Sepatu"
        },
        {
            id: generateId("cat"),
            name: "Tas"
        }
    ];

    for (
        const category of defaults
    ) {

        await dbAdd(
            "categories",
            category
        );

    }

}


if (
    state.tiers.length === 0
) {

    const defaults = [
        {
            id: generateId("tier"),
            name: "Standar"
        },
        {
            id: generateId("tier"),
            name: "Premium"
        }
    ];

    for (
        const tier of defaults
    ) {

        await dbAdd(
            "tiers",
            tier
        );

    }

}


if (
    !await dbGet(
        "settings",
        "app_settings"
    )
) {

    await dbAdd(
        "settings",
        {
            id: "app_settings",
            ...state.settings
        }
    );

}
```

}

/* =========================================================
SAVE SETTINGS
========================================================= */

async function saveSettings() {

```
await dbAdd(
    "settings",
    {
        id: "app_settings",
        ...state.settings
    }
);
```

}

/* =========================================================
APPLY SETTINGS
========================================================= */

function applySettings() {

```
document
    .querySelectorAll(
        "[data-app-name]"
    )
    .forEach(element => {

        element.textContent =
            state.settings.appName;

    });


const appNameInput =
    document.getElementById(
        "settingAppName"
    );

if (appNameInput) {

    appNameInput.value =
        state.settings.appName;

}


const commissionSwitch =
    document.getElementById(
        "commissionSwitch"
    );

if (commissionSwitch) {

    commissionSwitch.checked =
        state.settings.commissionVisible;

}


if (
    state.settings.commissionVisible
) {

    document.body.classList.remove(
        "hide-commission"
    );

} else {

    document.body.classList.add(
        "hide-commission"
    );

}


document.title =
    state.settings.appName;
```

}

/* =========================================================
NAVIGATION
========================================================= */

function initNavigation() {

```
document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                if (page) {

                    showPage(page);

                }

            }
        );

    });
```

}

function showPage(pageName) {

```
document
    .querySelectorAll(".page")
    .forEach(page => {

        page.classList.remove("active");

    });


const page =
    document.getElementById(
        `page-${pageName}`
    );

if (page) {

    page.classList.add("active");

}


document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );

    });


state.currentPage = pageName;


const title =
    document.querySelector(
        "#pageTitle"
    );

if (title) {

    const labels = {

        dashboard:
            "Dashboard",

        production:
            "Input Produksi",

        whatsapp:
            "Import WhatsApp",

        employees:
            "Karyawan",

        items:
            "Item",

        categories:
            "Kategori",

        tiers:
            "Tier",

        reports:
            "Laporan",

        backup:
            "Backup & Restore",

        settings:
            "Pengaturan"

    };

    title.textContent =
        labels[pageName] ||
        pageName;

}


closeMobileSidebar();

renderCurrentPage();
```

}

/* =========================================================
RENDER CURRENT PAGE
========================================================= */

function renderCurrentPage() {

```
switch (
    state.currentPage
) {

    case "dashboard":
        renderDashboard();
        break;

    case "production":
        renderProductionForm();
        break;

    case "whatsapp":
        renderWhatsAppResult();
        break;

    case "employees":
        renderEmployees();
        break;

    case "items":
        renderItems();
        break;

    case "categories":
        renderCategories();
        break;

    case "tiers":
        renderTiers();
        break;

    case "reports":
        renderReports();
        break;

    case "backup":
        renderBackupInfo();
        break;

    case "settings":
        applySettings();
        break;

}
```

}

/* =========================================================
SIDEBAR
========================================================= */

function openMobileSidebar() {

```
const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.querySelector(
        ".sidebar-overlay"
    );

if (sidebar) {

    sidebar.classList.add("open");

}

if (overlay) {

    overlay.classList.add("active");

}
```

}

function closeMobileSidebar() {

```
const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.querySelector(
        ".sidebar-overlay"
    );

if (sidebar) {

    sidebar.classList.remove("open");

}

if (overlay) {

    overlay.classList.remove("active");

}
```

}

/* =========================================================
EMPLOYEE FUNCTIONS
========================================================= */

function getEmployee(id) {

```
return state.employees.find(
    employee =>
        employee.id === id
);
```

}

function renderEmployeeOptions(
selectedId = ""
) {

```
return `
    <option value="">
        Pilih Karyawan
    </option>

    ${state.employees.map(
        employee => `
            <option
                value="${employee.id}"
                ${
                    employee.id === selectedId
                        ? "selected"
                        : ""
                }
            >
                ${escapeHtml(employee.name)}
            </option>
        `
    ).join("")}
`;
```

}

function renderEmployees() {

```
const container =
    document.getElementById(
        "employeeList"
    );

if (!container) {
    return;
}


if (
    state.employees.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-users"></i>

            <h4>
                Belum ada karyawan
            </h4>

            <p>
                Tambahkan karyawan terlebih dahulu
            </p>
        </div>
    `;

    return;

}


container.innerHTML =
    state.employees
        .map(employee => {

            const initial =
                employee.name
                    .charAt(0)
                    .toUpperCase();

            return `
                <div class="employee-card">

                    <div class="employee-card-top">

                        <div class="employee-card-avatar">
                            ${initial}
                        </div>

                        <div>

                            <div class="employee-card-name">
                                ${escapeHtml(employee.name)}
                            </div>

                            <div class="employee-card-code">
                                ${escapeHtml(
                                    employee.code ||
                                    "-"
                                )}
                            </div>

                        </div>

                    </div>

                    <div class="employee-card-footer">

                        <span>
                            Aktif
                        </span>

                        <div>

                            <button
                                class="icon-button"
                                onclick="editEmployee('${employee.id}')"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                                class="icon-button"
                                onclick="deleteEmployee('${employee.id}')"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>

                    </div>

                </div>
            `;

        })
        .join("");
```

}

function openEmployeeModal(
employeeId = null
) {

```
const modal =
    document.getElementById(
        "employeeModal"
    );

if (!modal) {

    showToast(
        "Modal karyawan belum tersedia di index.html",
        "warning"
    );

    return;

}


const employee =
    employeeId
        ? getEmployee(employeeId)
        : null;


document.getElementById(
    "employeeId"
).value =
    employee?.id || "";


document.getElementById(
    "employeeName"
).value =
    employee?.name || "";


document.getElementById(
    "employeeCode"
).value =
    employee?.code || "";


openModal(
    "employeeModal"
);
```

}

async function saveEmployee() {

```
const id =
    document.getElementById(
        "employeeId"
    ).value ||
    generateId("emp");


const name =
    document.getElementById(
        "employeeName"
    ).value
    .trim();


const code =
    document.getElementById(
        "employeeCode"
    ).value
    .trim()
    .toLowerCase();


if (!name) {

    showToast(
        "Nama karyawan wajib diisi",
        "warning"
    );

    return;

}


const employee = {

    id,

    name,

    code,

    createdAt:
        new Date().toISOString()

};


await dbAdd(
    "employees",
    employee
);


await loadAllData();

renderEmployees();

renderProductionForm();

closeModal(
    "employeeModal"
);

showToast(
    "Karyawan berhasil disimpan"
);
```

}

async function deleteEmployee(id) {

```
if (
    !confirm(
        "Hapus karyawan ini?"
    )
) {
    return;
}


await dbDelete(
    "employees",
    id
);

await loadAllData();

renderEmployees();

showToast(
    "Karyawan berhasil dihapus"
);
```

}

function editEmployee(id) {

```
openEmployeeModal(id);
```

}

/* =========================================================
CATEGORY FUNCTIONS
========================================================= */

function getCategory(id) {

```
return state.categories.find(
    category =>
        category.id === id
);
```

}

function renderCategoryOptions(
selectedId = ""
) {

```
return `
    <option value="">
        Pilih Kategori
    </option>

    ${state.categories.map(
        category => `
            <option
                value="${category.id}"
                ${
                    category.id === selectedId
                        ? "selected"
                        : ""
                }
            >
                ${escapeHtml(category.name)}
            </option>
        `
    ).join("")}
`;
```

}

function renderCategories() {

```
const container =
    document.getElementById(
        "categoryList"
    );

if (!container) {
    return;
}


if (
    state.categories.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">

            <i class="fa-solid fa-folder"></i>

            <h4>
                Belum ada kategori
            </h4>

        </div>
    `;

    return;

}


container.innerHTML =
    state.categories
        .map(category => `

            <div class="category-item">

                <div class="category-left">

                    <div class="category-icon">
                        <i class="fa-solid fa-folder"></i>
                    </div>

                    <strong>
                        ${escapeHtml(category.name)}
                    </strong>

                </div>

                <div>

                    <button
                        class="icon-button"
                        onclick="deleteCategory('${category.id}')"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

        `)
        .join("");
```

}

async function addCategory() {

```
const input =
    document.getElementById(
        "newCategory"
    );

if (!input) {
    return;
}


const name =
    input.value.trim();

if (!name) {

    showToast(
        "Nama kategori wajib diisi",
        "warning"
    );

    return;

}


await dbAdd(
    "categories",
    {
        id:
            generateId("cat"),

        name
    }
);


input.value = "";

await loadAllData();

renderCategories();

renderProductionForm();

showToast(
    "Kategori berhasil ditambahkan"
);
```

}

async function deleteCategory(id) {

```
if (
    !confirm(
        "Hapus kategori?"
    )
) {
    return;
}


await dbDelete(
    "categories",
    id
);

await loadAllData();

renderCategories();

renderProductionForm();

showToast(
    "Kategori dihapus"
);
```

}

/* =========================================================
TIER FUNCTIONS
========================================================= */

function getTier(id) {

```
return state.tiers.find(
    tier =>
        tier.id === id
);
```

}

function renderTierOptions(
selectedId = ""
) {

```
return `
    <option value="">
        Pilih Tier
    </option>

    ${state.tiers.map(
        tier => `
            <option
                value="${tier.id}"
                ${
                    tier.id === selectedId
                        ? "selected"
                        : ""
                }
            >
                ${escapeHtml(tier.name)}
            </option>
        `
    ).join("")}
`;
```

}

function renderTiers() {

```
const container =
    document.getElementById(
        "tierList"
    );

if (!container) {
    return;
}


if (
    state.tiers.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">

            <i class="fa-solid fa-layer-group"></i>

            <h4>
                Belum ada Tier
            </h4>

        </div>
    `;

    return;

}


container.innerHTML =
    state.tiers
        .map(tier => `

            <div class="tier-item">

                <strong>
                    ${escapeHtml(tier.name)}
                </strong>

                <button
                    class="icon-button"
                    onclick="deleteTier('${tier.id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `)
        .join("");
```

}

async function addTier() {

```
const input =
    document.getElementById(
        "newTier"
    );

if (!input) {
    return;
}


const name =
    input.value.trim();

if (!name) {

    showToast(
        "Nama Tier wajib diisi",
        "warning"
    );

    return;

}


await dbAdd(
    "tiers",
    {
        id:
            generateId("tier"),

        name
    }
);


input.value = "";

await loadAllData();

renderTiers();

renderProductionForm();

showToast(
    "Tier berhasil ditambahkan"
);
```

}

async function deleteTier(id) {

```
if (
    !confirm(
        "Hapus Tier?"
    )
) {
    return;
}


await dbDelete(
    "tiers",
    id
);

await loadAllData();

renderTiers();

renderProductionForm();

showToast(
    "Tier berhasil dihapus"
);
```

}

/* =========================================================
ITEM FUNCTIONS
========================================================= */

function getItem(id) {

```
return state.items.find(
    item =>
        item.id === id
);
```

}

function normalizeAlias(value) {

```
return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
```

}

function getItemByCode(code) {

```
const search =
    normalizeAlias(code);

return state.items.find(item => {

    const aliases =
        Array.isArray(item.aliases)
            ? item.aliases
            : [];

    const allCodes = [

        item.code,

        ...aliases

    ]
        .map(normalizeAlias)
        .filter(Boolean);

    return allCodes.includes(search);

});
```

}

function renderItemOptions(
selectedId = ""
) {

```
return `
    <option value="">
        Pilih Item
    </option>

    ${state.items.map(
        item => `

            <option
                value="${item.id}"
                ${
                    item.id === selectedId
                        ? "selected"
                        : ""
                }
            >

                ${escapeHtml(item.name)}
                (${escapeHtml(item.unit || "-")})

            </option>

        `
    ).join("")}
`;
```

}

function renderItems() {

```
const container =
    document.getElementById(
        "itemList"
    );

if (!container) {
    return;
}


if (
    state.items.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">

            <i class="fa-solid fa-box"></i>

            <h4>
                Belum ada item
            </h4>

            <p>
                Tambahkan item dan kode WhatsApp
            </p>

        </div>
    `;

    return;

}


container.innerHTML =
    state.items
        .map(item => {

            const category =
                getCategory(
                    item.categoryId
                );

            const tier =
                getTier(
                    item.tierId
                );

            const aliases =
                [
                    item.code,
                    ...(
                        item.aliases || []
                    )
                ]
                .filter(Boolean)
                .join(", ");

            return `

                <div class="item-card">

                    <div class="item-card-header">

                        <div>

                            <div class="item-card-name">
                                ${escapeHtml(item.name)}
                            </div>

                            <div class="item-code">
                                ${escapeHtml(aliases)}
                            </div>

                        </div>

                        <button
                            class="icon-button"
                            onclick="editItem('${item.id}')"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                    </div>


                    <div class="item-category">

                        ${escapeHtml(
                            category?.name ||
                            "Tanpa Kategori"
                        )}

                        ${tier
                            ? " • " +
                              escapeHtml(
                                  tier.name
                              )
                            : ""
                        }

                    </div>


                    <div class="item-card-footer">

                        <span>

                            <i class="fa-solid fa-scale-balanced"></i>

                            ${escapeHtml(
                                item.unit
                            )}

                        </span>


                        <button
                            class="icon-button"
                            onclick="deleteItem('${item.id}')"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            `;

        })
        .join("");
```

}

function openItemModal(
itemId = null
) {

```
const modal =
    document.getElementById(
        "itemModal"
    );

if (!modal) {

    showToast(
        "Modal item belum tersedia di index.html",
        "warning"
    );

    return;

}


const item =
    itemId
        ? getItem(itemId)
        : null;


document.getElementById(
    "itemId"
).value =
    item?.id || "";


document.getElementById(
    "itemName"
).value =
    item?.name || "";


document.getElementById(
    "itemCode"
).value =
    [
        item?.code,
        ...(
            item?.aliases || []
        )
    ]
    .filter(Boolean)
    .join(", ");


const categorySelect =
    document.getElementById(
        "itemCategory"
    );

if (categorySelect) {

    categorySelect.innerHTML =
        renderCategoryOptions(
            item?.categoryId || ""
        );

}


const tierSelect =
    document.getElementById(
        "itemTier"
    );

if (tierSelect) {

    tierSelect.innerHTML =
        renderTierOptions(
            item?.tierId || ""
        );

}


document.getElementById(
    "itemUnit"
).value =
    item?.unit || "kg";


renderCommissionInputs(item);

openModal(
    "itemModal"
);
```

}

function renderCommissionInputs(
item = null
) {

```
const container =
    document.getElementById(
        "itemCommissionInputs"
    );

if (!container) {
    return;
}


if (
    state.employees.length === 0
) {

    container.innerHTML = `
        <div class="info-box">

            <i class="fa-solid fa-circle-info"></i>

            <div>

                <strong>
                    Belum ada karyawan
                </strong>

                <p>
                    Tambahkan karyawan terlebih dahulu.
                </p>

            </div>

        </div>
    `;

    return;

}


const commissions =
    item?.commissions || {};


container.innerHTML = `

    <div class="card-header">

        <h3>
            <i class="fa-solid fa-money-bill-wave"></i>

            Komisi Per Karyawan
        </h3>

    </div>

    <div class="commission-input-grid">

        ${state.employees.map(
            employee => `

                <div class="form-group">

                    <label>

                        ${escapeHtml(employee.name)}

                    </label>

                    <input
                        type="text"
                        inputmode="decimal"
                        class="form-control employee-commission"
                        data-employee-id="${employee.id}"
                        value="${
                            commissions[employee.id] ||
                            0
                        }"
                        placeholder="0"
                    >

                </div>

            `
        ).join("")}

    </div>

`;
```

}

async function saveItem() {

```
const id =
    document.getElementById(
        "itemId"
    ).value ||
    generateId("item");


const name =
    document.getElementById(
        "itemName"
    ).value
    .trim();


const codeText =
    document.getElementById(
        "itemCode"
    ).value
    .trim();


const categoryId =
    document.getElementById(
        "itemCategory"
    ).value;


const tierId =
    document.getElementById(
        "itemTier"
    ).value;


const unit =
    document.getElementById(
        "itemUnit"
    ).value;


if (!name) {

    showToast(
        "Nama item wajib diisi",
        "warning"
    );

    return;

}


const aliases =
    codeText
        .split(",")
        .map(code =>
            normalizeAlias(code)
        )
        .filter(Boolean);


if (
    aliases.length === 0
) {

    showToast(
        "Minimal satu kode item wajib diisi",
        "warning"
    );

    return;

}


const duplicateAlias =
    aliases.find(alias => {

        return state.items.some(item => {

            if (
                item.id === id
            ) {
                return false;
            }

            const itemAliases = [

                item.code,

                ...(
                    item.aliases || []
                )

            ]
                .map(normalizeAlias);

            return itemAliases.includes(alias);

        });

    });


if (duplicateAlias) {

    showToast(
        `Kode "${duplicateAlias}" sudah digunakan`,
        "warning"
    );

    return;

}


const commissions = {};

document
    .querySelectorAll(
        ".employee-commission"
    )
    .forEach(input => {

        commissions[
            input.dataset.employeeId
        ] =
            parseNumber(
                input.value
            );

    });


const item = {

    id,

    name,

    code:
        aliases[0],

    aliases:
        aliases.slice(1),

    categoryId,

    tierId,

    unit,

    commissions,

    createdAt:
        new Date().toISOString()

};


await dbAdd(
    "items",
    item
);


await loadAllData();

renderItems();

renderProductionForm();

closeModal(
    "itemModal"
);

showToast(
    "Item berhasil disimpan"
);
```

}

function editItem(id) {

```
openItemModal(id);
```

}

async function deleteItem(id) {

```
if (
    !confirm(
        "Hapus item ini?"
    )
) {
    return;
}


await dbDelete(
    "items",
    id
);

await loadAllData();

renderItems();

renderProductionForm();

showToast(
    "Item berhasil dihapus"
);
```

}

/* =========================================================
PRODUCTION ROW
========================================================= */

function createProductionRow(
data = {}
) {

```
return {

    id:
        data.id ||
        generateId("row"),

    employeeId:
        data.employeeId || "",

    itemId:
        data.itemId || "",

    quantity:
        data.quantity || 0,

    customer:
        data.customer || "",

    commission:
        data.commission || 0

};
```

}

function renderProductionForm() {

```
const employeeSelect =
    document.getElementById(
        "productionEmployee"
    );

if (employeeSelect) {

    const selected =
        employeeSelect.value;

    employeeSelect.innerHTML =
        renderEmployeeOptions(selected);

}


const dateInput =
    document.getElementById(
        "productionDate"
    );

if (
    dateInput &&
    !dateInput.value
) {

    dateInput.value =
        getToday();

}


const rowsContainer =
    document.getElementById(
        "productionRows"
    );

if (!rowsContainer) {
    return;
}


if (
    state.currentProductionRows.length === 0
) {

    state.currentProductionRows.push(
        createProductionRow()
    );

}


rowsContainer.innerHTML =
    state.currentProductionRows
        .map(
            (
                row,
                index
            ) =>
                renderProductionRow(
                    row,
                    index
                )
        )
        .join("");


updateProductionTotals();
```

}

function renderProductionRow(
row,
index
) {

```
const item =
    getItem(row.itemId);

const commission =
    getCommission(
        row.employeeId,
        row.itemId
    );


return `

    <div
        class="production-row"
        data-row-id="${row.id}"
    >

        <div class="row-number">
            ${index + 1}
        </div>


        <div class="form-group item-group">

            <label>
                Item
            </label>

            <select
                class="form-control"
                onchange="updateProductionRowItem('${row.id}', this.value)"
            >

                ${renderItemOptions(
                    row.itemId
                )}

            </select>

        </div>


        <div class="form-group">

            <label>
                Jumlah
                ${
                    item
                        ? `(${escapeHtml(item.unit)})`
                        : ""
                }
            </label>

            <input
                type="text"
                inputmode="decimal"
                class="form-control"
                value="${row.quantity || ""}"
                placeholder="0"
                onchange="updateProductionRowQuantity('${row.id}', this.value)"
            >

        </div>


        <div class="form-group">

            <label>
                Customer / Referensi
            </label>

            <input
                type="text"
                class="form-control"
                value="${escapeHtml(row.customer)}"
                placeholder="Opsional"
                onchange="updateProductionRowCustomer('${row.id}', this.value)"
            >

        </div>


        <div
            class="commission-value commission-preview"
        >

            ${formatCurrency(
                commission * Number(row.quantity || 0)
            )}

        </div>


        <button
            type="button"
            class="delete-row"
            onclick="removeProductionRow('${row.id}')"
            title="Hapus baris"
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    </div>

`;
```

}

function getCommission(
employeeId,
itemId
) {

```
const item =
    getItem(itemId);

if (!item) {
    return 0;
}

return Number(
    item.commissions?.[
        employeeId
    ] || 0
);
```

}

function updateProductionRowItem(
rowId,
itemId
) {

```
const row =
    state.currentProductionRows.find(
        row =>
            row.id === rowId
    );

if (!row) {
    return;
}

row.itemId = itemId;

renderProductionForm();
```

}

function updateProductionRowQuantity(
rowId,
quantity
) {

```
const row =
    state.currentProductionRows.find(
        row =>
            row.id === rowId
    );

if (!row) {
    return;
}

row.quantity =
    parseNumber(quantity);

updateProductionTotals();

renderProductionForm();
```

}

function updateProductionRowCustomer(
rowId,
customer
) {

```
const row =
    state.currentProductionRows.find(
        row =>
            row.id === rowId
    );

if (!row) {
    return;
}

row.customer =
    customer.trim();
```

}

function addProductionRow() {

```
state.currentProductionRows.push(
    createProductionRow()
);

renderProductionForm();
```

}

function removeProductionRow(rowId) {

```
if (
    state.currentProductionRows.length <= 1
) {

    showToast(
        "Minimal harus ada satu baris",
        "warning"
    );

    return;

}


state.currentProductionRows =
    state.currentProductionRows.filter(
        row =>
            row.id !== rowId
    );

renderProductionForm();
```

}

function updateProductionTotals() {

```
let totalQty = 0;

let totalCommission = 0;


const employeeSelect =
    document.getElementById(
        "productionEmployee"
    );

const employeeId =
    employeeSelect
        ? employeeSelect.value
        : "";


state.currentProductionRows
    .forEach(row => {

        const quantity =
            Number(
                row.quantity || 0
            );

        const commission =
            getCommission(
                employeeId,
                row.itemId
            );

        totalQty += quantity;

        totalCommission +=
            commission *
            quantity;

    });


const qtyElement =
    document.getElementById(
        "productionTotalQty"
    );

if (qtyElement) {

    qtyElement.textContent =
        formatNumber(totalQty);

}


const commissionElement =
    document.getElementById(
        "productionTotalCommission"
    );

if (commissionElement) {

    commissionElement.textContent =
        formatCurrency(
            totalCommission
        );

}
```

}

/* =========================================================
PRODUCTION EMPLOYEE CHANGE
========================================================= */

function onProductionEmployeeChange() {

```
renderProductionForm();
```

}

/* =========================================================
SAVE PRODUCTION
========================================================= */

async function saveProduction() {

```
const employeeId =
    document.getElementById(
        "productionEmployee"
    )?.value;


const date =
    document.getElementById(
        "productionDate"
    )?.value ||
    getToday();


if (!employeeId) {

    showToast(
        "Pilih karyawan terlebih dahulu",
        "warning"
    );

    return;

}


const validRows =
    state.currentProductionRows
        .filter(row =>
            row.itemId &&
            Number(row.quantity) > 0
        );


if (
    validRows.length === 0
) {

    showToast(
        "Masukkan minimal satu item",
        "warning"
    );

    return;

}


const rows =
    validRows.map(row => {

        const item =
            getItem(row.itemId);

        const commission =
            getCommission(
                employeeId,
                row.itemId
            );

        return {

            id:
                generateId("detail"),

            itemId:
                row.itemId,

            itemName:
                item?.name || "-",

            itemCode:
                item?.code || "",

            unit:
                item?.unit || "",

            quantity:
                Number(row.quantity),

            customer:
                row.customer || "",

            commissionPerUnit:
                commission,

            totalCommission:
                commission *
                Number(row.quantity)

        };

    });


const totalCommission =
    rows.reduce(
        (
            total,
            row
        ) =>
            total +
            row.totalCommission,
        0
    );


const employee =
    getEmployee(employeeId);


const production = {

    id:
        generateId("prod"),

    date,

    employeeId,

    employeeName:
        employee?.name || "-",

    rows,

    totalCommission,

    createdAt:
        new Date().toISOString()

};


await dbAdd(
    "productions",
    production
);


state.currentProductionRows = [
    createProductionRow()
];


await loadAllData();

renderProductionForm();

renderDashboard();

showToast(
    "Produksi berhasil disimpan"
);
```

}

/* =========================================================
WHATSAPP PARSER
========================================================= */

/*
Contoh:

desi cks 5kg
wanto cks 5
yadi sepatu 2
budi spt 2
*/

function parseWhatsAppLine(line) {

```
const original =
    line.trim();

if (!original) {
    return null;
}


const parts =
    original.split(/\s+/);

if (
    parts.length < 3
) {
    return null;
}


const quantityMatch =
    original.match(
        /(\d+(?:[.,]\d+)?)\s*(kg|kilo|pcs|pc|buah|pasang|unit)?\s*$/i
    );


if (!quantityMatch) {
    return null;
}


const quantity =
    parseNumber(
        quantityMatch[1]
    );


const inputUnit =
    (
        quantityMatch[2] ||
        ""
    )
    .toLowerCase();


const beforeQuantity =
    original
        .substring(
            0,
            quantityMatch.index
        )
        .trim()
        .split(/\s+/);


if (
    beforeQuantity.length < 2
) {
    return null;
}


/*
   Format:
   CUSTOMER ITEM QTY

   Jika nama customer lebih dari satu kata:
   tetap mencoba item dari belakang.
*/

let foundItem = null;

let foundCode = "";

let itemStartIndex = -1;


for (
    let i =
        beforeQuantity.length - 1;

    i >= 1;

    i--
) {

    const code =
        beforeQuantity[i];

    const item =
        getItemByCode(code);

    if (item) {

        foundItem = item;

        foundCode = code;

        itemStartIndex = i;

        break;

    }

}


if (!foundItem) {

    return {

        success: false,

        original,

        reason:
            "Kode item tidak ditemukan"

    };

}


const customer =
    beforeQuantity
        .slice(
            0,
            itemStartIndex
        )
        .join(" ");


if (!customer) {

    return {

        success: false,

        original,

        reason:
            "Nama customer tidak ditemukan"

    };

}


if (
    inputUnit &&
    foundItem.unit
) {

    const normalizedInputUnit =
        normalizeUnit(inputUnit);

    const normalizedItemUnit =
        normalizeUnit(
            foundItem.unit
        );

    if (
        normalizedInputUnit !==
        normalizedItemUnit
    ) {

        /*
           Tidak menggagalkan parsing.
           Unit input hanya informasi.
        */

    }

}


return {

    success: true,

    original,

    customer,

    itemId:
        foundItem.id,

    itemName:
        foundItem.name,

    itemCode:
        foundCode,

    quantity,

    unit:
        foundItem.unit

};
```

}

function normalizeUnit(unit) {

```
const map = {

    kg:
        "kg",

    kilo:
        "kg",

    pcs:
        "pcs",

    pc:
        "pcs",

    buah:
        "pcs",

    pasang:
        "pcs",

    unit:
        "pcs"

};

return (
    map[
        String(unit)
            .toLowerCase()
    ] ||
    String(unit)
        .toLowerCase()
);
```

}

function parseWhatsAppText() {

```
const textarea =
    document.getElementById(
        "whatsappInput"
    );

if (!textarea) {
    return;
}


const lines =
    textarea.value
        .split("\n")
        .map(line =>
            line.trim()
        )
        .filter(Boolean);


const results =
    lines.map(
        parseWhatsAppLine
    );


window.whatsappResults =
    results;


renderWhatsAppResult();
```

}

function renderWhatsAppResult() {

```
const container =
    document.getElementById(
        "whatsappResult"
    );

if (!container) {
    return;
}


const results =
    window.whatsappResults || [];


if (
    results.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">

            <i class="fa-brands fa-whatsapp"></i>

            <h4>
                Belum ada data
            </h4>

            <p>
                Paste chat WhatsApp kemudian klik Analisa
            </p>

        </div>
    `;

    return;

}


container.innerHTML =
    results
        .map(result => {

            if (
                !result.success
            ) {

                return `

                    <div class="wa-result-item">

                        <div class="wa-result-main">

                            <div class="wa-result-customer">
                                Gagal Dibaca
                            </div>

                            <div class="wa-result-itemname">
                                ${escapeHtml(result.original)}
                                <br>
                                ${escapeHtml(result.reason)}
                            </div>

                        </div>

                    </div>

                `;

            }


            return `

                <div class="wa-result-item">

                    <div class="wa-result-main">

                        <div class="wa-result-customer">

                            ${escapeHtml(
                                result.customer
                            )}

                        </div>

                        <div class="wa-result-itemname">

                            ${escapeHtml(
                                result.itemName
                            )}

                        </div>

                    </div>

                    <div class="wa-result-qty">

                        ${formatNumber(
                            result.quantity
                        )}

                        ${escapeHtml(
                            result.unit
                        )}

                    </div>

                </div>

            `;

        })
        .join("");
```

}

function sendWhatsAppToProduction() {

```
const results =
    (
        window.whatsappResults ||
        []
    )
    .filter(
        result =>
            result.success
    );


if (
    results.length === 0
) {

    showToast(
        "Tidak ada data valid",
        "warning"
    );

    return;

}


state.currentProductionRows =
    results.map(result =>
        createProductionRow(
            {
                itemId:
                    result.itemId,

                quantity:
                    result.quantity,

                customer:
                    result.customer
            }
        )
    );


showPage(
    "production"
);


showToast(
    "Data WhatsApp masuk ke Input Produksi"
);
```

}

/* =========================================================
DASHBOARD
========================================================= */

function getProductionsByDate(
date
) {

```
return state.productions.filter(
    production =>
        production.date === date
);
```

}

function renderDashboard() {

```
const today =
    getToday();

const todayProductions =
    getProductionsByDate(today);


const totalRows =
    todayProductions.reduce(
        (
            total,
            production
        ) =>
            total +
            production.rows.length,
        0
    );


const totalCommission =
    todayProductions.reduce(
        (
            total,
            production
        ) =>
            total +
            Number(
                production.totalCommission || 0
            ),
        0
    );


setText(
    "statTodayJobs",
    totalRows
);

setText(
    "statTodayCommission",
    formatCurrency(
        totalCommission
    )
);

setText(
    "statEmployees",
    state.employees.length
);

setText(
    "statItems",
    state.items.length
);


renderEmployeeSummary();
```

}

function renderEmployeeSummary() {

```
const container =
    document.getElementById(
        "employeeSummary"
    );

if (!container) {
    return;
}


const today =
    getToday();


const productions =
    getProductionsByDate(today);


if (
    productions.length === 0
) {

    container.innerHTML = `
        <div class="empty-state small">

            <i class="fa-solid fa-chart-column"></i>

            <p>
                Belum ada produksi hari ini
            </p>

        </div>
    `;

    return;

}


const map = {};


productions.forEach(
    production => {

        if (
            !map[
                production.employeeId
            ]
        ) {

            map[
                production.employeeId
            ] = {

                name:
                    production.employeeName,

                qty:
                    0,

                commission:
                    0

            };

        }


        production.rows.forEach(
            row => {

                map[
                    production.employeeId
                ].qty +=
                    Number(
                        row.quantity || 0
                    );

            }
        );


        map[
            production.employeeId
        ].commission +=
            Number(
                production.totalCommission || 0
            );

    }
);


container.innerHTML =
    Object.values(map)
        .map(employee => `

            <div class="employee-summary-item">

                <div class="employee-summary-left">

                    <div class="employee-avatar">

                        ${escapeHtml(
                            employee.name
                                .charAt(0)
                                .toUpperCase()
                        )}

                    </div>

                    <div>

                        <div class="employee-summary-name">

                            ${escapeHtml(
                                employee.name
                            )}

                        </div>

                        <div class="employee-summary-detail">

                            ${formatNumber(
                                employee.qty
                            )}
                            item/kg

                        </div>

                    </div>

                </div>

                <strong class="commission-preview">

                    ${formatCurrency(
                        employee.commission
                    )}

                </strong>

            </div>

        `)
        .join("");
```

}

/* =========================================================
REPORT
========================================================= */

function getReportRange() {

```
const start =
    document.getElementById(
        "reportStartDate"
    )?.value;

const end =
    document.getElementById(
        "reportEndDate"
    )?.value;

const employeeId =
    document.getElementById(
        "reportEmployee"
    )?.value;


let productions =
    [...state.productions];


if (start) {

    productions =
        productions.filter(
            production =>
                production.date >= start
        );

}


if (end) {

    productions =
        productions.filter(
            production =>
                production.date <= end
        );

}


if (employeeId) {

    productions =
        productions.filter(
            production =>
                production.employeeId === employeeId
        );

}


return productions;
```

}

function renderReports() {

```
const container =
    document.getElementById(
        "reportContent"
    );

if (!container) {
    return;
}


const employeeSelect =
    document.getElementById(
        "reportEmployee"
    );

if (employeeSelect) {

    const selected =
        employeeSelect.value;

    employeeSelect.innerHTML =
        `
            <option value="">
                Semua Karyawan
            </option>
        ` +
        state.employees
            .map(
                employee => `

                    <option
                        value="${employee.id}"
                        ${
                            employee.id === selected
                                ? "selected"
                                : ""
                        }
                    >

                        ${escapeHtml(
                            employee.name
                        )}

                    </option>

                `
            )
            .join("");

}


const productions =
    getReportRange();


if (
    productions.length === 0
) {

    container.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-file-lines"></i>

            <h4>
                Belum ada laporan
            </h4>

            <p>
                Pilih periode laporan
            </p>

        </div>

    `;

    return;

}


let totalQty = 0;

let totalCommission = 0;


productions.forEach(
    production => {

        production.rows.forEach(
            row => {

                totalQty +=
                    Number(
                        row.quantity || 0
                    );

            }
        );

        totalCommission +=
            Number(
                production.totalCommission || 0
            );

    }
);


container.innerHTML = `

    <div class="report-summary-grid">

        <div class="report-summary-item">

            <span>
                Total Input
            </span>

            <strong>
                ${productions.length}
            </strong>

        </div>

        <div class="report-summary-item">

            <span>
                Total Quantity
            </span>

            <strong>
                ${formatNumber(totalQty)}
            </strong>

        </div>

        <div
            class="report-summary-item commission-preview"
        >

            <span>
                Total Komisi
            </span>

            <strong>
                ${formatCurrency(
                    totalCommission
                )}
            </strong>

        </div>

        <div class="report-summary-item">

            <span>
                Karyawan
            </span>

            <strong>
                ${
                    new Set(
                        productions.map(
                            production =>
                                production.employeeId
                        )
                    ).size
                }
            </strong>

        </div>

    </div>


    <div class="table-responsive">

        <table>

            <thead>

                <tr>

                    <th>
                        Tanggal
                    </th>

                    <th>
                        Karyawan
                    </th>

                    <th>
                        Item
                    </th>

                    <th>
                        Jumlah
                    </th>

                    <th
                        class="commission-column"
                    >
                        Komisi
                    </th>

                </tr>

            </thead>

            <tbody>

                ${productions.map(
                    production =>

                        production.rows
                            .map(
                                row => `

                                    <tr>

                                        <td>
                                            ${formatDate(
                                                production.date
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHtml(
                                                production.employeeName
                                            )}
                                        </td>

                                        <td>

                                            ${escapeHtml(
                                                row.itemName
                                            )}

                                            ${
                                                row.customer
                                                    ? `
                                                        <br>

                                                        <small>
                                                            ${escapeHtml(
                                                                row.customer
                                                            )}
                                                        </small>
                                                    `
                                                    : ""
                                            }

                                        </td>

                                        <td>

                                            ${formatNumber(
                                                row.quantity
                                            )}

                                            ${escapeHtml(
                                                row.unit
                                            )}

                                        </td>

                                        <td
                                            class="commission-column"
                                        >

                                            ${formatCurrency(
                                                row.totalCommission
                                            )}

                                        </td>

                                    </tr>

                                `
                            )
                            .join("")

                ).join("")}

            </tbody>

        </table>

    </div>

`;
```

}

/* =========================================================
REPORT PRESET
========================================================= */

function setReportToday() {

```
const today =
    getToday();

const start =
    document.getElementById(
        "reportStartDate"
    );

const end =
    document.getElementById(
        "reportEndDate"
    );

if (start) {
    start.value = today;
}

if (end) {
    end.value = today;
}

renderReports();
```

}

function setReportThisMonth() {

```
const now =
    new Date();

const firstDay =
    new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

const year =
    firstDay.getFullYear();

const month =
    String(
        firstDay.getMonth() + 1
    ).padStart(2, "0");

const start =
    document.getElementById(
        "reportStartDate"
    );

const end =
    document.getElementById(
        "reportEndDate"
    );

if (start) {

    start.value =
        `${year}-${month}-01`;

}

if (end) {

    end.value =
        getToday();

}

renderReports();
```

}

/* =========================================================
PRINT REPORT
========================================================= */

function generatePrintHtml(
productions
) {

```
let rows = "";

let totalQty = 0;

let totalCommission = 0;


productions.forEach(
    production => {

        production.rows.forEach(
            row => {

                totalQty +=
                    Number(
                        row.quantity || 0
                    );

                totalCommission +=
                    Number(
                        row.totalCommission || 0
                    );

                rows += `

                    <tr>

                        <td>
                            ${escapeHtml(
                                row.itemName
                            )}
                        </td>

                        <td>
                            ${formatNumber(
                                row.quantity
                            )}
                            ${escapeHtml(
                                row.unit
                            )}
                        </td>

                        ${
                            state.settings.commissionVisible
                                ? `
                                    <td>
                                        ${formatCurrency(
                                            row.totalCommission
                                        )}
                                    </td>
                                `
                                : ""
                        }

                    </tr>

                `;

            }
        );

    }
);


return `

    <div class="thermal-header">

        <div class="thermal-title">

            ${escapeHtml(
                state.settings.appName
            )}

        </div>

        <div class="thermal-subtitle">

            LAPORAN PRODUKSI

        </div>

        <div class="thermal-subtitle">

            ${formatDateTime(
                new Date()
            )}

        </div>

    </div>


    <table>

        <thead>

            <tr>

                <th>
                    Item
                </th>

                <th>
                    Jumlah
                </th>

                ${
                    state.settings.commissionVisible
                        ? `
                            <th>
                                Komisi
                            </th>
                        `
                        : ""
                }

            </tr>

        </thead>

        <tbody>

            ${rows}

        </tbody>

    </table>


    <div class="thermal-total">

        Total: ${formatNumber(totalQty)}

        ${
            state.settings.commissionVisible
                ? `
                    <br>
                    Komisi:
                    ${formatCurrency(
                        totalCommission
                    )}
                `
                : ""
        }

    </div>

`;
```

}

function printReport() {

```
const productions =
    getReportRange();

if (
    productions.length === 0
) {

    showToast(
        "Tidak ada data untuk dicetak",
        "warning"
    );

    return;

}


let printArea =
    document.getElementById(
        "printArea"
    );


if (!printArea) {

    printArea =
        document.createElement("div");

    printArea.id =
        "printArea";

    document.body.appendChild(
        printArea
    );

}


printArea.innerHTML =
    generatePrintHtml(
        productions
    );


window.print();
```

}

/* =========================================================
SHARE WHATSAPP
========================================================= */

function shareReportWhatsApp() {

```
const productions =
    getReportRange();

if (
    productions.length === 0
) {

    showToast(
        "Tidak ada laporan untuk dibagikan",
        "warning"
    );

    return;

}


let message =
    `*${state.settings.appName}*\n`;

message +=
    "*LAPORAN PRODUKSI*\n\n";


let totalQty = 0;

let totalCommission = 0;


productions.forEach(
    production => {

        message +=
            `📅 ${formatDate(
                production.date
            )}\n`;

        message +=
            `👤 ${production.employeeName}\n`;


        production.rows.forEach(
            row => {

                totalQty +=
                    Number(
                        row.quantity || 0
                    );

                totalCommission +=
                    Number(
                        row.totalCommission || 0
                    );

                message +=
                    `• ${row.itemName} ${formatNumber(row.quantity)} ${row.unit}`;

                if (
                    state.settings.commissionVisible
                ) {

                    message +=
                        ` = ${formatCurrency(
                            row.totalCommission
                        )}`;

                }

                message += "\n";

            }
        );

        message += "\n";

    }
);


message +=
    `TOTAL QTY: ${formatNumber(
        totalQty
    )}\n`;


if (
    state.settings.commissionVisible
) {

    message +=
        `TOTAL KOMISI: ${formatCurrency(
            totalCommission
        )}`;

}


const url =
    "https://wa.me/?text=" +
    encodeURIComponent(
        message
    );


window.open(
    url,
    "_blank"
);
```

}

/* =========================================================
EXPORT REPORT TEXT
========================================================= */

function downloadReportText() {

```
const productions =
    getReportRange();

if (
    productions.length === 0
) {

    showToast(
        "Tidak ada laporan",
        "warning"
    );

    return;

}


let text =
    `${state.settings.appName}\n`;

text +=
    "LAPORAN PRODUKSI\n\n";


productions.forEach(
    production => {

        text +=
            `${production.date} - ${production.employeeName}\n`;

        production.rows.forEach(
            row => {

                text +=
                    `${row.itemName} | ${row.quantity} ${row.unit}`;

                if (
                    state.settings.commissionVisible
                ) {

                    text +=
                        ` | ${row.totalCommission}`;

                }

                text += "\n";

            }
        );

        text += "\n";

    }
);


const blob =
    new Blob(
        [text],
        {
            type:
                "text/plain"
        }
    );


downloadBlob(
    blob,
    `laporan-${getToday()}.txt`
);
```

}

/* =========================================================
BACKUP
========================================================= */

async function createBackup() {

```
const backup = {

    app:
        state.settings.appName,

    version:
        APP_VERSION,

    createdAt:
        new Date().toISOString(),

    data: {

        settings:
            state.settings,

        employees:
            state.employees,

        items:
            state.items,

        categories:
            state.categories,

        tiers:
            state.tiers,

        productions:
            state.productions

    }

};


const blob =
    new Blob(
        [
            JSON.stringify(
                backup,
                null,
                2
            )
        ],
        {
            type:
                "application/json"
        }
    );


const fileName =
    `APP_PROJECT_BACKUP_${getToday()}.json`;


downloadBlob(
    blob,
    fileName
);


showToast(
    "Backup berhasil dibuat"
);
```

}

function downloadBlob(
blob,
fileName
) {

```
const url =
    URL.createObjectURL(blob);

const link =
    document.createElement("a");

link.href = url;

link.download =
    fileName;

document.body.appendChild(
    link
);

link.click();

link.remove();

URL.revokeObjectURL(url);
```

}

/* =========================================================
RESTORE
========================================================= */

async function restoreBackupFile(
file
) {

```
if (!file) {
    return;
}


try {

    const text =
        await file.text();

    const backup =
        JSON.parse(text);


    const backupData =
        backup.data ||
        backup;


    if (
        !confirm(
            "Restore akan mengganti seluruh data aplikasi. Lanjutkan?"
        )
    ) {
        return;
    }


    for (
        const store of DB_STORES
    ) {

        await dbClear(store);

    }


    if (
        backupData.settings
    ) {

        await dbAdd(
            "settings",
            {
                id:
                    "app_settings",

                ...backupData.settings
            }
        );

    }


    const mappings = {

        employees:
            "employees",

        items:
            "items",

        categories:
            "categories",

        tiers:
            "tiers",

        productions:
            "productions"

    };


    for (
        const [
            key,
            store
        ] of Object.entries(
            mappings
        )
    ) {

        const list =
            backupData[key] || [];


        for (
            const item of list
        ) {

            if (!item.id) {

                item.id =
                    generateId(key);

            }

            await dbAdd(
                store,
                item
            );

        }

    }


    await loadAllData();

    applySettings();

    renderCurrentPage();

    renderDashboard();

    showToast(
        "Restore backup berhasil"
    );

} catch (error) {

    console.error(error);

    showToast(
        "File backup tidak valid",
        "error"
    );

}
```

}

/* =========================================================
BACKUP INFO
========================================================= */

function renderBackupInfo() {

```
setText(
    "backupEmployeeCount",
    state.employees.length
);

setText(
    "backupItemCount",
    state.items.length
);

setText(
    "backupProductionCount",
    state.productions.length
);

setText(
    "backupCategoryCount",
    state.categories.length
);
```

}

/* =========================================================
SETTINGS
========================================================= */

async function saveAppSettings() {

```
const input =
    document.getElementById(
        "settingAppName"
    );

if (!input) {
    return;
}


const name =
    input.value.trim();

if (!name) {

    showToast(
        "Nama aplikasi tidak boleh kosong",
        "warning"
    );

    return;

}


state.settings.appName =
    name;

await saveSettings();

applySettings();

showToast(
    "Pengaturan berhasil disimpan"
);
```

}

async function toggleCommission(
value
) {

```
state.settings.commissionVisible =
    Boolean(value);

await saveSettings();

applySettings();

renderCurrentPage();

showToast(
    state.settings.commissionVisible
        ? "Nominal komisi ditampilkan"
        : "Nominal komisi disembunyikan"
);
```

}

/* =========================================================
DATE HEADER
========================================================= */

function updateHeaderDate() {

```
const element =
    document.getElementById(
        "headerDate"
    );

if (!element) {
    return;
}


element.textContent =
    new Intl.DateTimeFormat(
        "id-ID",
        {
            weekday:
                "long",

            day:
                "numeric",

            month:
                "long",

            year:
                "numeric"
        }
    ).format(
        new Date()
    );
```

}

/* =========================================================
ONLINE STATUS
========================================================= */

function updateOnlineStatus() {

```
const badge =
    document.getElementById(
        "onlineStatus"
    );

const text =
    document.getElementById(
        "onlineStatusText"
    );

const connection =
    document.querySelector(
        ".connection-dot"
    );


const online =
    navigator.onLine;


if (text) {

    text.textContent =
        online
            ? "Online"
            : "Offline";

}


if (badge) {

    badge.classList.toggle(
        "offline",
        !online
    );

}


if (connection) {

    connection.style.background =
        online
            ? "#16a34a"
            : "#f59e0b";

}
```

}

/* =========================================================
TEXT HELPER
========================================================= */

function setText(
id,
value
) {

```
const element =
    document.getElementById(id);

if (element) {

    element.textContent =
        value;

}
```

}

/* =========================================================
CLEAR ALL DATA
========================================================= */

async function clearAllData() {

```
const confirmed =
    confirm(
        "PERINGATAN!\n\nSemua data akan dihapus permanen.\n\nPastikan Anda sudah melakukan backup."
    );


if (!confirmed) {
    return;
}


for (
    const store of DB_STORES
) {

    await dbClear(store);

}


state.employees = [];

state.items = [];

state.categories = [];

state.tiers = [];

state.productions = [];

state.currentProductionRows = [];


state.settings = {

    appName:
        "Laundry Manager",

    commissionVisible:
        true,

    currency:
        "Rp"

};


await createDefaultData();

await loadAllData();

applySettings();

renderCurrentPage();

showToast(
    "Semua data berhasil dihapus"
);
```

}

/* =========================================================
EVENT LISTENERS
========================================================= */

function initEvents() {

```
/*
   MOBILE MENU
*/

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        openMobileSidebar
    );

}


const sidebarClose =
    document.getElementById(
        "sidebarClose"
    );

if (sidebarClose) {

    sidebarClose.addEventListener(
        "click",
        closeMobileSidebar
    );

}


const sidebarOverlay =
    document.querySelector(
        ".sidebar-overlay"
    );

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


/*
   COMMISSION SWITCH
*/

const commissionSwitch =
    document.getElementById(
        "commissionSwitch"
    );

if (commissionSwitch) {

    commissionSwitch.addEventListener(
        "change",
        event => {

            toggleCommission(
                event.target.checked
            );

        }
    );

}


/*
   PRODUCTION EMPLOYEE
*/

const productionEmployee =
    document.getElementById(
        "productionEmployee"
    );

if (productionEmployee) {

    productionEmployee.addEventListener(
        "change",
        onProductionEmployeeChange
    );

}


/*
   RESTORE FILE
*/

const restoreInput =
    document.getElementById(
        "restoreFile"
    );

if (restoreInput) {

    restoreInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            restoreBackupFile(
                file
            );

            event.target.value = "";

        }
    );

}


/*
   ESC CLOSE MODAL
*/

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeAllModals();

        }

    }
);


/*
   MODAL BACKDROP
*/

document
    .querySelectorAll(
        ".modal"
    )
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal ||
                    event.target.classList.contains(
                        "modal-backdrop"
                    )
                ) {

                    closeModal(
                        modal.id
                    );

                }

            }
        );

    });


/*
   ONLINE STATUS
*/

window.addEventListener(
    "online",
    updateOnlineStatus
);

window.addEventListener(
    "offline",
    updateOnlineStatus
);
```

}

/* =========================================================
QUICK ACTION
========================================================= */

function goToProduction() {

```
showPage(
    "production"
);
```

}

function goToWhatsApp() {

```
showPage(
    "whatsapp"
);
```

}

function goToReports() {

```
showPage(
    "reports"
);
```

}

/* =========================================================
IMAGE EXPORT
========================================================= */

async function exportReportImage() {

```
showToast(
    "Fitur export JPG memerlukan library html2canvas. Tambahkan library pada index.html.",
    "warning"
);
```

}

/* =========================================================
PDF EXPORT
========================================================= */

async function exportReportPDF() {

```
showToast(
    "Fitur export PDF memerlukan library jsPDF atau browser print-to-PDF.",
    "warning"
);
```

}

/* =========================================================
INITIALIZE
========================================================= */

async function initializeApp() {

```
try {

    await initDatabase();

    await loadAllData();

    await createDefaultData();

    await loadAllData();


    applySettings();

    updateHeaderDate();

    updateOnlineStatus();


    initNavigation();

    initEvents();


    /*
       DEFAULT PRODUCTION ROW
    */

    if (
        state.currentProductionRows.length === 0
    ) {

        state.currentProductionRows.push(
            createProductionRow()
        );

    }


    renderDashboard();

    renderCurrentPage();


    setTimeout(() => {

        const loader =
            document.querySelector(
                ".app-loader"
            );

        if (loader) {

            loader.classList.add(
                "hidden"
            );

        }

    }, 350);


    console.log(
        "Laundry Manager Ready"
    );

} catch (error) {

    console.error(
        "Application initialization error:",
        error
    );

    showToast(
        "Terjadi kesalahan saat membuka aplikasi",
        "error"
    );

}
```

}

/* =========================================================
SERVICE WORKER
========================================================= */

function registerServiceWorker() {

```
if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(() => {

                    console.log(
                        "Service Worker Registered"
                    );

                })
                .catch(error => {

                    console.warn(
                        "Service Worker Failed",
                        error
                    );

                });

        }
    );

}
```

}

/* =========================================================
GLOBAL FUNCTIONS
========================================================= */

window.openModal =
openModal;

window.closeModal =
closeModal;

window.openEmployeeModal =
openEmployeeModal;

window.saveEmployee =
saveEmployee;

window.editEmployee =
editEmployee;

window.deleteEmployee =
deleteEmployee;

window.openItemModal =
openItemModal;

window.saveItem =
saveItem;

window.editItem =
editItem;

window.deleteItem =
deleteItem;

window.addCategory =
addCategory;

window.deleteCategory =
deleteCategory;

window.addTier =
addTier;

window.deleteTier =
deleteTier;

window.addProductionRow =
addProductionRow;

window.removeProductionRow =
removeProductionRow;

window.updateProductionRowItem =
updateProductionRowItem;

window.updateProductionRowQuantity =
updateProductionRowQuantity;

window.updateProductionRowCustomer =
updateProductionRowCustomer;

window.saveProduction =
saveProduction;

window.parseWhatsAppText =
parseWhatsAppText;

window.sendWhatsAppToProduction =
sendWhatsAppToProduction;

window.renderReports =
renderReports;

window.setReportToday =
setReportToday;

window.setReportThisMonth =
setReportThisMonth;

window.printReport =
printReport;

window.shareReportWhatsApp =
shareReportWhatsApp;

window.downloadReportText =
downloadReportText;

window.createBackup =
createBackup;

window.restoreBackupFile =
restoreBackupFile;

window.saveAppSettings =
saveAppSettings;

window.toggleCommission =
toggleCommission;

window.clearAllData =
clearAllData;

window.goToProduction =
goToProduction;

window.goToWhatsApp =
goToWhatsApp;

window.goToReports =
goToReports;

window.exportReportImage =
exportReportImage;

window.exportReportPDF =
exportReportPDF;

/* =========================================================
START APP
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    initializeApp();

    registerServiceWorker();

}
```

);
