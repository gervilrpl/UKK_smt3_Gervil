This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Catatan Masalah & Solusi: Project `ukk-smt4`

Project: Next.js 16 (Turbopack) + Prisma 7 + MySQL/MariaDB (XAMPP).
Folder project: `D:\ukk_smt4\ukk-smt4`
Database: `ukk_smt3_rafiq`
Akun admin: `admin@gmail.com` / `123456` (ganti sebelum project dipakai di server publik)





















<!-- ---

## Daftar isi

1. [Sidebar tidak muncul](#1-sidebar-tidak-muncul)
2. [Build error `lib/prisma.ts`](#2-build-error-libprismats)
3. [Prisma versi 8 RC diganti ke 7](#3-prisma-versi-8-rc-diganti-ke-7)
4. [Mematikan database sementara](#4-mematikan-database-sementara)
5. [Menyembunyikan item menu & shortcut comment](#5-menyembunyikan-item-menu--shortcut-comment)
6. [Error `Unexpected token '<' ... is not valid JSON`](#6-error-unexpected-token---is-not-valid-json)
7. [Build error `add-data-dialog.tsx`](#7-build-error-add-data-dialogtsx)
8. [Mengembalikan koneksi database (Prisma 7)](#8-mengembalikan-koneksi-database-prisma-7)
9. [`npm install` di folder yang salah](#9-npm-install-di-folder-yang-salah)
10. [Login selalu "Email atau password salah"](#10-login-selalu-email-atau-password-salah)
11. [Error `cookies()` / Cache Components & `next.config`](#11-error-cookies--cache-components--nextconfig)
12. [Tidak bisa logout](#12-tidak-bisa-logout)
13. [Peringatan lain yang tidak berbahaya](#13-peringatan-lain-yang-tidak-berbahaya)
14. [Kondisi akhir & checklist](#14-kondisi-akhir--checklist)

---

## 1. Sidebar tidak muncul

**Gejala:** halaman `/admin/...` tampil polos, tanpa sidebar dan header.

**Penyebab:** komponen `AdminShell` (yang memuat `Sidebar` + `Header`) tidak dipakai di mana pun. Tidak ada `app/admin/layout.tsx`.

**Solusi:** buat `app/admin/layout.tsx`. `AdminUserProvider` harus membungkus `AdminShell`, karena `Header` memakai `useAdminUser()`.

```tsx
import type { ReactNode } from "react";

import { AdminShell } from "@/app/components/sidebar/admin-shell";
import { AdminUserProvider } from "@/components/admin/admin-user-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminUserProvider>
      <AdminShell>{children}</AdminShell>
    </AdminUserProvider>
  );
}
```

**Masalah turunan yang ditemukan di menu:**

| Menu | Masalah | Solusi |
|---|---|---|
| Dashboard (`/admin`) | tidak ada `app/admin/page.tsx` (isi dashboard masih di `app/page.tsx`) | pindahkan ke `app/admin/page.tsx` |
| Categories | `app/admin/categories/page.tsx` 0 byte, Next error | isi minimal dengan `export default function ...` |
| Jurusan | folder kosong, 404 | buat `page.tsx` |
| Profile | halaman belum ada | buat `app/admin/profile/page.tsx` |

---

## 2. Build error `lib/prisma.ts`

**Gejala:** `Expected ';', '}' or <eof>` di `lib/prisma.ts` baris `port: Number(...)`.

**Penyebab:** file setengah ter-comment. Baris `const adapter = new PrismaMariaDb({` di-comment, tapi isi objeknya (`host`, `port`, ...) masih aktif. Bagian `globalForPrisma` juga ter-comment padahal dipakai di bawah.

**Solusi:** comment SEMUA baris atau aktifkan SEMUANYA. Jangan setengah-setengah. Versi lengkap ada di [bagian 8](#8-mengembalikan-koneksi-database-prisma-7).

---

## 3. Prisma versi 8 RC diganti ke 7

**Penyebab:** `package.json` berisi `"prisma": "^8.0.0-rc.34"`, yaitu release candidate, bukan versi stabil.

**Solusi:** pakai Prisma 7.10.1 (versi 7 stabil terbaru saat itu), semua paket dengan versi yang sama. Lihat [bagian 8](#8-mengembalikan-koneksi-database-prisma-7).

---

## 4. Mematikan database sementara

Dulu database sempat dimatikan karena belum mau langsung terhubung ke DB. Hanya `lib/auth.ts` yang memakai Prisma, jadi cukup:

- `lib/prisma.ts`: comment semua barisnya, tambahkan `export {}` di akhir.
- `lib/auth.ts`: ganti isinya jadi fungsi `getAuthenticatedUser()` yang mengembalikan user contoh (`id`, `fullname`, `email`, `role`).

Sekarang database sudah dinyalakan lagi (bagian 8), jadi catatan ini hanya untuk arsip.

---

## 5. Menyembunyikan item menu & shortcut comment

**Sembunyikan item sidebar:** comment barisnya di `lib/admin-menu.ts`, atau tambahkan properti `hidden?: boolean` lalu filter di `sidebar.tsx`:

```tsx
{adminMenu.filter((item) => !item.hidden).map(...)}
```

Menyembunyikan menu tidak memblokir URL-nya. Halaman tetap bisa dibuka lewat alamat.

**Shortcut VS Code:**

| Aksi | Windows | Mac |
|---|---|---|
| Comment / uncomment baris | `Ctrl + /` | `Cmd + /` |
| Comment blok `/* ... */` | `Shift + Alt + A` | `Shift + Option + A` |
| Sembunyikan sidebar VS Code | `Ctrl + B` | `Cmd + B` |

---

## 6. Error `Unexpected token '<' ... is not valid JSON`

**Penyebab:** halaman `user-management` dan form user memanggil `fetch("/api/users")` dan membaca `response.json()`, tapi route API-nya tidak ada. Yang kembali halaman HTML 404, bukan JSON.

**Solusi:** buat route di `app/api/users/route.ts` (GET, POST) dan `app/api/users/[id]/route.ts` (GET, PATCH, DELETE). Versi final memakai Prisma (bagian 8). Dulu sempat dibuat versi mock di memori (`lib/mock-users.ts`), tapi sudah tidak dipakai dan boleh dihapus.

---

## 7. Build error `add-data-dialog.tsx`

**Gejala:** `Expected '}', got '<eof>'` di `components/admin/add-data-dialog.tsx`.

**Penyebab:** fungsi `AddDataDialog` kurang `}` penutup di akhir file.

**Solusi:**

```tsx
    </Dialog>
  );
}   // <-- tambahkan baris ini
```

---

## 8. Mengembalikan koneksi database (Prisma 7)

### Langkah

Jalankan di `D:\ukk_smt4\ukk-smt4`:

```bat
npm install -D -E prisma@7.10.1
npm install -E @prisma/client@7.10.1 @prisma/adapter-mariadb@7.10.1 dotenv
npm approve-scripts prisma
npm approve-scripts @prisma/engines
npx prisma generate
npm run dev
```

(`dotenv` wajib karena Prisma 7 tidak membaca `.env` sendiri.)

### `.env` (di root, sejajar `package.json`)

```
DATABASE_URL="mysql://root:@127.0.0.1:3306/ukk_smt3_rafiq"
JWT_SECRET="isi-string-acak-yang-panjang"
```

Buat secret acak: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
Setelah mengubah `.env`, hentikan `npm run dev` (Ctrl+C) lalu jalankan lagi.

### `lib/prisma.ts`

```ts
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "@/src/generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di file .env")
}

const url = new URL(databaseUrl)

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.slice(1)),
  connectionLimit: 5,
})

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

### `prisma.config.ts` (di root)

```ts
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
})
```

### `lib/auth.ts` (versi asli, memakai database)

```ts
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyUserJwt } from "@/lib/user-security"

export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  const payload = verifyUserJwt(token)
  if (!payload) return null

  const userId = Number(payload.sub)
  if (!Number.isSafeInteger(userId) || userId < 1) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullname: true, email: true, role: true, token: true },
  })

  if (!user || user.token !== token) return null

  const { token: _token, ...authenticatedUser } = user
  return authenticatedUser
}
```

### File lain yang dibuat

- `lib/user-dto.ts`: `userSelect`, `toUserDto()`, `isPrismaError()`
- `app/api/users/route.ts` dan `app/api/users/[id]/route.ts`: CRUD user dengan Prisma, semuanya mengecek `getAuthenticatedUser()` dulu (401 kalau belum login)
- Hapus `lib/mock-users.ts` (sisa versi mock)

### Tambahan

- Tambahkan `/src/generated` ke `.gitignore`.
- Kalau `schema.prisma` berubah, jalankan lagi `npx prisma generate`.
- Jangan jalankan `npx prisma db push` kalau tabel sudah berisi data penting dan schema belum dicek.

---

## 9. `npm install` di folder yang salah

**Gejala:** hasil install cuma "136 packages", dan prompt terminal `D:\ukk_smt4>` (tanpa `\ukk-smt4`).

**Penyebab:** perintah dijalankan di folder induk, bukan di folder project. Prisma terpasang di tempat yang salah.

**Solusi:**

```bat
cd D:\ukk_smt4
rmdir /s /q node_modules
del package.json package-lock.json
cd ukk-smt4
npm install -D -E prisma@7.10.1
npm install -E @prisma/client@7.10.1 @prisma/adapter-mariadb@7.10.1 dotenv
```

Aturan praktis: selalu cek prompt terminal sebelum `npm install`. Harus berakhiran `...\ukk-smt4>`, tempat `package.json` berada.

---

## 10. Login selalu "Email atau password salah"

Ini masalah paling panjang. Urutan temuannya:

### a) Route login

Route login yang benar di `app/api/auth/login/route.ts` (pakai `verifyUserPassword`, bukan membandingkan teks biasa):

```ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserJwt, verifyUserPassword } from "@/lib/user-security"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = String(body?.email ?? "").trim()
  const password = String(body?.password ?? "")

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  const isValid = user ? await verifyUserPassword(password, user.password) : false

  if (!user || !isValid) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 })
  }

  const token = createUserJwt({ id: user.id, email: user.email, role: user.role })
  await prisma.user.update({ where: { id: user.id }, data: { token } })

  const response = NextResponse.json({ success: true })
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
  return response
}
```

### b) Penyebab sebenarnya

Log debug menunjukkan `user ditemukan: false`, padahal akun ada di phpMyAdmin.

- Akun admin dibuat di tabel **`tbl_users`** (dari file SQL pertama).
- Tapi `schema.prisma` memetakan model `User` ke tabel **`users`** (`@@map("users")`).
- Prisma membaca `users` yang kosong, bukan `tbl_users`.

**Petunjuk membaca log:**

| Status | Arti |
|---|---|
| `401` | kode login jalan, tapi akun ditolak |
| `404` | file route tidak ada di path yang dipanggil |
| `500` | error Prisma / `JWT_SECRET` / koneksi DB |

Logika debug yang dipakai (tempel sementara, hapus setelah beres):

```ts
console.log("[LOGIN] user ditemukan:", Boolean(user))
console.log("[LOGIN] password cocok:", isValid)
```

### c) Solusi: isi akun ke tabel `users`

Schema dibiarkan, akun dimasukkan ke tabel `users`. Kolom `updated_at` wajib diisi manual di SQL karena `@updatedAt` hanya bekerja lewat Prisma.

```sql
INSERT INTO users (fullname, email, password, role, created_at, updated_at)
VALUES ('Admin', 'admin@gmail.com', 'scrypt:64f873f73de983585f65d9f6cf650dee:7f274b1fc071208871585c6e599e8791da53db75d42630bfbd67c32fdd96470a375908a051256d9926bae2935f78641a7c9830d812e1b98b6467c2055c49470e', 'admin', NOW(3), NOW(3));
```

Hash di atas = password `123456` dalam format `scrypt:salt:digest`, sama dengan `hashUserPassword()` di `lib/user-security.ts`.

### d) Error phpMyAdmin yang muncul saat itu

| Error | Penyebab | Solusi |
|---|---|---|
| `#1064 ... near '5 VALUES'` | ada angka `5` nyasar antara `)` dan `VALUES` | hapus semua isi kotak SQL lalu tempel ulang, atau pakai tab **Import** |
| `#1062 Duplicate entry 'admin@gmail.com'` | baris admin sudah ada | jangan INSERT lagi, pakai UPDATE di bawah |

```sql
UPDATE users
SET password = 'scrypt:64f873f73de983585f65d9f6cf650dee:7f274b1fc071208871585c6e599e8791da53db75d42630bfbd67c32fdd96470a375908a051256d9926bae2935f78641a7c9830d812e1b98b6467c2055c49470e',
    role = 'admin', token = NULL, updated_at = NOW(3)
WHERE email = 'admin@gmail.com';
```

Cek database mana yang sebenarnya dibaca: `SELECT DATABASE() AS db, id, email, role FROM users;` (harus `ukk_smt3_rafiq`).

Tabel `tbl_users` sekarang tidak dipakai dan boleh dihapus.

---

## 11. Error `cookies()` / Cache Components & `next.config`

### a) Error `cookies()` di `/admin`

**Gejala:** `Route "/admin": Next.js encountered runtime data during prerendering` dengan petunjuk ke `getAuthenticatedUser` (`lib/auth.ts`). Terminal juga menulis `Cache Components enabled` dan `Partial Prefetching enabled`.

**Penyebab:** mode Cache Components di Next 16 mewajibkan `cookies()` dibungkus `<Suspense>`. `layout.tsx` memanggil `getAuthenticatedUser()` (yang memanggil `cookies()`) langsung.

**Solusi:** matikan `cacheComponents` dan `partialPrefetching`.

### b) `next.config.ts` rusak

**Gejala:** `Failed to load next.config.ts ... Unexpected token '}'` dan `Cannot find name 'NextConfig'`.

**Penyebab:** edit sebagian membuat isi file campuran, baris `import type { NextConfig }` hilang dan kurung tidak seimbang.

**Solusi:** ganti dengan `next.config.mjs` yang tidak butuh import tipe (hapus `next.config.ts` supaya tidak ada dua file config):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
```

Lalu bersihkan cache dan jalankan ulang:

```bat
del next.config.ts
rmdir /s /q .next
npm run dev
```

Pastikan di terminal tidak ada lagi baris `Cache Components enabled`.

---

## 12. Tidak bisa logout

**Penyebab:** tidak ada route logout dan tidak ada tombolnya sama sekali.

### Route: `app/api/auth/logout/route.ts`

```ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyUserJwt } from "@/lib/user-security"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  // Kosongkan token di database supaya token lama tidak bisa dipakai lagi
  if (token) {
    const payload = verifyUserJwt(token)
    const userId = Number(payload?.sub)
    if (Number.isSafeInteger(userId) && userId > 0) {
      await prisma.user.updateMany({
        where: { id: userId, token },
        data: { token: null },
      })
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // hapus cookie
  })
  return response
}
```

### Tombol: di dalam menu avatar (`app/components/navigation-menu/header.tsx`)

Avatar "AD" dibuat menjadi dropdown (komponen `dropdown-menu` shadcn) berisi nama/email, **Profile**, dan **Keluar**. Inti logikanya:

```tsx
async function handleLogout() {
  setIsLoggingOut(true);
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    router.push("/");
    router.refresh();
  }
}
```

Tes: klik avatar, pilih **Keluar**, lalu buka `/admin` langsung. Harus dilempar balik ke `/`.
Kalau sebelumnya sempat menambahkan tombol Keluar di `sidebar.tsx`, hapus supaya tidak dobel.

---

## 13. Peringatan lain yang tidak berbahaya

| Peringatan | Arti / tindakan |
|---|---|
| `GET /img/logo-mvp.jpg 404` | logo belum ada. Taruh file di `public/img/logo-mvp.jpg`. Tidak bikin error. |
| `allow-scripts ... prisma, @prisma/engines` | npm menahan script instal. Jalankan `npm approve-scripts prisma` dan `npm approve-scripts @prisma/engines`. |
| `20 vulnerabilities` dari `npm install` | jangan jalankan `npm audit fix --force`. Bisa merusak versi paket. Aman diabaikan untuk tugas UKK. |
| `Slow filesystem detected` | hanya info kecepatan disk, abaikan. |
| `Terminate batch job (Y/N)?` | muncul setelah Ctrl+C di Windows. Ketik `y`. |

---

## 14. Kondisi akhir & checklist

### Struktur file penting

```
ukk-smt4/
├─ .env                                  (DATABASE_URL, JWT_SECRET)
├─ next.config.mjs
├─ prisma.config.ts
├─ prisma/schema.prisma                  (model User -> tabel "users")
├─ src/generated/prisma/                 (hasil `npx prisma generate`)
├─ lib/
│  ├─ prisma.ts
│  ├─ auth.ts
│  ├─ user-security.ts                   (hash scrypt + JWT)
│  └─ user-dto.ts
└─ app/
   ├─ admin/layout.tsx                   (AdminUserProvider + AdminShell)
   ├─ components/navigation-menu/header.tsx   (dropdown avatar + Keluar)
   └─ api/
      ├─ auth/login/route.ts
      ├─ auth/logout/route.ts
      └─ users/route.ts, users/[id]/route.ts
```

### Checklist sebelum selesai

- [ ] Hapus semua `console.log("[LOGIN] ...")` dari `app/api/auth/login/route.ts`
- [ ] Hapus `lib/mock-users.ts` kalau masih ada
- [ ] Hapus tabel `tbl_users` di phpMyAdmin (tidak dipakai)
- [ ] Taruh logo di `public/img/logo-mvp.jpg`
- [ ] Isi halaman `categories`, `jurusan`, `profile`, dan `admin/page.tsx` (dashboard)
- [ ] Ganti password admin `123456` kalau project dipublikasikan
- [ ] Pastikan `.env` tidak ikut di-commit/upload (`.gitignore`)

### Cara jalan sehari-hari

1. Nyalakan MySQL di XAMPP.
2. Buka terminal di `D:\ukk_smt4\ukk-smt4` (cek prompt!).
3. `npm run dev`, lalu buka `http://localhost:3000`.
4. Login `admin@gmail.com` / `123456`.

### Kalau ada error baru

Kirim: (1) pesan error lengkap dari terminal, mulai baris `Error:` atau `⨯`, (2) path file yang disebut error, (3) isi file itu. Tiga hal itu biasanya cukup untuk menemukan penyebabnya. --> -->