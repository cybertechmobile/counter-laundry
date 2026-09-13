/* =========================================================
   LAUNDRY MANAGER PWA
   FILE 2 — style.css
   VERSION 4.0.0
========================================================= */


/* =========================================================
   RESET & VARIABLES
========================================================= */

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #dbeafe;

  --success: #16a34a;
  --success-light: #dcfce7;

  --warning: #f59e0b;
  --warning-light: #fef3c7;

  --danger: #dc2626;
  --danger-light: #fee2e2;

  --purple: #7c3aed;
  --purple-light: #ede9fe;

  --bg: #f4f7fb;
  --surface: #ffffff;
  --surface-alt: #f8fafc;

  --text: #172033;
  --text-secondary: #64748b;
  --border: #e2e8f0;

  --sidebar-width: 270px;
  --header-height: 76px;

  --radius-sm: 10px;
  --radius: 16px;
  --radius-lg: 24px;

  --shadow-sm:
    0 2px 8px rgba(15, 23, 42, 0.05);

  --shadow:
    0 8px 30px rgba(15, 23, 42, 0.08);

  --shadow-lg:
    0 20px 50px rgba(15, 23, 42, 0.15);

  --transition:
    0.25s ease;

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


* {
  box-sizing: border-box;
}


html {
  scroll-behavior: smooth;
}


body {
  margin: 0;
  min-height: 100vh;

  background: var(--bg);

  color: var(--text);

  font-family: inherit;

  overflow-x: hidden;

  -webkit-font-smoothing: antialiased;

  -webkit-tap-highlight-color: transparent;
}


body.dark-mode {

  --bg: #0f172a;

  --surface: #162033;

  --surface-alt: #1e293b;

  --text: #f1f5f9;

  --text-secondary: #94a3b8;

  --border: #334155;

  --primary-light: #1e3a8a;

  --success-light: #14532d;

  --warning-light: #78350f;

  --danger-light: #7f1d1d;

  --purple-light: #4c1d95;
}


button,
input,
select,
textarea {
  font: inherit;
}


button {
  cursor: pointer;
}


button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}


img {
  max-width: 100%;
  display: block;
}


.hidden {
  display: none !important;
}


.mobile-only {
  display: none;
}


/* =========================================================
   SPLASH SCREEN
========================================================= */

.splash-screen {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    radial-gradient(
      circle at top right,
      #3b82f6,
      #1e3a8a 45%,
      #0f172a 100%
    );

  color: white;

  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;
}


.splash-screen.hide {

  opacity: 0;

  visibility: hidden;

  pointer-events: none;
}


.splash-content {

  width: min(90%, 400px);

  text-align: center;

  padding: 35px 25px;

  animation:
    splashEnter 0.7s ease;
}


.splash-logo {

  width: 120px;

  height: 120px;

  margin: 0 auto 25px;

  padding: 14px;

  border-radius: 32px;

  background: rgba(255,255,255,0.12);

  backdrop-filter: blur(10px);

  box-shadow:
    0 15px 40px rgba(0,0,0,0.25);

  animation:
    splashFloat 2.8s ease-in-out infinite;
}


.splash-logo img {

  width: 100%;

  height: 100%;

  object-fit: contain;

  border-radius: 22px;
}


.splash-content h1 {

  margin: 0;

  font-size: 28px;

  font-weight: 800;

  letter-spacing: -0.5px;
}


.splash-content p {

  margin: 10px 0 24px;

  opacity: 0.75;

  font-size: 14px;
}


.loader {

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 8px;
}


.loader span {

  width: 10px;

  height: 10px;

  border-radius: 50%;

  background: white;

  animation:
    loaderBounce 1.2s infinite ease-in-out;
}


.loader span:nth-child(2) {
  animation-delay: 0.15s;
}


.loader span:nth-child(3) {
  animation-delay: 0.3s;
}


@keyframes splashEnter {

  from {

    opacity: 0;

    transform: translateY(25px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }
}


@keyframes splashFloat {

  0%,
  100% {

    transform:
      translateY(0);

  }

  50% {

    transform:
      translateY(-8px);

  }
}


@keyframes loaderBounce {

  0%,
  80%,
  100% {

    transform: scale(0.65);

    opacity: 0.45;

  }

  40% {

    transform: scale(1);

    opacity: 1;

  }
}


/* =========================================================
   APP SHELL
========================================================= */

.app-shell {

  display: flex;

  min-height: 100vh;
}


/* =========================================================
   SIDEBAR
========================================================= */

.sidebar {

  position: fixed;

  top: 0;

  left: 0;

  bottom: 0;

  width: var(--sidebar-width);

  display: flex;

  flex-direction: column;

  z-index: 1000;

  background:
    linear-gradient(
      180deg,
      #172554,
      #1e3a8a
    );

  color: white;

  box-shadow:
    10px 0 30px rgba(15,23,42,0.1);

  transition:
    transform var(--transition);
}


.sidebar-brand {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 22px 18px;

  border-bottom:
    1px solid rgba(255,255,255,0.1);
}


.brand-icon {

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  padding: 5px;

  background:
    rgba(255,255,255,0.12);

  border-radius: 14px;
}


.brand-icon img {

  width: 100%;

  height: 100%;

  object-fit: contain;

  border-radius: 10px;
}


.brand-text {

  min-width: 0;

  display: flex;

  flex-direction: column;
}


.brand-text strong {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 16px;
}


.brand-text small {

  margin-top: 3px;

  color: rgba(255,255,255,0.65);

  font-size: 11px;
}


.sidebar-nav {

  flex: 1;

  padding: 15px 12px;

  overflow-y: auto;
}


.nav-item {

  width: 100%;

  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 5px;

  padding: 13px 14px;

  border: none;

  border-radius: 13px;

  background: transparent;

  color: rgba(255,255,255,0.75);

  text-align: left;

  transition:
    background var(--transition),
    color var(--transition),
    transform var(--transition);
}


.nav-item:hover {

  background:
    rgba(255,255,255,0.09);

  color: white;

  transform:
    translateX(3px);
}


.nav-item.active {

  background:
    rgba(255,255,255,0.16);

  color: white;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.08);
}


.nav-icon {

  width: 25px;

  text-align: center;

  font-size: 18px;
}


.nav-label {

  font-size: 14px;

  font-weight: 600;
}


.sidebar-footer {

  padding: 16px 18px;

  border-top:
    1px solid rgba(255,255,255,0.1);

  color:
    rgba(255,255,255,0.65);

  font-size: 12px;
}


.database-status {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 8px;
}


.status-dot {

  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #4ade80;

  box-shadow:
    0 0 0 4px rgba(74,222,128,0.15);
}


/* =========================================================
   SIDEBAR OVERLAY
========================================================= */

.sidebar-overlay {

  display: none;

  position: fixed;

  inset: 0;

  z-index: 900;

  background:
    rgba(15,23,42,0.55);

  backdrop-filter:
    blur(2px);
}


.sidebar-overlay.show {

  display: block;
}


/* =========================================================
   MAIN CONTENT
========================================================= */

.main-content {

  width: 100%;

  min-height: 100vh;

  margin-left: var(--sidebar-width);

  background: var(--bg);
}


/* =========================================================
   HEADER
========================================================= */

.top-header {

  position: sticky;

  top: 0;

  z-index: 500;

  min-height: var(--header-height);

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding:
    12px 28px;

  background:
    rgba(255,255,255,0.9);

  backdrop-filter:
    blur(16px);

  border-bottom:
    1px solid var(--border);
}


.dark-mode .top-header {

  background:
    rgba(22,32,51,0.9);
}


.header-left {

  display: flex;

  align-items: center;

  gap: 15px;
}


.header-right {

  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 12px;

  flex-wrap: wrap;
}


.page-heading h1 {

  margin: 0;

  font-size: 21px;

  font-weight: 800;
}


.page-heading p {

  margin: 3px 0 0;

  color: var(--text-secondary);

  font-size: 13px;
}


/* =========================================================
   BUTTONS
========================================================= */

.icon-button {

  width: 42px;

  height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border: 1px solid var(--border);

  border-radius: 12px;

  background: var(--surface);

  color: var(--text);

  font-size: 18px;

  transition:
    transform var(--transition),
    box-shadow var(--transition),
    background var(--transition);
}


.icon-button:hover {

  transform:
    translateY(-2px);

  box-shadow:
    var(--shadow-sm);

  background:
    var(--surface-alt);
}


.primary-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-height: 44px;

  padding:
    11px 18px;

  border: none;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-dark)
    );

  color: white;

  font-weight: 700;

  box-shadow:
    0 8px 18px rgba(37,99,235,0.22);

  transition:
    transform var(--transition),
    box-shadow var(--transition);
}


.primary-button:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 12px 24px rgba(37,99,235,0.3);
}


.secondary-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  min-height: 42px;

  padding:
    10px 16px;

  border:
    1px solid var(--border);

  border-radius: 11px;

  background:
    var(--surface);

  color:
    var(--text);

  font-weight: 600;

  transition:
    background var(--transition),
    transform var(--transition);
}


.secondary-button:hover {

  background:
    var(--surface-alt);

  transform:
    translateY(-1px);
}


.danger-button {

  min-height: 42px;

  padding:
    10px 17px;

  border: none;

  border-radius: 11px;

  background:
    var(--danger);

  color: white;

  font-weight: 700;
}


.danger-outline-button {

  min-height: 42px;

  padding:
    10px 16px;

  border:
    1px solid var(--danger);

  border-radius: 11px;

  background:
    transparent;

  color:
    var(--danger);

  font-weight: 600;
}


.whatsapp-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-height: 44px;

  padding:
    11px 18px;

  border: none;

  border-radius: 12px;

  background:
    #25d366;

  color: white;

  font-weight: 700;
}


.text-button {

  padding: 8px;

  border: none;

  background: transparent;

  color: var(--primary);

  font-weight: 700;
}


.full-width {

  width: 100%;
}


.install-button {

  min-height: 40px;

  padding:
    9px 14px;

  border: none;

  border-radius: 10px;

  background:
    var(--primary);

  color: white;

  font-weight: 700;
}


/* =========================================================
   COMMISSION SWITCH
========================================================= */

.commission-switch-wrap {

  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    7px 10px;

  border:
    1px solid var(--border);

  border-radius: 12px;

  background:
    var(--surface);
}


.commission-label {

  font-size: 12px;

  font-weight: 600;

  color:
    var(--text-secondary);
}


.switch {

  position: relative;

  display: inline-block;

  width: 46px;

  height: 25px;
}


.switch input {

  width: 0;

  height: 0;

  opacity: 0;
}


.slider {

  position: absolute;

  inset: 0;

  border-radius: 50px;

  background:
    #cbd5e1;

  transition:
    0.25s ease;
}


.slider::before {

  content: "";

  position: absolute;

  width: 19px;

  height: 19px;

  left: 3px;

  top: 3px;

  border-radius: 50%;

  background: white;

  box-shadow:
    0 2px 5px rgba(0,0,0,0.2);

  transition:
    0.25s ease;
}


.switch input:checked + .slider {

  background:
    var(--primary);
}


.switch input:checked + .slider::before {

  transform:
    translateX(21px);
}


/* =========================================================
   ONLINE STATUS
========================================================= */

.online-status {

  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    8px 11px;

  border-radius: 20px;

  background:
    var(--success-light);

  color:
    var(--success);

  font-size: 12px;

  font-weight: 700;
}


.online-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background:
    currentColor;
}


/* =========================================================
   PAGE CONTENT
========================================================= */

.page-content {

  padding:
    28px;
}


.page {

  display: none;

  animation:
    pageFade 0.3s ease;
}


.page.active {

  display: block;
}


@keyframes pageFade {

  from {

    opacity: 0;

    transform:
      translateY(8px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }
}


/* =========================================================
   PAGE GRID
========================================================= */

.page-grid {

  display: grid;

  gap: 22px;
}


.two-column {

  grid-template-columns:
    minmax(0,1fr)
    minmax(0,1fr);
}


/* =========================================================
   WELCOME CARD
========================================================= */

.welcome-card {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 25px;

  margin-bottom: 24px;

  padding:
    30px;

  border-radius:
    var(--radius-lg);

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1e40af
    );

  color: white;

  box-shadow:
    0 15px 40px rgba(37,99,235,0.22);
}


.eyebrow {

  display: inline-block;

  margin-bottom: 8px;

  font-size: 13px;

  font-weight: 700;

  opacity: 0.8;
}


.welcome-card h2 {

  margin: 0;

  font-size: 27px;
}


.welcome-card p {

  max-width: 600px;

  margin:
    9px 0 0;

  color:
    rgba(255,255,255,0.8);

  line-height: 1.6;
}


.welcome-date {

  min-width: 130px;

  padding:
    18px;

  border-radius:
    var(--radius);

  background:
    rgba(255,255,255,0.13);

  text-align: center;

  backdrop-filter:
    blur(8px);
}


.welcome-date span {

  display: block;

  margin-bottom: 7px;

  font-size: 24px;
}


.welcome-date strong {

  display: block;

  font-size: 13px;
}


/* =========================================================
   STATS
========================================================= */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0,1fr));

  gap: 18px;

  margin-bottom: 24px;
}


.stat-card {

  display: flex;

  align-items: center;

  gap: 14px;

  min-width: 0;

  padding:
    20px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface);

  box-shadow:
    var(--shadow-sm);

  transition:
    transform var(--transition),
    box-shadow var(--transition);
}


.stat-card:hover {

  transform:
    translateY(-3px);

  box-shadow:
    var(--shadow);
}


.stat-card > div:last-child {

  min-width: 0;
}


.stat-card span {

  display: block;

  margin-bottom: 6px;

  color:
    var(--text-secondary);

  font-size: 12px;
}


.stat-card strong {

  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 21px;
}


.stat-icon {

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 14px;

  font-size: 22px;
}


.stat-icon.blue {

  background:
    var(--primary-light);
}


.stat-icon.green {

  background:
    var(--success-light);
}


.stat-icon.orange {

  background:
    var(--warning-light);
}


.stat-icon.purple {

  background:
    var(--purple-light);
}


/* =========================================================
   SECTION CARD
========================================================= */

.section-card {

  margin-bottom: 24px;

  padding:
    24px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface);

  box-shadow:
    var(--shadow-sm);
}


.section-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 22px;
}


.section-header h3 {

  margin: 0;

  font-size: 18px;
}


.section-header p {

  margin:
    5px 0 0;

  color:
    var(--text-secondary);

  font-size: 13px;
}


/* =========================================================
   QUICK ACTIONS
========================================================= */

.quick-actions {

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0,1fr));

  gap: 14px;
}


.quick-action {

  min-height: 145px;

  padding:
    20px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);

  color:
    var(--text);

  text-align: left;

  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);
}


.quick-action:hover {

  transform:
    translateY(-4px);

  border-color:
    var(--primary);

  box-shadow:
    var(--shadow);
}


.quick-action span {

  display: block;

  margin-bottom: 12px;

  font-size: 28px;
}


.quick-action strong {

  display: block;

  margin-bottom: 5px;

  font-size: 14px;
}


.quick-action small {

  color:
    var(--text-secondary);

  font-size: 12px;
}


/* =========================================================
   RECENT JOBS
========================================================= */

.recent-jobs {

  display: grid;

  gap: 10px;
}


.recent-job {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding:
    15px;

  border:
    1px solid var(--border);

  border-radius:
    13px;

  background:
    var(--surface-alt);
}


.recent-job-left {

  display: flex;

  align-items: center;

  gap: 12px;
}


.recent-job-icon {

  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background:
    var(--primary-light);
}


.recent-job strong {

  display: block;

  font-size: 14px;
}


.recent-job small {

  display: block;

  margin-top: 3px;

  color:
    var(--text-secondary);

  font-size: 12px;
}


/* =========================================================
   EMPTY STATE
========================================================= */

.empty-state {

  padding:
    45px 20px;

  text-align: center;

  color:
    var(--text-secondary);
}


.empty-state > span {

  display: block;

  margin-bottom: 12px;

  font-size: 42px;
}


.empty-state h3 {

  margin: 0 0 8px;

  color:
    var(--text);
}


.empty-state p {

  margin: 0;

  font-size: 14px;
}


/* =========================================================
   FORM
========================================================= */

.form-group {

  margin-bottom: 18px;
}


.form-group label {

  display: block;

  margin-bottom: 8px;

  color:
    var(--text);

  font-size: 13px;

  font-weight: 700;
}


.form-group label small {

  display: block;

  margin-top: 5px;

  color:
    var(--text-secondary);

  font-size: 11px;

  font-weight: 500;

  line-height: 1.5;
}


.form-row {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 16px;
}


input,
select,
textarea {

  width: 100%;

  border:
    1px solid var(--border);

  border-radius:
    11px;

  outline: none;

  background:
    var(--surface);

  color:
    var(--text);

  transition:
    border-color var(--transition),
    box-shadow var(--transition);
}


input,
select {

  min-height: 45px;

  padding:
    10px 13px;
}


textarea {

  min-height: 100px;

  padding:
    12px 13px;

  resize:
    vertical;
}


input::placeholder,
textarea::placeholder {

  color:
    #94a3b8;
}


input:focus,
select:focus,
textarea:focus {

  border-color:
    var(--primary);

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.1);
}


/* =========================================================
   PREVIEW
========================================================= */

.preview-card {

  min-height: 450px;
}


.job-preview {

  min-height: 330px;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    2px dashed var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);
}


.preview-placeholder {

  text-align: center;

  color:
    var(--text-secondary);
}


.preview-placeholder span {

  display: block;

  margin-bottom: 10px;

  font-size: 45px;
}


/* =========================================================
   WHATSAPP
========================================================= */

.whatsapp-card {

  border-top:
    4px solid #25d366;
}


.parse-result {

  margin-top: 18px;

  padding:
    15px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);

  overflow-x: auto;
}


.whatsapp-actions {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 18px;

  flex-wrap: wrap;
}


/* =========================================================
   FILTER BAR
========================================================= */

.filter-bar {

  display: grid;

  grid-template-columns:
    2fr 1fr 1fr auto;

  gap: 12px;

  margin-bottom: 20px;
}


/* =========================================================
   TABLE
========================================================= */

.table-responsive {

  width: 100%;

  overflow-x: auto;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);
}


table {

  width: 100%;

  border-collapse:
    collapse;

  min-width:
    760px;
}


thead {

  background:
    var(--surface-alt);
}


th,
td {

  padding:
    14px;

  border-bottom:
    1px solid var(--border);

  text-align: left;

  font-size: 13px;
}


th {

  color:
    var(--text-secondary);

  font-weight: 700;

  white-space: nowrap;
}


td {

  color:
    var(--text);
}


tbody tr:hover {

  background:
    var(--surface-alt);
}


tbody tr:last-child td {

  border-bottom: none;
}


.table-actions {

  display: flex;

  gap: 7px;
}


.table-action {

  width: 34px;

  height: 34px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid var(--border);

  border-radius: 9px;

  background:
    var(--surface);

  font-size: 14px;
}


/* =========================================================
   PAGINATION
========================================================= */

.pagination {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 20px;

  flex-wrap: wrap;
}


.pagination button {

  min-width: 36px;

  height: 36px;

  border:
    1px solid var(--border);

  border-radius: 9px;

  background:
    var(--surface);

  color:
    var(--text);
}


.pagination button.active {

  background:
    var(--primary);

  color: white;

  border-color:
    var(--primary);
}


/* =========================================================
   REPORT CONTROLS
========================================================= */

.report-controls {

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0,1fr))
    auto;

  align-items: end;

  gap: 15px;
}


.report-controls .form-group {

  margin-bottom: 0;
}


.report-summary {

  margin-bottom: 24px;
}


.report-content {

  min-height: 250px;
}


.report-actions {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-bottom: 24px;

  flex-wrap: wrap;
}


/* =========================================================
   EMPLOYEE LIST
========================================================= */

.employee-list {

  display: grid;

  grid-template-columns:
    repeat(auto-fill,minmax(280px,1fr));

  gap: 16px;
}


.employee-card {

  padding:
    20px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);
}


.employee-card-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 15px;
}


.employee-avatar {

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    var(--primary-light);

  font-size: 21px;
}


.employee-info {

  flex: 1;
}


.employee-info strong {

  display: block;
}


.employee-info small {

  display: block;

  margin-top: 4px;

  color:
    var(--text-secondary);
}


.employee-commission {

  padding:
    12px;

  border-radius:
    12px;

  background:
    var(--purple-light);
}


.employee-commission span {

  display: block;

  margin-bottom: 4px;

  color:
    var(--text-secondary);

  font-size: 11px;
}


.employee-commission strong {

  font-size: 17px;
}


/* =========================================================
   ITEM LIST
========================================================= */

.item-list {

  display: grid;

  grid-template-columns:
    repeat(auto-fill,minmax(260px,1fr));

  gap: 15px;
}


.item-card {

  position: relative;

  padding:
    20px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);
}


.item-card h4 {

  margin:
    0 0 8px;
}


.item-meta {

  display: flex;

  gap: 7px;

  flex-wrap: wrap;

  margin-bottom: 15px;
}


.badge {

  display: inline-flex;

  align-items: center;

  padding:
    5px 9px;

  border-radius:
    20px;

  background:
    var(--primary-light);

  color:
    var(--primary);

  font-size: 11px;

  font-weight: 700;
}


.badge.success {

  background:
    var(--success-light);

  color:
    var(--success);
}


.badge.warning {

  background:
    var(--warning-light);

  color:
    var(--warning);
}


/* =========================================================
   TIER LIST
========================================================= */

.tier-list {

  display: grid;

  gap: 12px;
}


.tier-card {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding:
    17px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);
}


.tier-card strong {

  display: block;

  margin-bottom: 4px;
}


.tier-card small {

  color:
    var(--text-secondary);
}


/* =========================================================
   BACKUP
========================================================= */

.backup-options {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 15px;
}


.backup-option {

  min-height: 170px;

  padding:
    20px;

  border:
    1px solid var(--border);

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);

  color:
    var(--text);

  text-align: center;

  transition:
    transform var(--transition),
    border-color var(--transition);
}


.backup-option:hover {

  transform:
    translateY(-3px);

  border-color:
    var(--primary);
}


.backup-option span {

  display: block;

  margin-bottom: 12px;

  font-size: 35px;
}


.backup-option strong {

  display: block;

  margin-bottom: 6px;
}


.backup-option small {

  color:
    var(--text-secondary);
}


.restore-area {

  min-height: 170px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 15px;

  padding:
    20px;

  border:
    2px dashed var(--border);

  border-radius:
    var(--radius);

  text-align: center;
}


.restore-warning {

  margin: 0;

  color:
    var(--text-secondary);

  font-size: 12px;

  line-height: 1.6;
}


.database-info {

  padding:
    20px;

  border-radius:
    var(--radius);

  background:
    var(--surface-alt);
}


/* =========================================================
   SETTINGS
========================================================= */

.settings-list {

  display: grid;

  gap: 5px;
}


.setting-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding:
    16px 0;

  border-bottom:
    1px solid var(--border);
}


.setting-row:last-child {

  border-bottom: none;
}


.setting-row strong {

  display: block;

  font-size: 14px;
}


.setting-row small {

  display: block;

  margin-top: 5px;

  color:
    var(--text-secondary);

  font-size: 12px;
}


.danger-zone {

  border-color:
    rgba(220,38,38,0.25);
}


/* =========================================================
   MODAL
========================================================= */

.modal {

  position: fixed;

  inset: 0;

  z-index: 3000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    20px;
}


.modal-backdrop {

  position: absolute;

  inset: 0;

  background:
    rgba(15,23,42,0.65);

  backdrop-filter:
    blur(4px);
}


.modal-dialog {

  position: relative;

  z-index: 1;

  width: min(100%, 600px);

  max-height: 90vh;

  overflow-y: auto;

  border-radius:
    var(--radius-lg);

  background:
    var(--surface);

  box-shadow:
    var(--shadow-lg);

  animation:
    modalEnter 0.25s ease;
}


.small-modal {

  width: min(100%, 430px);
}


.modal-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding:
    20px 22px;

  border-bottom:
    1px solid var(--border);
}


.modal-header h2 {

  margin: 0;

  font-size: 18px;
}


.modal-body {

  padding:
    22px;
}


.modal-footer {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  padding:
    16px 22px;

  border-top:
    1px solid var(--border);
}


@keyframes modalEnter {

  from {

    opacity: 0;

    transform:
      translateY(15px)
      scale(0.98);

  }

  to {

    opacity: 1;

    transform:
      translateY(0)
      scale(1);

  }
}


/* =========================================================
   TOAST
========================================================= */

.toast-container {

  position: fixed;

  right: 20px;

  bottom: 20px;

  z-index: 5000;

  display: grid;

  gap: 10px;

  width:
    min(360px, calc(100vw - 40px));
}


.toast {

  display: flex;

  align-items: flex-start;

  gap: 12px;

  padding:
    15px;

  border:
    1px solid var(--border);

  border-radius:
    14px;

  background:
    var(--surface);

  color:
    var(--text);

  box-shadow:
    var(--shadow-lg);

  animation:
    toastEnter 0.3s ease;
}


.toast.success {

  border-left:
    4px solid var(--success);
}


.toast.error {

  border-left:
    4px solid var(--danger);
}


.toast.warning {

  border-left:
    4px solid var(--warning);
}


.toast.info {

  border-left:
    4px solid var(--primary);
}


@keyframes toastEnter {

  from {

    opacity: 0;

    transform:
      translateX(20px);

  }

  to {

    opacity: 1;

    transform:
      translateX(0);

  }
}


/* =========================================================
   PRINT AREA
========================================================= */

.print-area {

  display: none;
}


/* =========================================================
   COMMISSION HIDDEN
========================================================= */

.hide-commission
.commission-stat {

  display: none !important;
}


.hide-commission
.commission-column {

  display: none !important;
}


/* =========================================================
   SCROLLBAR
========================================================= */

::-webkit-scrollbar {

  width: 8px;

  height: 8px;
}


::-webkit-scrollbar-track {

  background:
    transparent;
}


::-webkit-scrollbar-thumb {

  border-radius: 20px;

  background:
    #cbd5e1;
}


.dark-mode
::-webkit-scrollbar-thumb {

  background:
    #475569;
}


/* =========================================================
   ACCESSIBILITY
========================================================= */

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {

  outline:
    3px solid rgba(37,99,235,0.35);

  outline-offset:
    2px;
}


@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {

    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    scroll-behavior:
      auto !important;

    transition-duration:
      0.01ms !important;

  }

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1200px) {

  .stats-grid {

    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }


  .quick-actions {

    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }


  .report-controls {

    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

@media (max-width: 992px) {

  .sidebar {

    transform:
      translateX(-100%);
  }


  .sidebar.open {

    transform:
      translateX(0);
  }


  .main-content {

    margin-left: 0;
  }


  .mobile-only {

    display:
      inline-flex;
  }


  .top-header {

    padding:
      12px 18px;
  }


  .page-content {

    padding:
      20px;
  }


  .two-column {

    grid-template-columns:
      1fr;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  body {

    font-size:
      14px;
  }


  .top-header {

    min-height: auto;

    align-items:
      flex-start;

    gap: 12px;

    padding:
      12px;
  }


  .header-left {

    flex: 1;

    min-width: 0;
  }


  .header-right {

    gap: 7px;
  }


  .page-heading h1 {

    font-size:
      17px;
  }


  .page-heading p {

    display: none;
  }


  .online-status {

    padding:
      8px;
  }


  #onlineStatusText {

    display: none;
  }


  .commission-label {

    display: none;
  }


  .commission-switch-wrap {

    padding:
      5px;
  }


  .page-content {

    padding:
      14px;
  }


  .welcome-card {

    flex-direction:
      column;

    align-items:
      flex-start;

    padding:
      22px;
  }


  .welcome-card h2 {

    font-size:
      22px;
  }


  .welcome-date {

    width: 100%;
  }


  .stats-grid {

    grid-template-columns:
      1fr 1fr;

    gap:
      10px;
  }


  .stat-card {

    align-items:
      flex-start;

    flex-direction:
      column;

    gap:
      10px;

    padding:
      15px;
  }


  .stat-icon {

    width:
      42px;

    height:
      42px;
  }


  .stat-card strong {

    font-size:
      17px;
  }


  .section-card {

    padding:
      17px;

    margin-bottom:
      16px;
  }


  .section-header {

    align-items:
      flex-start;

    flex-direction:
      column;

    gap:
      12px;
  }


  .quick-actions {

    grid-template-columns:
      1fr 1fr;

    gap:
      10px;
  }


  .quick-action {

    min-height:
      120px;

    padding:
      15px;
  }


  .quick-action span {

    font-size:
      24px;
  }


  .form-row {

    grid-template-columns:
      1fr;
  }


  .filter-bar {

    grid-template-columns:
      1fr;
  }


  .report-controls {

    grid-template-columns:
      1fr;
  }


  .report-controls
  .primary-button {

    width: 100%;
  }


  .backup-options {

    grid-template-columns:
      1fr;
  }


  .employee-list,
  .item-list {

    grid-template-columns:
      1fr;
  }


  .tier-card {

    align-items:
      flex-start;

    flex-direction:
      column;
  }


  .report-actions {

    display:
      grid;

    grid-template-columns:
      1fr 1fr;
  }


  .report-actions button {

    width:
      100%;
  }


  .modal {

    align-items:
      flex-end;

    padding: 0;
  }


  .modal-dialog {

    width: 100%;

    max-height:
      88vh;

    border-radius:
      24px 24px 0 0;
  }


  .toast-container {

    right:
      12px;

    bottom:
      12px;

    width:
      calc(100vw - 24px);
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 420px) {

  .stats-grid {

    grid-template-columns:
      1fr;
  }


  .quick-actions {

    grid-template-columns:
      1fr;
  }


  .report-actions {

    grid-template-columns:
      1fr;
  }


  .header-right
  .install-button {

    display: none;
  }


  .splash-logo {

    width:
      100px;

    height:
      100px;
  }


  .splash-content h1 {

    font-size:
      24px;
  }

}


/* =========================================================
   PRINT
========================================================= */

@media print {

  body {

    background:
      white !important;
  }


  .sidebar,
  .top-header,
  .page-content,
  .modal,
  .toast-container,
  .splash-screen {

    display:
      none !important;
  }


  .print-area {

    display:
      block !important;
  }

}


/* =========================================================
   THERMAL 58MM
========================================================= */

@media print {

  .thermal-print {

    width:
      58mm;

    padding:
      4mm;

    font-family:
      monospace;

    font-size:
      11px;

    color:
      black;

    background:
      white;
  }


  .thermal-print h1,
  .thermal-print h2,
  .thermal-print h3 {

    margin:
      0 0 5px;

    text-align:
      center;

    font-size:
      14px;
  }


  .thermal-print table {

    width: 100%;

    min-width: 0;

    font-size:
      10px;
  }


  .thermal-print th,
  .thermal-print td {

    padding:
      4px 2px;

    border-bottom:
      1px dashed #000;
  }

}