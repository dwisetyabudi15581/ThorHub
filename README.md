<p align="center">
  <img src="public/assets/logo.png" alt="Logo ThorHub" width="180"/>
</p>

<h1 align="center">⚡ THORHUB ⚡</h1>

<p align="center">
  <b>Website resmi ThorHub — script Roblox Steal an Egg</b><br/>
  Landing page + hosting script untuk loadstring. Siap deploy ke Vercel (gratis).
</p>

---

## 🚀 Cara Deploy ke Vercel (3 Menit)

1. **Buka [vercel.com](https://vercel.com)** dan login (bisa pakai akun GitHub).
2. Klik **"Add New → Project"**.
3. Pilih repo **`dwisetyabudi15581/ThorHub`** dari daftar (tekan **Import**).
   > Kalau repo tidak muncul: tekan **"Adjust GitHub App Permissions"** → beri akses ke repo ini.
4. Vercel mendeteksi **Next.js** otomatis — **tidak perlu ubah pengaturan apa pun**.
   Biarkan semua default, langsung tekan **"Deploy"**.
5. Tunggu 1–2 menit sampai muncul **"Congratulations"**. Selesai! 🎉

Setelah deploy, website kamu live di alamat seperti:
```
https://thorhub-xxxx.vercel.app
```

## ⚡ Loadstring Setelah Deploy

Buka website ThorHub kamu → tombol **Copy Loadstring** sudah otomatis memakai
domain kamu sendiri. Formatnya:

```lua
loadstring(game:HttpGet("https://DOMAIN-KAMU.vercel.app/ThorHub.lua"))()
```

File script tersaji di `/ThorHub.lua` dengan header `text/plain` bersih
(sudah diatur di `vercel.json`) — kompatibel dengan Delta, Solara, Wave,
Cryptic, dan executor lain yang mendukung `loadstring` + `game:HttpGet`.

> Ada juga mode **GitHub Raw** di website sebagai cadangan — file yang sama
> tersaji dari `raw.githubusercontent.com`.

## 📁 Isi Repo

```
public/
  ThorHub.lua              ← Script ThorHub (payload Luraph, string UI sudah THORHUB)
  assets/logo.png          ← Logo ThorHub (Mjolnir + petir)
  assets/banner.png        ← Banner ThorHub
src/
  app/page.tsx             ← Landing page (Next.js + Tailwind)
  app/layout.tsx           ← Metadata & font
  app/globals.css          ← Tema Tailwind
  components/ui/           ← Komponen shadcn/ui yang dipakai
vercel.json                ← Header khusus untuk file .lua
```

## 💻 Menjalankan Secara Lokal (Opsional)

```bash
bun install     # atau: npm install
bun run dev     # atau: npm run dev
```

Buka `http://localhost:3000`.

## 🔄 Update Script

Ganti file `public/ThorHub.lua` dengan versi baru → commit → push →
Vercel otomatis deploy ulang dalam ~1 menit. Tidak perlu konfigurasi ulang.

## 🛡️ Kenapa Vercel?

- **Gratis** untuk project pribadi (Hobby plan)
- **Tahan lama** — tidak tergantung umur repo GitHub; kalau repo sempat
  bermasalah, deployment Vercel tetap hidup dan loadstring tetap jalan
- **Cepat di Indonesia** — CDN global, tidak kena blokir seperti
  `raw.githubusercontent.com` di sebagian ISP

## 🙏 Kredit

- Script asli: **Chilli Hub** oleh tienkhanh1 (script gratis komunitas)
- ThorHub: rebrand UI (judul window, logo, gradient) + audit keamanan penuh
  (3.044 string dianalisis: tanpa key system, tanpa tracking)

⚠️ *Gunakan dengan bijak — penggunaan script pihak ketiga selalu membawa
risiko ban akun Roblox.*
