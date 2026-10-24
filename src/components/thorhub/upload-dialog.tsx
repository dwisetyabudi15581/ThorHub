'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCode2,
  KeyRound,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBytes, slugify, type ScriptEntry } from '@/lib/scripts'

type UploadResult = {
  ok: boolean
  code?: string
  message?: string
  commit?: { sha: string; url: string }
  entry?: ScriptEntry
  note?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  adminKey: string
  onAdminKeyChange: (key: string) => void
}

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-[#f5c542]/60 focus:ring-1 focus:ring-[#f5c542]/40'

const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-400'

export function UploadDialog({ open, onClose, onSuccess, adminKey, onAdminKeyChange }: Props) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [game, setGame] = useState('')
  const [gameId, setGameId] = useState('')
  const [version, setVersion] = useState('1.0.0')
  const [description, setDescription] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const fileContentRef = useRef<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [copiedEntry, setCopiedEntry] = useState(false)

  // reset form setiap kali dialog dibuka
  useEffect(() => {
    if (!open) return
    setName('')
    setSlug('')
    setSlugEdited(false)
    setGame('')
    setGameId('')
    setVersion('1.0.0')
    setDescription('')
    setFeaturesText('')
    setSourceText('')
    setFileName('')
    setFileSize(0)
    fileContentRef.current = ''
    setSubmitting(false)
    setFormError(null)
    setResult(null)
    setCopiedEntry(false)
  }, [open])

  // Escape untuk tutup + kunci scroll body
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, submitting])

  if (!open) return null

  const luaSource = fileContentRef.current || sourceText
  const parsedFeatures = featuresText
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)

  const onPickFile = async (file: File | undefined) => {
    if (!file) return
    const text = await file.text()
    fileContentRef.current = text
    setFileName(file.name)
    setFileSize(file.size)
  }

  const clearFile = () => {
    fileContentRef.current = ''
    setFileName('')
    setFileSize(0)
  }

  const downloadLua = () => {
    const blob = new Blob([luaSource], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug || 'script'}.lua`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const manualEntry: ScriptEntry = {
    slug: slug || 'nama-script',
    name: name || slug || 'Nama Script',
    game: game || 'Universal',
    gameId: Number(gameId) > 0 ? Number(gameId) : undefined,
    version: version || '1.0.0',
    description,
    file: `/scripts/${slug || 'nama-script'}.lua`,
    sizeBytes: new Blob([luaSource]).size,
    updatedAt: new Date().toISOString().slice(0, 10),
    features: parsedFeatures,
  }

  const copyManualEntry = async () => {
    const text = JSON.stringify(manualEntry, null, 2)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedEntry(true)
    setTimeout(() => setCopiedEntry(false), 2000)
  }

  const submit = async () => {
    setFormError(null)
    if (!name.trim()) return setFormError('Nama script wajib diisi.')
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(slug))
      return setFormError('Slug wajib 1-64 karakter (huruf, angka, -, _).')
    if (luaSource.trim().length < 10)
      return setFormError('Source Lua kosong — pilih file .lua atau tempel source-nya.')
    if (!adminKey.trim())
      return setFormError('Admin key wajib diisi (nilai ADMIN_KEY di env Vercel).')

    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          slug,
          name,
          game,
          gameId: Number(gameId) || 0,
          version,
          description,
          features: parsedFeatures,
          luaSource,
        }),
      })
      const data = (await res.json()) as UploadResult
      setResult(data)
      if (data.ok) onSuccess()
    } catch (e) {
      setResult({
        ok: false,
        message: e instanceof Error ? e.message : 'Gagal terhubung ke server panel.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => {
        if (!submitting) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tambah script baru"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0b1120] p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- header ---------- */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5c542]/10 text-[#f5c542]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Tambah Script Baru</h3>
              <p className="text-xs text-slate-500">
                Upload file .lua → commit otomatis → loadstring live.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!submitting) onClose()
            }}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
            aria-label="Tutup dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ---------- sukses ---------- */}
        {result?.ok ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-400" />
            <div>
              <h4 className="text-lg font-bold text-slate-100">Commit berhasil!</h4>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                {result.note}
              </p>
            </div>
            {result.commit && (
              <a
                href={result.commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-[#8fb7ff] transition hover:border-[#4f8cff]/50"
              >
                {result.commit.sha.slice(0, 7)} — lihat di GitHub
              </a>
            )}
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[#f5c542] to-[#ffdd75] font-bold text-[#1a1400] hover:from-[#ffd970] hover:to-[#ffe9a3]"
            >
              Selesai
            </Button>
          </div>
        ) : result ? (
          /* ---------- gagal + fallback manual ---------- */
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-400/[0.05] p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm leading-relaxed text-slate-300">{result.message}</p>
            </div>

            {(result.code === 'NO_TOKEN' || result.code === 'NO_ADMIN_KEY') && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h5 className="text-sm font-bold text-slate-200">
                  Mode manual (tanpa env variable)
                </h5>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-400">
                  <li>
                    Unduh file di bawah, lalu upload ke repo di folder{' '}
                    <code className="rounded bg-black/40 px-1 py-0.5 text-[11px] text-emerald-300">
                      public/scripts/
                    </code>{' '}
                    lewat web GitHub (Add file → Upload files).
                  </li>
                  <li>
                    Edit{' '}
                    <code className="rounded bg-black/40 px-1 py-0.5 text-[11px] text-emerald-300">
                      src/data/scripts.json
                    </code>{' '}
                    lalu tempel entry manifest hasil salinan di bawah.
                  </li>
                  <li>
                    Commit → Vercel auto-redeploy → loadstring aktif ±1 menit.
                  </li>
                </ol>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={downloadLua}>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Unduh {(slug || 'script') + '.lua'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyManualEntry}>
                    {copiedEntry ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Salin entry manifest
                      </>
                    )}
                  </Button>
                </div>
                <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
                  {JSON.stringify(manualEntry, null, 2)}
                </pre>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="w-full border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
            >
              Kembali ke form
            </Button>
          </div>
        ) : (
          /* ---------- form ---------- */
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="f-nama">
                  Nama Script <span className="text-[#f5c542]">*</span>
                </label>
                <input
                  id="f-nama"
                  className={inputCls}
                  value={name}
                  placeholder="mis. ThorHub — Grow a Garden"
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!slugEdited) setSlug(slugify(e.target.value))
                  }}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-slug">
                  Slug (nama file) <span className="text-[#f5c542]">*</span>
                </label>
                <input
                  id="f-slug"
                  className={`${inputCls} font-mono`}
                  value={slug}
                  placeholder="thorhub-grow-a-garden"
                  onChange={(e) => {
                    setSlugEdited(true)
                    setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64))
                  }}
                />
                <p className="mt-1 text-[11px] text-slate-600">
                  Loadstring: /scripts/<span className="text-slate-400">{slug || 'slug'}</span>.lua
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="f-game">
                  Nama Game
                </label>
                <input
                  id="f-game"
                  className={inputCls}
                  value={game}
                  placeholder="mis. Steal an Egg"
                  onChange={(e) => setGame(e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-gameid">
                  Game ID Roblox (opsional)
                </label>
                <input
                  id="f-gameid"
                  className={inputCls}
                  value={gameId}
                  inputMode="numeric"
                  placeholder="mis. 10563114921"
                  onChange={(e) => setGameId(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="f-versi">
                  Versi
                </label>
                <input
                  id="f-versi"
                  className={inputCls}
                  value={version}
                  placeholder="1.0.0"
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-fitur">
                  Fitur (pisahkan koma)
                </label>
                <input
                  id="f-fitur"
                  className={inputCls}
                  value={featuresText}
                  placeholder="Auto Farm, ESP, Auto Steal"
                  onChange={(e) => setFeaturesText(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="f-deskripsi">
                Deskripsi singkat
              </label>
              <textarea
                id="f-deskripsi"
                className={`${inputCls} min-h-[64px] resize-y`}
                value={description}
                placeholder="Ringkasan fitur utama script ini…"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Source Lua <span className="text-[#f5c542]">*</span></label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-5 text-sm text-slate-400 transition hover:border-[#f5c542]/50 hover:text-slate-200">
                <FileCode2 className="h-5 w-5 text-[#f5c542]" />
                {fileName
                  ? `${fileName} (${formatBytes(fileSize)}) — klik untuk ganti`
                  : 'Pilih file .lua / .txt dari perangkat'}
                <input
                  type="file"
                  accept=".lua,.txt,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    void onPickFile(e.target.files?.[0])
                  }}
                />
              </label>
              {fileName && (
                <button
                  onClick={clearFile}
                  className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 transition hover:text-red-400"
                >
                  <X className="h-3 w-3" /> hapus file, tempel manual saja
                </button>
              )}
              {!fileName && (
                <textarea
                  className={`${inputCls} mt-2 min-h-[72px] font-mono text-xs resize-y`}
                  value={sourceText}
                  placeholder="-- atau tempel source code Lua di sini…"
                  onChange={(e) => setSourceText(e.target.value)}
                  aria-label="Tempel source Lua"
                />
              )}
            </div>

            <div>
              <label className={labelCls} htmlFor="f-key">
                <span className="inline-flex items-center gap-1">
                  <KeyRound className="h-3 w-3 text-[#f5c542]" /> Admin Key (ADMIN_KEY)
                </span>
              </label>
              <input
                id="f-key"
                type="password"
                className={inputCls}
                value={adminKey}
                placeholder="nilai ADMIN_KEY dari env Vercel"
                onChange={(e) => onAdminKeyChange(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-600">
                Disimpan hanya di browser ini (localStorage).
              </p>
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-400/[0.05] p-3 text-xs text-red-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {formError}
              </div>
            )}

            <Button
              onClick={() => {
                void submit()
              }}
              disabled={submitting}
              className="h-11 w-full bg-gradient-to-r from-[#f5c542] to-[#ffdd75] font-bold text-[#1a1400] shadow-[0_0_24px_rgba(245,197,66,0.3)] hover:from-[#ffd970] hover:to-[#ffe9a3]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat commit ke GitHub…
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload & Commit
                </>
              )}
            </Button>

            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Source hanya dikirim ke API panel untuk di-commit ke repo-mu sendiri —
              tidak disimpan di server lain. Upload slug yang sama = update versi lama.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
