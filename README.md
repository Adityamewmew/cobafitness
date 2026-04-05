# AI Food Analysis Project

Project ini terdiri dari React frontend dan Express backend yang menggunakan API Gemini 2.0 Flash Lite untuk menganalisis gambar makanan dan menghitung kalori.

## Persiapan
1. Dapatkan API Key Gemini dari [Google AI Studio](https://aistudio.google.com/).
2. Masukkan API Key tersebut ke dalam file `backend/.env`:
   ```bash
   GEMINI_API_KEY=YOUR_KEY_HERE
   ```

## Cara Menjalankan

### Backend
1. Masuk ke folder backend: `cd backend`
2. Jalankan: `npm run dev` (berjalan di http://localhost:5000)

### Frontend
1. Masuk ke folder frontend: `cd frontend`
2. Jalankan: `npm run dev` (berjalan di http://localhost:5173 atau port lain yang muncul)

## Fitur
- Upload gambar makanan.
- Analisis otomatis nama makanan, jumlah kalori, dan ringkasan nutrisi.
- UI modern dengan glassmorphism dan animasi halus.
