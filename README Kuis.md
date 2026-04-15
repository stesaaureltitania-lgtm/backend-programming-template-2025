# Gacha System API - Backend Programming Kuis

Dibangun menggunakan Express.js, MongoDB, dan mengikuti template [backend-programming-template-2025](https://github.com/jansonh/backend-programming-template-2025).

## Fitur

- Setiap user maksimal **5 kali gacha per hari**.
- Hadiah terbatas berdasarkan kuota periode (bukan per hari).
- Semua percobaan gacha dan hadiah yang dimenangkan disimpan di MongoDB.
- **Bonus**:
  - Histori gacha per user.
  - Daftar hadiah & sisa kuota.
  - Daftar pemenang dengan **nama samar acak**.

## Cara Menjalankan

1. Clone repository ini.
2. Install dependencies: `npm install`
3. Pastikan MongoDB berjalan (lokal atau Atlas).
4. Buat file `.env` di root folder:
   ```env
   PORT=5000
   DB_CONNECTION=mongodb://localhost:27017/
   DB_NAME=demo_db
   ```
5. Jalankan server: npm run dev
6. Server berjalan di localhost:5000

## Petunjuk Penggunaan Endpoint Gacha

Semua endpoint diawali dengan prefix /api.
Contoh: localhost:5000/api/gacha

1. Lakukan Gacha (Undian)
   Method: POST
   URL: /gacha
   Headers: Content-Type: application/json
   Body (raw JSON):

2. Histori Gacha User
   Method: GET
   URL: /gacha/history?userId=Stesa

3. Daftar Hadiah & Sisa Kuota
   Method: GET
   URL: /gacha/prizes

4. Daftar Pemenang (Nama Samar Acak)
   Method: GET
   URL: /gacha/winners

5. { "user_id": "string", "user_name": "string" }
   Catatan: user_id dan user_name wajib diisi. Maksimal gacha adalah 5 kali per hari untuk setiap user.

## Cara Menambahkan Endpoint Baru di Gacha

Misal ingin menambahkan endpoint GET /gacha/total-attempts untuk melihat total percobaan semua user.
Langkah-langkah:

1. Buka gacha-controller.js, tambahkan fungsi:
   async function getTotalAttempts(req, res, next) {
   try {
   const total = await gachaService.getTotalAttempts();
   return res.status(200).json({ total });
   } catch (error) {
   return next(error);
   }
   }
2. Buka gacha-service.js, tambahkan fungsi:
   async function getTotalAttempts() {
   return gachaRepository.getTotalAttempts();
   }
   lalu ekspor di module.exports.
3. Buka gacha-repository.js, tambahkan fungsi:
   async function getTotalAttempts() {
   return GachaAttempt.countDocuments();
   }
   lalu ekspor.
4. Buka gacha-route.js, daftarkan route:
   route.get('/total-attempts', gachaController.getTotalAttempts);
5. Restart server, lalu akses GET /api/gacha/total-attempts.
   Pola ini berlaku untuk semua endpoint baru di komponen Gacha.
