Saya sedang mengerjakan submission Dicoding kelas **Belajar Penerapan AI di Aplikasi Web**, dengan proyek bernama **Root Fact App**.

Di workspace ini sudah terdapat **starter project React resmi dari Dicoding**. Tugas Anda adalah melengkapi starter project tersebut secara langsung hingga memenuhi seluruh kriteria **Advanced (4 points / Bintang 5)**.

Jangan hanya menjelaskan kode. Lakukan audit repository, edit file yang diperlukan, tambahkan file yang diwajibkan, lalu pastikan proyek dapat dijalankan dan dibangun.

# TUJUAN APLIKASI

Root Fact App adalah aplikasi web yang memiliki dua fitur utama:

1. **Si Mata — Computer Vision**

   * Mengakses kamera pengguna.
   * Mendeteksi jenis sayuran secara real-time.
   * Menggunakan TensorFlow.js dan pretrained model yang sudah disediakan pada starter project.

2. **Si Otak — Generative AI**

   * Menerima label hasil deteksi sayuran.
   * Membuat fun fact unik dan relevan.
   * Menggunakan Transformers.js yang berjalan secara lokal di browser.

Aplikasi juga wajib:

* Menggunakan React.
* Dapat diinstal sebagai PWA.
* Tetap dapat dibuka tanpa internet.
* Mampu menjalankan deteksi model secara offline setelah aset dan model masuk cache.
* Siap di-deploy ke Netlify.

# ATURAN UTAMA

1. Gunakan starter project yang tersedia sebagai dasar.
2. Jangan mengganti struktur proyek secara total.
3. Jangan membuat ulang proyek dari nol jika starter project sudah berfungsi.
4. Jangan menggunakan backend server untuk proses AI.
5. Seluruh inference AI harus berjalan secara lokal di browser.
6. Computer Vision wajib menggunakan TensorFlow.js.
7. Generative AI wajib menggunakan Transformers.js.
8. Jangan menggunakan library AI selain TensorFlow.js dan Transformers.js.
9. Jangan mengganti pretrained model yang sudah disediakan starter project.
10. Jangan menggunakan API eksternal seperti OpenAI, Gemini, Hugging Face Inference API, atau layanan AI cloud.
11. Jangan hardcode fun fact statis berdasarkan label.
12. Jangan mengirimkan JavaScript yang sudah di-minify.
13. Jangan memasukkan folder `node_modules` ke hasil submission.
14. Jangan menghapus komentar atau TODO penting sebelum memastikan implementasinya selesai.
15. Jangan menghapus file model, metadata, manifest, atau aset yang disediakan.
16. Gunakan JavaScript atau TypeScript sesuai bahasa starter project saat ini.
17. Jangan mengonversi seluruh proyek ke bahasa lain tanpa kebutuhan.
18. Pertahankan desain utama starter project, tetapi rapikan UI jika diperlukan.
19. Jangan mengubah pretrained model atau label pada `metadata.json`.
20. Semua fitur harus benar-benar terhubung ke UI, bukan sekadar fungsi yang tidak dipakai.

# LANGKAH PERTAMA — AUDIT REPOSITORY

Sebelum menulis kode:

1. Baca seluruh struktur proyek.
2. Identifikasi:

   * Framework dan versinya.
   * Entry point aplikasi.
   * Komponen React.
   * Lokasi file model TensorFlow.js.
   * Lokasi `model.json`.
   * Lokasi file `.bin`.
   * Lokasi `metadata.json`.
   * Implementasi kamera yang sudah tersedia.
   * TODO yang masih belum selesai.
   * Konfigurasi Vite, Webpack, atau bundler yang digunakan.
   * Konfigurasi PWA atau Workbox yang sudah ada.
   * File manifest.
   * Service worker.
   * Konfigurasi ESLint.
3. Jalankan pemeriksaan awal:

   * `npm install`
   * `npm run lint`, jika script tersedia.
   * `npm run build`
4. Jangan menghapus dependency yang diperlukan starter project.
5. Setelah audit, lanjutkan implementasi secara langsung.

# RUBRIK PENILAIAN

Target akhir adalah:

* Kriteria 1: Advanced — 4 pts.
* Kriteria 2: Advanced — 4 pts.
* Kriteria 3: Advanced — 4 pts.
* Nilai akhir: 4 atau Bintang 5.

Karena level Advanced bersifat kumulatif, seluruh poin Basic dan Skilled juga wajib dipenuhi.

---

# KRITERIA 1 — DETEKSI SAYURAN DENGAN TENSORFLOW.JS

## Basic — wajib dipenuhi

1. Aplikasi harus meminta izin kamera menggunakan MediaStream API.
2. Streaming kamera harus tampil di UI.
3. TensorFlow.js model harus berhasil dimuat.
4. Jangan membiarkan error loading model pada console.
5. Aplikasi harus melakukan prediksi terhadap frame kamera.
6. Label nama sayuran harus muncul secara otomatis di UI.
7. Label harus berasal dari hasil prediksi model.
8. Gunakan label sesuai metadata model.
9. UI harus tetap memberikan informasi ketika belum ada objek yang terdeteksi.
10. Berikan pesan yang jelas jika izin kamera ditolak.

## Skilled — wajib dipenuhi

Selain seluruh poin Basic:

### FPS Limit

1. Terapkan FPS limit pada prediction loop.
2. FPS limit harus dapat dikonfigurasi melalui:

   * UI, atau
   * constant/configuration yang jelas di kode.
3. Lebih baik sediakan kontrol UI seperti dropdown atau slider:

   * 5 FPS.
   * 10 FPS.
   * 15 FPS.
4. Jangan menjalankan inference pada setiap frame `requestAnimationFrame` tanpa pembatasan.
5. Gunakan timing berdasarkan `performance.now()` atau mekanisme setara.
6. Pastikan prediction loop tidak berjalan ganda.
7. Batalkan loop saat komponen unmount.

### Loading progress

1. Tampilkan status ketika model sedang dimuat.
2. Gunakan pesan seperti:

   * `Menunggu Model...`
   * `Memuat Model...`
3. Sertakan persentase loading.
4. Progress tidak boleh hanya spinner tanpa angka.
5. Bila library menyediakan callback progress, gunakan callback tersebut.
6. Jika TensorFlow.js model loading tidak menyediakan progress byte secara langsung, implementasikan progress UI yang masuk akal berdasarkan tahap inisialisasi, tetapi jangan menampilkan progress palsu yang tidak pernah berubah.
7. Setelah model selesai, tampilkan status `Model siap`.

## Advanced — wajib dipenuhi

Selain seluruh poin Basic dan Skilled:

### Adaptive TensorFlow backend

1. Periksa dukungan WebGPU menggunakan:

```javascript
'navigator' in globalThis && 'gpu' in navigator
```

atau pengecekan setara yang aman.

2. Jika WebGPU tersedia:

   * Muat/register backend TensorFlow.js WebGPU.
   * Coba gunakan backend `webgpu`.
3. Jika WebGPU tidak tersedia atau gagal diinisialisasi:

   * Gunakan fallback otomatis ke `webgl`.
4. Jangan membuat aplikasi gagal total jika `tf.setBackend('webgpu')` melempar error.
5. Jalankan:

```javascript
await tf.setBackend(selectedBackend);
await tf.ready();
```

6. Tampilkan backend aktif pada UI atau status debug yang mudah diverifikasi.
7. Pastikan package backend yang diperlukan terpasang:

   * `@tensorflow/tfjs`
   * `@tensorflow/tfjs-backend-webgpu`
   * Backend WebGL dari TensorFlow.js.
8. Hindari mendaftarkan backend berulang kali setiap render.

Buat helper reusable, misalnya:

```javascript
async function initializeTensorFlowBackend() {
  // try WebGPU, fallback to WebGL
}
```

### Manajemen memori TensorFlow.js

1. Gunakan `tf.tidy()` pada setiap siklus prediksi jika memungkinkan.
2. Semua tensor intermediate harus dibersihkan.
3. Tensor hasil preprocess, resize, normalize, expandDims, dan prediction tidak boleh bocor.
4. Jika object tertentu tidak dapat dikelola oleh `tf.tidy()`, panggil `.dispose()` secara eksplisit.
5. Jangan dispose tensor yang masih diperlukan sebelum nilai prediksi dibaca.
6. Ambil nilai menggunakan `data()` atau `dataSync()` secara aman.
7. Setelah nilai disalin ke JavaScript biasa, dispose tensor prediksi.
8. Gunakan `tf.memory()` hanya untuk development/debug bila diperlukan.
9. Jangan menjalankan banyak prediction promise secara paralel.
10. Gunakan flag seperti `isPredictingRef` untuk mencegah inference overlap.
11. Hentikan seluruh track kamera saat komponen unmount:

```javascript
stream.getTracks().forEach((track) => track.stop());
```

12. Batalkan `requestAnimationFrame` atau timer yang aktif saat unmount.

### React architecture

1. Gunakan struktur komponen React yang jelas.
2. Pisahkan tanggung jawab minimal menjadi:

   * Camera/view component.
   * Model service atau AI service.
   * Detection state/controller hook.
   * Generative AI service.
   * PWA/service worker registration.
3. Hindari menempatkan seluruh logic dalam satu file `App`.
4. Gunakan custom hooks bila sesuai, misalnya:

   * `useCamera`
   * `useVegetableDetector`
   * `useTextGenerator`
5. Pastikan state dan lifecycle React ditangani dengan benar.
6. Jangan memperkenalkan state management library besar tanpa kebutuhan.

### Kondisi yang harus dihindari

Kriteria 1 akan gagal jika:

* Kamera tidak dapat diminta atau diakses.
* TensorFlow.js model gagal dimuat.
* Tidak ada label prediksi pada UI.
* Backend WebGPU tidak memiliki fallback.
* Tensor dibuat terus-menerus tanpa dispose.
* Tidak menggunakan React atau arsitektur MVP.

---

# KRITERIA 2 — FUN FACT DENGAN TRANSFORMERS.JS

## Basic — wajib dipenuhi

1. Gunakan Transformers.js lokal di browser.
2. Gunakan model yang sudah ditentukan atau disediakan starter project.
3. Jangan menggunakan layanan inference eksternal.
4. Label sayuran hasil deteksi harus dimasukkan secara dinamis ke prompt.
5. Jangan membuat mapping hardcoded berisi fun fact final untuk setiap sayuran.
6. Fun fact harus berubah sesuai label sayuran.
7. Tampilkan teks hasil generasi di UI.
8. Teks harus relevan dengan sayuran yang terdeteksi.
9. Tampilkan status loading ketika model teks atau proses generasi sedang berjalan.
10. Jangan memanggil model terus-menerus pada setiap frame kamera.

### Trigger generation yang aman

Implementasikan mekanisme agar fun fact tidak terus dibuat ulang setiap prediction frame.

Gunakan salah satu strategi berikut:

* Generate hanya ketika label stabil selama beberapa prediction.
* Generate hanya ketika label berubah.
* Gunakan debounce.
* Gunakan cooldown.
* Sediakan tombol `Generate Fun Fact` setelah label terdeteksi.

Strategi yang disarankan:

1. Simpan label terakhir yang sudah digenerasikan.
2. Tunggu label stabil dalam beberapa prediksi.
3. Jangan generate ulang jika label dan persona belum berubah.
4. Jika persona berubah, izinkan regenerate.
5. Gunakan request lock agar tidak ada dua proses generation bersamaan.

## Prompt

Gunakan prompt dalam bahasa Inggris karena keterbatasan model.

Prompt harus:

1. Menyertakan label sayuran.
2. Menyertakan persona aktif.
3. Meminta jawaban singkat.
4. Meminta jawaban relevan dan faktual.
5. Meminta model tidak mengulang prompt.
6. Mengarahkan output sesuai gaya bahasa yang dipilih.
7. Hasil akhir boleh tetap berbahasa Indonesia jika kemampuan model mendukung, tetapi instruksi prompt utama sebaiknya dalam bahasa Inggris.

Contoh prinsip:

```text
You are a friendly educational assistant.
The detected vegetable is: carrot.
Write one short and interesting fun fact about this vegetable.
Use a humorous style.
Keep the answer concise and do not repeat the instruction.
```

Sesuaikan dengan model dan task yang tersedia pada starter project.

## Skilled — wajib dipenuhi

Selain seluruh poin Basic:

### Copy to Clipboard

1. Tambahkan tombol `Salin`.
2. Gunakan:

```javascript
await navigator.clipboard.writeText(generatedText);
```

3. Tombol hanya aktif jika teks tersedia.
4. Tampilkan feedback:

   * `Tersalin`
   * atau notifikasi setara.
5. Tangani error jika clipboard API tidak tersedia.
6. Sediakan fallback yang ramah jika browser menolak akses clipboard.

### Generation parameters

Atur parameter berikut secara eksplisit:

* `temperature`
* `max_new_tokens`
* `top_p`
* `do_sample`

Ketentuan:

1. `max_new_tokens` maksimal 150.
2. Gunakan nilai default yang realistis untuk browser.
3. Hindari nilai yang menyebabkan browser freeze.
4. Gunakan model quantized jika starter mendukung.
5. Pertimbangkan konfigurasi:

```javascript
{ dtype: 'q4' }
```

jika kompatibel dengan model dan Transformers.js yang digunakan.

6. Jangan menulis opsi yang tidak didukung pipeline.
7. Sesuaikan object result berdasarkan jenis pipeline Transformers.js.
8. Bersihkan prefix prompt dari output jika model mengembalikan prompt bersama hasil.
9. Batasi output agar tetap berupa fun fact ringkas.

Gunakan default yang kurang lebih aman:

```javascript
{
  max_new_tokens: 80,
  temperature: 0.8,
  top_p: 0.9,
  do_sample: true
}
```

Nilai boleh disesuaikan berdasarkan model.

## Advanced — wajib dipenuhi

Selain seluruh poin Basic dan Skilled:

### Persona dinamis

1. Tambahkan dropdown atau radio group untuk memilih persona.
2. Minimal sediakan:

   * Lucu.
   * Sejarah.
3. Lebih baik tambahkan satu persona relevan lain, seperti:

   * Ilmiah.
   * Anak-anak.
4. Pilihan persona harus mengubah prompt secara dinamis.
5. Persona tidak boleh hanya mengubah styling UI.
6. Tampilkan persona aktif.
7. Bila persona berubah setelah fun fact tersedia:

   * Sediakan regenerate otomatis yang terkendali, atau
   * Sediakan tombol regenerate.
8. Jangan menyimpan hasil fun fact statis berdasarkan persona.

Contoh mapping instruksi prompt:

```javascript
const personaInstructions = {
  funny: 'Write in a playful and humorous style.',
  history: 'Focus on historical origin or historical use.',
  science: 'Focus on an easy-to-understand scientific fact.',
};
```

Mapping instruksi diperbolehkan. Yang tidak diperbolehkan adalah hardcode teks fun fact final.

### Adaptive Transformers.js backend

1. Periksa `navigator.gpu`.
2. Jika tersedia, coba gunakan WebGPU.
3. Jika tidak tersedia atau gagal, fallback ke backend alternatif yang didukung Transformers.js, misalnya WASM.
4. Rubrik menyebut fallback WebGL. Namun Transformers.js umumnya menggunakan WebGPU atau WASM, bukan TensorFlow.js WebGL.
5. Implementasikan fallback yang benar-benar kompatibel dengan versi Transformers.js di starter project.
6. Jangan memaksakan opsi device yang membuat runtime error.
7. Jika API Transformers.js versi proyek mendukung `device: 'webgpu'`, gunakan itu.
8. Jika WebGPU gagal, inisialisasi ulang pipeline tanpa `device: 'webgpu'` agar memakai fallback default/WASM.
9. Dokumentasikan dalam kode bahwa:

   * TensorFlow.js memakai WebGPU → WebGL.
   * Transformers.js memakai WebGPU → fallback runtime yang kompatibel.
10. Jangan membuat aplikasi crash jika perangkat tidak memiliki WebGPU.
11. Tampilkan backend atau device aktif untuk proses generative AI di UI atau status debug.

Buat service reusable, misalnya:

```javascript
async function createTextGenerationPipeline(onProgress) {
  // try WebGPU first, then fallback
}
```

### Model loading progress

Walaupun tidak disebut secara eksplisit pada Kriteria 2, tampilkan progress loading model Transformers.js agar pengguna memahami proses download awal.

Gunakan callback `progress_callback` atau API setara jika tersedia.

Tampilkan:

* File yang sedang dimuat, jika tersedia.
* Persentase.
* Status siap.
* Pesan error yang jelas.

### Kondisi yang harus dihindari

Kriteria 2 akan gagal jika:

* Fun fact bersifat statis.
* Semua sayuran menghasilkan teks sama.
* Transformers.js tidak digunakan.
* Label tidak dimasukkan ke prompt.
* Teks tidak muncul di UI.
* Persona hanya mengubah warna atau icon.
* Tidak ada fallback saat WebGPU gagal.

---

# KRITERIA 3 — OFFLINE CAPABILITY, PWA, DAN DEPLOYMENT

## Basic — wajib dipenuhi

1. Aplikasi harus dapat dibangun untuk production.
2. Aplikasi harus siap di-deploy ke Netlify.
3. Gunakan Web App Manifest yang valid.
4. Gunakan Service Worker melalui Workbox.
5. Lakukan precache terhadap aset inti:

   * HTML.
   * CSS.
   * JavaScript.
   * Icon.
   * Aset lokal penting.
6. Aplikasi harus tetap dapat dibuka setelah koneksi internet dimatikan.
7. Jangan membiarkan route production menghasilkan 404.
8. Tambahkan konfigurasi Netlify untuk SPA redirect jika diperlukan.
9. Buat `STUDENT.txt`.
10. Isi `STUDENT.txt` dengan placeholder URL bila URL final belum diketahui:

```text
Nama: Farrel Athalla M
URL Deployment: <ISI_SETELAH_DEPLOY_KE_NETLIFY>
```

11. Jangan mengarang URL Netlify.
12. Beri tahu saya bahwa URL tersebut harus diganti setelah deployment.

## Web App Manifest

Manifest minimal harus memiliki:

* `name`
* `short_name`
* `description`
* `start_url`
* `display`
* `background_color`
* `theme_color`
* Icons dengan ukuran yang sesuai.
* Minimal icon 192×192.
* Minimal icon 512×512.

Gunakan:

```json
"display": "standalone"
```

Pastikan:

1. Path icon benar.
2. Icon benar-benar tersedia.
3. Manifest ditautkan pada HTML.
4. DevTools Application dapat mendeteksi manifest.
5. `start_url` kompatibel dengan deployment Netlify.
6. Scope valid.

## Workbox dan Service Worker

Gunakan konfigurasi Workbox sesuai bundler proyek.

Pilihan yang diperbolehkan:

* `vite-plugin-pwa` berbasis Workbox.
* Workbox build plugin.
* Service worker custom dengan Workbox.

Utamakan cara yang paling sesuai dengan struktur starter project.

Ketentuan:

1. Jangan membuat dua service worker aktif secara bersamaan.
2. Registrasi service worker hanya sekali.
3. Tangani update service worker secara aman.
4. Pastikan build production menghasilkan service worker.
5. Jangan bergantung hanya pada service worker development.
6. Jangan cache response error atau HTML fallback sebagai file model.
7. Gunakan cache versioning yang jelas.
8. Hindari cache tanpa batas.

## Skilled — wajib dipenuhi

Selain seluruh poin Basic:

### ESLint

1. Pastikan konfigurasi ESLint tersedia.
2. Tambahkan script:

```json
"lint": "eslint ."
```

atau script setara.

3. Pastikan file source utama lolos lint.
4. Jangan menonaktifkan seluruh rule secara global hanya agar lint lolos.
5. Perbaiki warning penting:

   * Unused variables.
   * Missing React hook dependencies.
   * Undefined variables.
   * Promise yang tidak ditangani.
6. Jangan lint folder:

   * `node_modules`
   * `dist`
   * output build
   * file model binary

### Installable PWA

1. Browser harus mengenali aplikasi sebagai installable.
2. Manifest valid.
3. Service worker aktif.
4. App disajikan melalui HTTPS saat production.
5. Tampilkan tombol install bila memungkinkan dengan event:

```javascript
beforeinstallprompt
```

6. Simpan event tersebut dan panggil `prompt()` ketika user menekan tombol install.
7. Tangani kondisi browser tidak menyediakan event install.
8. Tombol install boleh disembunyikan jika aplikasi sudah terpasang.
9. Pastikan tampilan tetap layak dalam mode standalone.

## Advanced — wajib dipenuhi

Selain seluruh poin Basic dan Skilled:

### Offline AI model

1. Precache model TensorFlow.js:

   * `model.json`
   * Seluruh file `.bin` yang direferensikan model.
   * `metadata.json`
2. Pastikan URL file model sesuai path production.
3. Jangan hanya cache `model.json` tanpa weight `.bin`.
4. Pastikan file model termasuk dalam build output.
5. Jika file model berada di folder `public`, pertahankan struktur URL.
6. Gunakan Workbox precache atau additional manifest entries.
7. Untuk file model besar, pertimbangkan runtime caching dengan strategi yang benar jika precache build memiliki batas ukuran.
8. Karena rubric secara eksplisit meminta precaching model, prioritaskan memasukkan model ke precache manifest.
9. Jika Workbox menolak file karena ukuran maksimum:

   * Naikkan `maximumFileSizeToCacheInBytes` secara wajar.
   * Jangan menghapus model dari cache.
10. Cache file Transformers.js yang benar-benar dibutuhkan untuk offline jika realistis dan dapat diidentifikasi.
11. Minimal seluruh file model Computer Vision harus offline.
12. Hindari bergantung pada CDN untuk library inti jika aplikasi harus benar-benar offline.
13. Gunakan dependency npm yang dibundle, bukan `<script>` CDN, jika starter React mendukung.
14. Jika model generative AI diunduh dari Hugging Face saat runtime:

* Terapkan cache browser/Cache Storage yang kompatibel bila memungkinkan.
* Jangan menjanjikan generative AI offline jika file model belum benar-benar dicache.

15. Rubrik Advanced secara eksplisit menilai offline AI model deteksi. Pastikan TensorFlow.js detection terbukti berjalan offline setelah cache terisi.

### Offline page behavior

1. Setelah aplikasi dibuka sekali secara online dan cache terisi:

   * Matikan internet.
   * Reload aplikasi.
   * UI harus tetap terbuka.
   * Kamera tetap dapat digunakan.
   * Model TensorFlow.js harus dapat dimuat dari cache.
   * Deteksi sayuran tetap dapat berjalan.
2. Jangan menampilkan halaman putih.
3. Sediakan status online/offline di UI menggunakan:

   * `navigator.onLine`
   * event `online`
   * event `offline`
4. Status ini bersifat tambahan dan relevan terhadap rubric.
5. Jangan membuat deteksi bergantung pada network request setelah file masuk cache.

### Netlify

Tambahkan file konfigurasi yang sesuai, misalnya:

`netlify.toml`

Contoh prinsip:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Sesuaikan folder publish berdasarkan bundler.

Jangan memakai `dist` jika proyek sebenarnya menghasilkan `build`.

Pastikan:

1. Build command benar.
2. Publish directory benar.
3. SPA refresh tidak 404.
4. Asset service worker dapat diakses.
5. Header tidak mencegah service worker bekerja.
6. `STUDENT.txt` ikut berada di ZIP submission.

### Kondisi yang harus dihindari

Kriteria 3 akan gagal jika:

* Tidak ada URL Netlify production.
* Manifest tidak valid.
* Service worker tidak aktif.
* App blank ketika offline.
* URL tidak dicantumkan di `STUDENT.txt`.
* Model `.json` dan `.bin` tidak masuk cache.
* Aplikasi tidak installable.
* Tidak ada konfigurasi ESLint.

---

# UI DAN UX YANG WAJIB TERLIHAT

Pastikan UI memiliki:

1. Judul Root Fact App.
2. Area kamera.
3. Tombol mulai atau aktifkan kamera bila diperlukan.
4. Status izin kamera.
5. Status loading TensorFlow model.
6. Persentase loading model.
7. Status backend TensorFlow aktif.
8. Kontrol FPS.
9. Label sayuran yang terdeteksi.
10. Confidence score jika tersedia.
11. Status label stabil.
12. Pilihan persona.
13. Tombol Generate atau Regenerate Fun Fact.
14. Status loading Transformers.js.
15. Persentase loading model teks jika tersedia.
16. Backend/device generative AI aktif.
17. Hasil fun fact.
18. Tombol Copy to Clipboard.
19. Tombol install PWA jika tersedia.
20. Status online/offline.
21. Pesan error yang ramah.

Jangan membuat desain terlalu rumit. Fokus pada kejelasan fungsi dan stabilitas.

# ERROR HANDLING

Tangani minimal kondisi berikut:

## Kamera

* Browser tidak mendukung `getUserMedia`.
* Permission ditolak.
* Tidak ada kamera.
* Stream berhenti.
* Video belum siap.
* Komponen unmount.

## TensorFlow.js

* Backend WebGPU gagal.
* Backend WebGL gagal.
* Model gagal dimuat.
* Metadata gagal dimuat.
* Prediction error.
* Bentuk input model tidak sesuai.
* Tensor memory leak.
* Prediction overlap.

## Transformers.js

* Model gagal dimuat.
* WebGPU gagal.
* Fallback gagal.
* Generate dipanggil tanpa label.
* Pipeline belum siap.
* Result format berbeda.
* Clipboard gagal.
* Proses generation berjalan ganda.

## PWA

* Service worker registration gagal.
* Manifest asset tidak ditemukan.
* Install prompt tidak tersedia.
* Offline cache belum siap.
* Model file tidak ditemukan dalam cache.

Tampilkan pesan yang ramah di UI dan detail teknis secukupnya di console.

# KEAMANAN DAN PRIVASI

1. Jangan mengunggah frame kamera ke server.
2. Jelaskan di UI bahwa inference dilakukan lokal di perangkat.
3. Jangan menyimpan gambar kamera tanpa izin.
4. Jangan menambahkan analytics atau tracking.
5. Jangan hardcode credential.
6. Jangan memasukkan API key.
7. Jangan meminta token Hugging Face jika pretrained model starter tidak membutuhkannya.
8. Jika model Transformers.js membutuhkan file publik, gunakan akses publik yang disediakan oleh model starter.

# KINERJA

1. Jangan menjalankan deteksi sebelum:

   * Video siap.
   * TensorFlow backend siap.
   * Model siap.
2. Gunakan FPS limit.
3. Jangan membuat ulang model pada setiap render.
4. Simpan model menggunakan `useRef`, singleton service, atau resource reusable.
5. Hindari rerender React pada setiap operasi tensor internal.
6. Hanya update state UI ketika diperlukan.
7. Gunakan confidence threshold jika sesuai.
8. Jangan generate fun fact untuk prediksi tidak stabil.
9. Batasi `max_new_tokens` maksimal 150.
10. Gunakan quantized model jika kompatibel.
11. Lazy-load model generative AI jika membantu initial loading.
12. Pastikan lazy loading tidak merusak offline caching.

# FILE YANG KEMUNGKINAN PERLU DIBUAT ATAU DIUBAH

Sesuaikan dengan struktur aktual proyek, tetapi kemungkinan mencakup:

* `src/App.jsx` atau `src/App.tsx`
* Komponen kamera.
* Komponen detection result.
* Komponen fun fact.
* Custom hooks.
* TensorFlow service.
* Transformers service.
* PWA install component.
* Online/offline status component.
* `src/main.jsx`
* `package.json`
* ESLint config.
* Vite config.
* PWA config.
* `manifest.webmanifest`
* Service worker atau Workbox config.
* `netlify.toml`
* `STUDENT.txt`
* CSS.
* Public icons.
* Public model assets.

Jangan membuat nama file secara duplikatif jika file serupa sudah tersedia.

# DEPENDENCY

Gunakan dependency dengan versi yang kompatibel dengan starter project.

Minimal audit kebutuhan berikut:

```json
{
  "@tensorflow/tfjs": "...",
  "@tensorflow/tfjs-backend-webgpu": "...",
  "@huggingface/transformers": "...",
  "react": "...",
  "react-dom": "..."
}
```

Gunakan package Transformers.js yang memang sesuai dengan starter project.

Jangan memasang dua package Transformers.js berbeda tanpa alasan.

Untuk PWA, gunakan dependency yang sesuai, misalnya:

```json
{
  "vite-plugin-pwa": "...",
  "workbox-window": "..."
}
```

Gunakan hanya jika proyek memakai Vite dan cocok dengan struktur saat ini.

# TESTING MANUAL YANG HARUS DIDUKUNG

Pastikan aplikasi dapat diuji dengan langkah berikut:

## Test kamera dan TensorFlow.js

1. Buka aplikasi.
2. Izinkan kamera.
3. Tunggu model selesai dimuat.
4. Pastikan progress mencapai 100%.
5. Pastikan backend aktif ditampilkan.
6. Arahkan kamera ke sayuran.
7. Pastikan label dan confidence muncul.
8. Ubah FPS limit.
9. Pastikan aplikasi tetap responsif.

## Test fallback

1. Jalankan pada browser tanpa WebGPU.
2. Pastikan TensorFlow.js fallback ke WebGL.
3. Pastikan Transformers.js fallback ke runtime yang kompatibel.
4. Pastikan aplikasi tidak crash.

## Test fun fact

1. Deteksi satu sayuran.
2. Pilih persona Lucu.
3. Generate fun fact.
4. Pastikan label masuk ke prompt.
5. Pastikan hasil muncul.
6. Klik Salin.
7. Ubah persona ke Sejarah.
8. Generate ulang.
9. Pastikan gaya output berubah.

## Test PWA

1. Jalankan production build.
2. Buka melalui HTTPS atau localhost.
3. Periksa DevTools Application.
4. Pastikan manifest terdeteksi.
5. Pastikan service worker aktif.
6. Pastikan tombol install tersedia jika browser mendukung.
7. Install aplikasi.
8. Pastikan mode standalone berfungsi.

## Test offline

1. Buka aplikasi secara online.
2. Tunggu seluruh aset dan model selesai dimuat.
3. Periksa Cache Storage.
4. Pastikan model JSON dan BIN ada.
5. Aktifkan mode offline.
6. Reload.
7. Pastikan aplikasi tetap terbuka.
8. Pastikan kamera dapat digunakan.
9. Pastikan model deteksi dimuat dari cache.
10. Pastikan prediksi tetap berfungsi.

# VALIDASI OTOMATIS

Setelah implementasi:

1. Jalankan:

```bash
npm install
npm run lint
npm run build
```

2. Jika script test tersedia, jalankan juga:

```bash
npm test
```

3. Perbaiki seluruh build error.
4. Perbaiki seluruh lint error.
5. Jangan menganggap warning PWA, Workbox, atau asset size aman tanpa memeriksanya.
6. Pastikan build output memiliki:

   * `index.html`
   * bundled JS/CSS
   * manifest
   * icons
   * service worker
   * model JSON
   * model BIN
   * metadata
7. Cari seluruh:

   * `TODO`
   * `FIXME`
   * `pass`
   * placeholder function
   * hardcoded dummy result
8. Hapus TODO hanya jika sudah benar-benar diselesaikan.
9. Jangan menghapus TODO yang menjelaskan pekerjaan manual seperti URL Netlify; ubah menjadi placeholder jelas.

# CHECKLIST RUBRIK YANG WAJIB DIBUAT CODEX

Setelah selesai, berikan tabel dengan kolom:

* Kriteria.
* Level.
* Requirement.
* Status.
* File implementasi.
* Fungsi atau komponen.
* Cara verifikasi.
* Pekerjaan manual yang tersisa.

Checklist minimal harus mencakup:

## Kriteria 1

* Kamera aktif.
* TensorFlow.js model loaded.
* Label otomatis.
* FPS limit.
* Loading percentage.
* WebGPU detection.
* WebGL fallback.
* `tf.tidy()` atau dispose.
* React architecture.

## Kriteria 2

* Label masuk ke prompt.
* Transformers.js lokal.
* Fun fact dinamis.
* Copy to Clipboard.
* Temperature.
* max_new_tokens.
* top_p.
* do_sample.
* Persona Lucu.
* Persona Sejarah.
* WebGPU detection.
* Fallback generative model.

## Kriteria 3

* Netlify-ready.
* Manifest valid.
* Workbox service worker.
* Core asset precache.
* `STUDENT.txt`.
* ESLint.
* Installable PWA.
* Model JSON precache.
* Model BIN precache.
* Offline detection.

Jangan tandai selesai jika implementasinya belum ada atau belum berhasil divalidasi.

# KETENTUAN BERKAS SUBMISSION

Hasil akhir submission berupa ZIP folder proyek.

Sebelum membuat ZIP:

1. Hapus folder `node_modules`.
2. Jangan hapus source code.
3. Jangan kirim hanya folder build.
4. Jangan minify source code secara manual.
5. Sertakan:

   * Seluruh source code.
   * `package.json`.
   * Lockfile.
   * Konfigurasi bundler.
   * ESLint config.
   * Manifest.
   * Service worker/PWA config.
   * Model dan metadata.
   * Assets.
   * `STUDENT.txt`.
   * `netlify.toml`.
6. Folder hasil build boleh disertakan jika memang diperlukan, tetapi source project wajib tetap ada.
7. Jangan memasukkan credential atau file rahasia.

# STUDENT.TXT

Buat file `STUDENT.txt` dengan format:

```text
Nama: Farrel Athalla M
Kelas: Belajar Penerapan AI di Aplikasi Web
Proyek: Root Fact App
URL Deployment: <ISI_URL_NETLIFY_SETELAH_DEPLOY>
```

Jangan membuat URL palsu.

# OUTPUT AKHIR YANG SAYA INGINKAN

Setelah mengedit proyek, berikan:

1. Ringkasan arsitektur.
2. Daftar file yang dibuat.
3. Daftar file yang diubah.
4. Penjelasan singkat alur TensorFlow.js.
5. Penjelasan singkat alur Transformers.js.
6. Penjelasan adaptive backend.
7. Penjelasan memory management.
8. Penjelasan PWA dan Workbox.
9. Daftar model file yang masuk precache.
10. Hasil `npm run lint`.
11. Hasil `npm run build`.
12. Checklist rubric lengkap.
13. Langkah menjalankan development server.
14. Langkah preview production build.
15. Langkah deploy ke Netlify.
16. Langkah mengisi URL ke `STUDENT.txt`.
17. Langkah menguji offline mode.
18. Langkah menguji installable PWA.
19. Risiko atau keterbatasan yang masih ada.
20. Daftar pekerjaan manual yang masih harus saya lakukan.

Jangan mengklaim deployment Netlify sudah selesai jika Anda tidak benar-benar memiliki akses untuk melakukan deployment.

Jangan membuat URL deployment palsu.

Kerjakan file secara langsung, bukan hanya memberikan potongan kode.
