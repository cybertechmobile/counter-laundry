# 🧺 Laundry Manager PWA

Aplikasi manajemen laundry berbasis **PWA (Progressive Web App)** yang ringan, responsif, dan dapat digunakan secara **online maupun offline**.

Aplikasi dirancang untuk berjalan dengan baik di:

* 📱 Android
* 📱 iPhone / iPad
* 💻 Laptop
* 🖥️ Desktop
* 📲 Tablet

---

# ✨ FITUR UTAMA

## 📦 Manajemen Item

* Tambah item laundry
* Edit item
* Hapus item
* Kode item fleksibel
* Mendukung beberapa kode

Contoh:

```text
Sepatu
Kode:
spt,sptk,sptg
```

Kode tersebut dapat digunakan saat membaca format pekerjaan dari WhatsApp.

---

# ⚖️ Jenis Satuan

Mendukung dua jenis item:

### KG / Kiloan

Contoh:

```text
Cuci Kering Setrika
5 KG
2.5 KG
3.75 KG
```

Mendukung angka desimal.

---

### Satuan

Contoh:

```text
Sepatu
Tas
Boneka
Karpet
Helm
```

Contoh input:

```text
sepatu 2
tas 1
```

---

# 👥 Data Karyawan

Setiap karyawan memiliki parameter komisi masing-masing.

Contoh:

```text
Karyawan A

Cuci Kering Setrika
Komisi: Rp 1.000 / KG
```

Sedangkan:

```text
Karyawan B

Cuci Kering Setrika
Komisi: Rp 1.500 / KG
```

Dengan demikian komisi tidak disamaratakan.

---

# 💰 Sistem Komisi Fleksibel

Komisi dapat menggunakan beberapa metode:

* Nominal
* Persentase
* Per KG
* Per Satuan
* Kombinasi

Sistem dapat disesuaikan berdasarkan:

```text
Karyawan
+
Item
+
Jumlah
+
Satuan
```

---

# 🏷️ Tier / Parameter Fleksibel

Aplikasi menyediakan sistem parameter tambahan.

Contoh:

```text
Tier 1
Tier 2
Tier Premium
Express
VIP
Cabang
Level
Kategori
```

Parameter dapat ditambahkan sesuai kebutuhan.

Tidak terbatas hanya pada satu jenis tier.

---

# 💬 INPUT DARI WHATSAPP

Aplikasi dapat membaca format sederhana.

Contoh:

```text
desi cks 5kg
wanto cks 2.5
yadi sepatu 2
```

Keterangan:

```text
desi
wanto
yadi
```

Merupakan nama customer atau referensi.

Bukan nama karyawan.

---

# 📋 CONTOH HASIL PEMBACAAN

Input:

```text
desi cks 5kg
wanto cks 2.5
yadi sepatu 2
```

Hasil:

```text
CKS
5 KG

CKS
2.5 KG

SEPATU
2 SATUAN
```

Nama customer digunakan sebagai:

```text
Referensi laporan
Pencocokan nota
Data transaksi
```

Nama customer tidak wajib ditampilkan pada nota singkat.

---

# 🧾 NOTA SINGKAT

Contoh:

```text
=====================

CKS
5 KG

CKS
2.5 KG

SEPATU
2 PCS

---------------------

SUB TOTAL 1

---------------------

TOTAL

=====================
```

Nama customer dapat disembunyikan.

---

# 👁️ SWITCH NOMINAL KOMISI

Aplikasi memiliki tombol switch untuk:

```text
Tampilkan Komisi
```

Jika aktif:

```text
Item
Jumlah
Komisi
Total Komisi
```

Jika dimatikan:

```text
Item
Jumlah
```

Nominal komisi tidak akan tampil pada:

* Laporan
* Print
* PDF
* JPG
* WhatsApp

---

# 📊 LAPORAN HARIAN

Laporan pekerjaan per hari.

Contoh:

```text
Tanggal

Jumlah Item
Jumlah KG
Jumlah Satuan

Total Komisi

Karyawan A
Karyawan B
Karyawan C
```

---

# 📅 LAPORAN BULANAN

Menampilkan:

```text
Total Pekerjaan

Total KG

Total Satuan

Total Komisi

Per Karyawan

Per Item

Per Tier
```

---

# 🖨️ CETAK THERMAL 58MM

Mendukung format printer thermal.

Ukuran:

```text
58mm
```

Digunakan untuk:

```text
Cetak Harian
Cetak Komisi
Cetak Rekap
```

---

# 📱 EXPORT LAPORAN

Mendukung:

```text
Print
PDF
JPG
WhatsApp
```

Format laporan dioptimalkan untuk HP.

---

# 📤 SHARE WHATSAPP

Contoh hasil:

```text
LAPORAN HARIAN

Tanggal:
14 September 2026

CKS
7.5 KG

SEPATU
2 PCS

TOTAL PEKERJAAN

9.5 ITEM
```

Jika switch komisi aktif:

```text
TOTAL KOMISI

Rp 25.000
```

Jika switch komisi mati:

```text
Nominal komisi tidak ditampilkan.
```

---

# 💾 DATABASE OFFLINE

Aplikasi menggunakan:

```text
IndexedDB
```

Data tetap tersimpan walaupun:

```text
Internet mati
HP offline
Laptop offline
```

Data utama tetap berada di perangkat.

---

# ☁️ SISTEM BACKUP

Mendukung:

```text
Backup JSON
Restore JSON
Backup Google Sheet
Sinkronisasi Google Sheet
```

Arsitektur utama:

```text
IndexedDB

↓
Data Lokal

↓
Internet Tersedia

↓
Sinkronisasi
```

---

# 🔄 SISTEM OFFLINE FIRST

Prioritas aplikasi:

```text
1. IndexedDB

2. Cache

3. Sinkronisasi Online
```

Dengan sistem tersebut aplikasi tetap dapat digunakan tanpa internet.

---

# 📲 PWA

Aplikasi dapat di-install.

Contoh:

```text
Chrome Android

Install App
```

atau:

```text
Desktop Chrome

Install Laundry Manager
```

Setelah di-install aplikasi dapat dibuka seperti aplikasi biasa.

---

# 🗂️ STRUKTUR FILE

```text
LAUNDRY-MANAGER/

│
├── index.html
│
├── style.css
│
├── app.js
│
├── manifest.json
│
├── service-worker.js
│
├── README.md
│
└── icons/
    │
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── icon-192x192-maskable.png
    │
    └── icon-512x512-maskable.png
```

---

# 🚀 CARA MENJALANKAN

## LOCAL

Buka menggunakan:

```text
localhost
```

Contoh:

```text
VS Code
Live Server
```

---

# 🌐 GITHUB PAGES

Upload semua file ke repository GitHub.

Masuk:

```text
Repository

↓

Settings

↓

Pages
```

Pilih:

```text
Deploy from branch

↓

main

↓

root
```

Simpan.

Aplikasi akan tersedia melalui GitHub Pages.

---

# 📲 INSTALL PWA

Setelah GitHub Pages aktif:

Buka aplikasi menggunakan Chrome.

Kemudian pilih:

```text
Install App
```

atau:

```text
Add to Home Screen
```

---

# 🔄 UPDATE APLIKASI

Jika ada perubahan kode:

Ubah versi cache pada:

```javascript
service-worker.js
```

Contoh:

```javascript
const CACHE_NAME =
'laundry-manager-v3.0.1';
```

Kemudian upload kembali ke GitHub.

---

# 🔐 KEAMANAN DATA

Aplikasi menggunakan:

```text
Local Database
IndexedDB
```

Data tidak dikirim otomatis ke server.

Sinkronisasi hanya dilakukan jika fitur sinkronisasi diaktifkan.

---

# ⚠️ CATATAN PENTING

Backup tetap disarankan.

Gunakan:

```text
Backup JSON
```

Secara berkala.

Contoh:

```text
Backup Harian

Backup Mingguan

Backup Bulanan
```

---

# 🧺 LAUNDRY MANAGER

PWA Offline First

Version:

```text
V3 FINAL
```

Platform:

```text
Android
iOS
Windows
Desktop
Tablet
```

Status:

```text
Offline Ready

PWA Ready

IndexedDB Ready

GitHub Ready
```
