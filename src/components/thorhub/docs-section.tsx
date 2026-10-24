'use client'

import {
  Braces,
  ChevronRight,
  CloudCog,
  FileCode2,
  HelpCircle,
  Terminal,
  UploadCloud,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const codeCls =
  'overflow-x-auto rounded-lg bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-emerald-300 sm:text-xs'

const ENV_ROWS = [
  {
    name: 'GITHUB_TOKEN',
    wajib: 'Wajib',
    nilai: 'Personal Access Token dengan scope repo (classic) atau Contents: Read & Write (fine-grained)',
    fungsi: 'Server panel mem-commit file script + manifest ke repo',
  },
  {
    name: 'ADMIN_KEY',
    wajib: 'Wajib',
    nilai: 'kunci pilihanmu, mis. petir-kunci-2026',
    fungsi: 'Password untuk upload/hapus lewat panel (fail-closed: tanpa ini upload otomatis mati)',
  },
  {
    name: 'GITHUB_REPO',
    wajib: 'Opsional',
    nilai: 'dwisetyabudi15581/ThorHub (default)',
    fungsi: 'Repo tujuan commit',
  },
  {
    name: 'GITHUB_BRANCH',
    wajib: 'Opsional',
    nilai: 'main (default)',
    fungsi: 'Branch tujuan commit',
  },
]

const FAQ = [
  {
    q: 'Berapa lama script baru aktif setelah di-upload?',
    a: 'Sekitar 1 menit. Panel membuat 1 commit ke repo → Vercel mendeteksi push → build ulang → loadstring langsung live. Panel otomatis mengecek status tiap 12 detik, jadi kartu berubah sendiri dari "menunggu deploy" menjadi "aktif".',
  },
  {
    q: 'Kenapa kartu script saya bertanda "menunggu deploy"?',
    a: 'File sudah berhasil ter-commit ke GitHub, tetapi deployment Vercel belum selesai. Tunggu sebentar lalu tekan Refresh — biasanya selesai dalam 1 menit.',
  },
  {
    q: 'Apakah ada key system seperti Luarmor?',
    a: 'Tidak. Panel ini hanya untuk hosting file script. Semua loadstring bisa dipakai langsung — gratis, tanpa key, tanpa HWID, tanpa whitelist. Kunci admin hanya untuk mengelola isi panel, bukan untuk pemakai script.',
  },
  {
    q: 'Kalau repo GitHub saya bermasalah, apakah loadstring mati?',
    a: 'Tidak. Deployment Vercel terakhir tetap melayani file .lua dari domain Vercel-mu — loadstring tetap hidup meski GitHub raw sedang tidak bisa diakses. GitHub hanyalah sumber deploy dan cadangan.',
  },
  {
    q: 'File apa saja yang bisa di-upload?',
    a: 'File teks .lua atau .txt maksimal 5 MB per script. Boleh source terbuka maupun payload yang sudah diproteksi obfuscator (seperti ThorHub.lua).',
  },
]

export function DocsSection() {
  return (
    <div className="space-y-4">
      {/* ===== 1. pakai loadstring ===== */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5c542]/10 text-[#f5c542]">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">1. Pakai Loadstring</h3>
              <p className="text-xs text-slate-500">
                Setiap script di panel punya loadstring sendiri.
              </p>
            </div>
          </div>
          <pre className={codeCls}>
{`-- tempel ke executor (Delta, Solara, Wave, Cryptic, dll.)
-- lalu tekan Execute saat berada di game target:

loadstring(game:HttpGet("https://domain-vercel-mu.vercel.app/scripts/nama-script.lua"))()`}
          </pre>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-400">
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8cff]" />
              Domain loadstring di kartu script menyesuaikan otomatis dengan hosting
              halaman ini — tidak perlu diedit manual.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8cff]" />
              Tombol <b className="text-slate-200">GitHub Raw</b> memberi URL cadangan
              dari raw.githubusercontent jika domain utama sedang bermasalah.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* ===== 2. tambah script ===== */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f8cff]/10 text-[#8fb7ff]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">2. Tambah / Update Script</h3>
              <p className="text-xs text-slate-500">
                Dua cara: lewat panel (butuh env) atau manual lewat web GitHub.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="text-sm font-bold text-[#f5c542]">Cara A — lewat Panel</h4>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-400">
                <li>Tekan tombol <b className="text-slate-200">+ Tambah Script</b> di kanan atas.</li>
                <li>Isi nama, game, versi — lalu pilih file .lua dari perangkat.</li>
                <li>Masukkan Admin Key, tekan <b className="text-slate-200">Upload & Commit</b>.</li>
                <li>Selesai — panel + Vercel mengurus sisanya (commit → redeploy → live).</li>
              </ol>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="text-sm font-bold text-[#8fb7ff]">Cara B — manual (tanpa env)</h4>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-400">
                <li>Upload file .lua ke folder <code className="rounded bg-black/40 px-1 text-[11px] text-emerald-300">public/scripts/</code> lewat web GitHub (Add file → Upload files).</li>
                <li>Edit <code className="rounded bg-black/40 px-1 text-[11px] text-emerald-300">src/data/scripts.json</code> — tambah satu entry untuk script barumu.</li>
                <li>Commit perubahan → Vercel auto-redeploy ±1 menit.</li>
              </ol>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <FileCode2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
            Upload ulang dengan <b className="text-slate-300">slug yang sama</b> = update
            otomatis (file &amp; entry manifest ditimpa). Versi lama tetap tersimpan di
            riwayat commit GitHub.
          </p>
        </CardContent>
      </Card>

      {/* ===== 3. setup vercel ===== */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5c542]/10 text-[#f5c542]">
              <CloudCog className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">3. Setup Vercel (sekali saja)</h3>
              <p className="text-xs text-slate-500">
                Environment variables agar upload lewat panel berfungsi.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300">
                  <th className="px-4 py-2.5 font-semibold">Variabel</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Nilai</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {ENV_ROWS.map((r) => (
                  <tr key={r.name} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-emerald-300">
                      {r.name}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={
                          r.wajib === 'Wajib'
                            ? 'rounded-full border border-[#f5c542]/30 bg-[#f5c542]/10 px-2 py-0.5 text-[10px] font-semibold text-[#f5c542]'
                            : 'rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400'
                        }
                      >
                        {r.wajib}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 leading-relaxed">
                      <span className="text-slate-300">{r.nilai}</span>
                      <br />
                      <span className="text-[11px] text-slate-600">{r.fungsi}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-400">
            <li>
              Buat token GitHub baru khusus panel:{' '}
              <b className="text-slate-200">github.com → Settings → Developer settings →
              Personal access tokens</b>{' '}
              → pilih <i>classic</i> dengan scope <code className="rounded bg-black/40 px-1 text-[11px] text-emerald-300">repo</code>{' '}
              (atau fine-grained: <i>Contents: Read and Write</i>). Jangan pakai ulang
              token yang pernah dibagikan di chat.
            </li>
            <li>
              Buka project di <b className="text-slate-200">vercel.com → Settings →
              Environment Variables</b>, tambahkan keempat variabel di atas.
            </li>
            <li>
              Tekan <b className="text-slate-200">Redeploy</b> — panel siap dipakai.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* ===== 4. API ===== */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f8cff]/10 text-[#8fb7ff]">
              <Braces className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">4. API Panel</h3>
              <p className="text-xs text-slate-500">
                Untuk integrasi tool lain (opsional).
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                GET
              </span>
              <code className="font-mono text-xs text-slate-300">/api/scripts</code>
              <span className="text-xs text-slate-500">
                — daftar semua script (manifest).
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#f5c542]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#f5c542]">
                POST
              </span>
              <code className="font-mono text-xs text-slate-300">/api/upload</code>
              <span className="text-xs text-slate-500">
                — upload script baru (header x-admin-key).
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400">
                POST
              </span>
              <code className="font-mono text-xs text-slate-300">/api/delete</code>
              <span className="text-xs text-slate-500">
                — hapus script (header x-admin-key).
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== 5. FAQ ===== */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-300">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">5. FAQ</h3>
              <p className="text-xs text-slate-500">Pertanyaan yang sering muncul.</p>
            </div>
          </div>
          <div className="space-y-2">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 open:bg-white/[0.04]"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-200 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-[#f5c542] transition group-open:rotate-90 inline-block">
                    ›
                  </span>
                  {f.q}
                </summary>
                <p className="mt-2 pl-5 text-xs leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
