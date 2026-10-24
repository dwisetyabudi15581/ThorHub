'use client'

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CalendarClock,
  Check,
  Copy,
  Download,
  Egg,
  ExternalLink,
  Gamepad2,
  GitBranch,
  Github,
  HardDrive,
  KeyRound,
  Layers,
  Lock,
  Package,
  Plus,
  Radar,
  Rocket,
  RotateCw,
  ShieldCheck,
  Terminal,
  Trash2,
  UploadCloud,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import bundled from '@/data/scripts.json'
import { UploadDialog } from '@/components/thorhub/upload-dialog'
import { DocsSection } from '@/components/thorhub/docs-section'
import {
  formatBytes,
  formatDateId,
  githubRawUrl,
  loadstringFor,
  type ScriptEntry,
  type ScriptsManifest,
} from '@/lib/scripts'

const bundledManifest = bundled as ScriptsManifest

const ADMIN_KEY_STORAGE = 'thorhub_admin_key'

function easeInOut() {
  return { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
}

const emptySubscribe = () => () => {}

/* ================= kartu script ================= */

type CardProps = {
  entry: ScriptEntry
  origin: string
  mode: 'domain' | 'github'
  live: boolean
  copied: boolean
  hasAdmin: boolean
  confirming: boolean
  deleting: boolean
  onCopy: (entry: ScriptEntry) => void
  onConfirm: (slug: string | null) => void
  onDelete: (entry: ScriptEntry) => void
}

function ScriptCard({
  entry,
  origin,
  mode,
  live,
  copied,
  hasAdmin,
  confirming,
  deleting,
  onCopy,
  onConfirm,
  onDelete,
}: CardProps) {
  const ls = loadstringFor(origin, entry.file, mode)
  const feats = entry.features ?? []
  const shown = feats.slice(0, 8)

  return (
    <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur transition hover:border-[#f5c542]/40">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5c542]/15 to-[#4f8cff]/15 text-[#f5c542]">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold text-slate-100">{entry.name}</h3>
              <p className="truncate text-xs text-slate-500">
                {entry.gameId ? (
                  <a
                    href={`https://www.roblox.com/games/${entry.gameId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition hover:text-[#8fb7ff]"
                  >
                    {entry.game}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  entry.game
                )}
              </p>
            </div>
          </div>
          <Badge className="shrink-0 border-[#f5c542]/30 bg-[#f5c542]/10 text-[#f5c542] hover:bg-[#f5c542]/10">
            v{entry.version}
          </Badge>
        </div>

        {entry.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
            {entry.description}
          </p>
        )}

        {shown.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400"
              >
                {f}
              </span>
            ))}
            {feats.length > 8 && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-600">
                +{feats.length - 8}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {formatBytes(entry.sizeBytes)}
          </span>
          <span>{formatDateId(entry.updatedAt)}</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                live ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {live ? (
              <span className="text-emerald-400">aktif</span>
            ) : (
              <span className="text-amber-400">menunggu deploy</span>
            )}
          </span>
        </div>

        <div className="relative mt-4">
          <pre className="overflow-x-auto rounded-lg bg-black/50 p-3 pr-24 font-mono text-[11px] leading-relaxed text-emerald-300 selection:bg-emerald-500/30">
            {ls}
          </pre>
          <Button
            onClick={() => onCopy(entry)}
            size="sm"
            className="absolute right-2 top-2 h-8 bg-white/10 text-slate-200 backdrop-blur transition hover:bg-[#f5c542] hover:text-black"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Button
            size="sm"
            onClick={() => onCopy(entry)}
            className="bg-gradient-to-r from-[#f5c542] to-[#ffdd75] font-bold text-[#1a1400] hover:from-[#ffd970] hover:to-[#ffe9a3]"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Tersalin
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Loadstring
              </>
            )}
          </Button>
          <a
            href={`${origin}${entry.file}`}
            download={`${entry.slug}.lua`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition hover:border-[#4f8cff]/60 hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" /> Unduh
          </a>
          <a
            href={githubRawUrl(entry.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition hover:border-[#4f8cff]/60 hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Raw
          </a>

          {hasAdmin && (
            <div className="ml-auto">
              {confirming ? (
                <span className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    disabled={deleting}
                    onClick={() => onDelete(entry)}
                    className="h-8 border-red-400/40 bg-red-400/10 text-xs font-semibold text-red-300 hover:bg-red-400/20"
                    variant="outline"
                  >
                    {deleting ? 'Menghapus…' : 'Ya, hapus'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-slate-400"
                    onClick={() => onConfirm(null)}
                  >
                    Batal
                  </Button>
                </span>
              ) : (
                <button
                  onClick={() => onConfirm(entry.slug)}
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-red-400/10 hover:text-red-400"
                  aria-label={`Hapus script ${entry.name}`}
                  title="Hapus script"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ================= halaman ================= */

export default function Home() {
  const [manifest, setManifest] = useState<ScriptsManifest>(bundledManifest)
  const [source, setSource] = useState<'github' | 'bundled'>('bundled')
  const [mode, setMode] = useState<'domain' | 'github'>('domain')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [liveMap, setLiveMap] = useState<Record<string, boolean>>({})
  const [refreshing, setRefreshing] = useState(false)

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ''
  )

  const load = useCallback(async (spinner = true) => {
    if (spinner) setRefreshing(true)
    try {
      const res = await fetch('/api/scripts', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as ScriptsManifest & {
          source: 'github' | 'bundled'
        }
        if (Array.isArray(data.scripts)) {
          setManifest({ scripts: data.scripts })
          setSource(data.source)
        }
      }
    } catch {
      /* pertahankan manifest bundled */
    } finally {
      if (spinner) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load(false)
  }, [load])

  // admin key dari localStorage (browser saja)
  useEffect(() => {
    const k = window.localStorage.getItem(ADMIN_KEY_STORAGE)
    if (k) setAdminKey(k)
  }, [])

  const saveAdminKey = useCallback((k: string) => {
    setAdminKey(k)
    if (k) window.localStorage.setItem(ADMIN_KEY_STORAGE, k)
    else window.localStorage.removeItem(ADMIN_KEY_STORAGE)
  }, [])

  const scripts = manifest.scripts

  // cek status live tiap file (polling 12 dtk selama ada yang belum live)
  useEffect(() => {
    if (!origin || scripts.length === 0) return
    let tries = 0
    let timer: ReturnType<typeof setInterval> | undefined
    const check = async () => {
      const results = await Promise.all(
        scripts.map(async (s) => {
          try {
            const r = await fetch(`${origin}${s.file}`, { method: 'HEAD' })
            return [s.slug, r.ok] as const
          } catch {
            return [s.slug, false] as const
          }
        })
      )
      setLiveMap(Object.fromEntries(results))
      tries += 1
      if (results.every(([, ok]) => ok) || tries > 30) {
        if (timer) clearInterval(timer)
      }
    }
    void check()
    timer = setInterval(() => {
      void check()
    }, 12000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [scripts, origin])

  const copyLoadstring = useCallback(
    async (entry: ScriptEntry) => {
      const text = loadstringFor(origin, entry.file, mode)
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
      setCopiedSlug(entry.slug)
      setTimeout(
        () => setCopiedSlug((cur) => (cur === entry.slug ? null : cur)),
        2000
      )
    },
    [origin, mode]
  )

  const doDelete = useCallback(
    async (entry: ScriptEntry) => {
      setDeleting(true)
      try {
        const res = await fetch('/api/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey,
          },
          body: JSON.stringify({ slug: entry.slug, confirm: entry.slug }),
        })
        const data = (await res.json()) as { ok: boolean; message?: string }
        if (!data.ok) {
          window.alert(data.message ?? 'Gagal menghapus script.')
        }
      } catch {
        window.alert('Gagal terhubung ke server panel.')
      } finally {
        setDeleting(false)
        setConfirmSlug(null)
        void load()
      }
    },
    [adminKey, load]
  )

  const totalScripts = scripts.length
  const totalGames = new Set(scripts.map((s) => s.game || 'Universal')).size
  const totalBytes = scripts.reduce((a, s) => a + (s.sizeBytes || 0), 0)
  const lastUpdate = scripts.reduce(
    (m, s) => (s.updatedAt && s.updatedAt > m ? s.updatedAt : m),
    ''
  )

  const stats = [
    { icon: Package, label: 'Total Script', value: String(totalScripts) },
    { icon: Gamepad2, label: 'Game Didukung', value: String(totalGames) },
    { icon: HardDrive, label: 'Total Ukuran', value: formatBytes(totalBytes) },
    {
      icon: CalendarClock,
      label: 'Update Terakhir',
      value: lastUpdate ? formatDateId(lastUpdate) : '—',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-200 relative overflow-x-clip">
      {/* dekorasi latar: glow petir */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 480px at 50% -10%, rgba(79,140,255,0.16), transparent 60%), radial-gradient(700px 400px at 85% 20%, rgba(245,197,66,0.07), transparent 60%), radial-gradient(600px 500px at 10% 45%, rgba(79,140,255,0.08), transparent 65%)',
        }}
      />

      {/* ================= NAV ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b16]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <a href="#" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/assets/logo.png"
              alt="Logo ThorHub"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <span className="text-lg font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#f5c542] to-[#ffe28a] bg-clip-text text-transparent">
                THOR
              </span>
              <span className="text-slate-100">HUB</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
            <a href="#panel" className="transition hover:text-[#f5c542]">
              Panel
            </a>
            <a href="#cara-kerja" className="transition hover:text-[#f5c542]">
              Cara Kerja
            </a>
            <a href="#docs" className="transition hover:text-[#f5c542]">
              Dokumentasi
            </a>
            <a href="#keamanan" className="transition hover:text-[#f5c542]">
              Keamanan
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/dwisetyabudi15581/ThorHub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-[#f5c542]/50 hover:text-[#f5c542]"
              aria-label="Repo GitHub ThorHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <Button
              onClick={() => setDialogOpen(true)}
              className="h-9 bg-gradient-to-r from-[#f5c542] to-[#ffdd75] px-3 text-xs font-bold text-[#1a1400] shadow-[0_0_20px_rgba(245,197,66,0.3)] hover:from-[#ffd970] hover:to-[#ffe9a3] sm:px-4 sm:text-sm"
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Tambah Script</span>
              <span className="sm:hidden">Script</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        {/* ================= HERO ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={easeInOut()}
              className="relative"
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 scale-150 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(79,140,255,0.35), rgba(245,197,66,0.12) 55%, transparent 70%)',
                }}
              />
              <Image
                src="/assets/logo.png"
                alt="Logo ThorHub — palu Mjolnir dan petir"
                width={144}
                height={144}
                className="rounded-3xl drop-shadow-[0_0_36px_rgba(79,140,255,0.45)]"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.1 }}
              className="mt-6 text-4xl font-black tracking-tighter sm:text-6xl"
            >
              <span className="bg-gradient-to-r from-[#f5c542] via-[#ffe28a] to-[#4f8cff] bg-clip-text text-transparent">
                THORHUB
              </span>{' '}
              <span className="text-slate-300">PANEL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.18 }}
              className="mt-4 max-w-2xl text-base text-slate-400 sm:text-lg"
            >
              Hosting script pribadi ala{' '}
              <span className="font-semibold text-slate-200">Luarmor</span> milikmu
              sendiri — upload file{' '}
              <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-sm text-emerald-300">
                .lua
              </code>
              , dapatkan loadstring instan, tambah game baru kapan saja.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.26 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Badge className="border-[#f5c542]/30 bg-[#f5c542]/10 text-[#f5c542] hover:bg-[#f5c542]/10">
                <Layers className="mr-1 h-3.5 w-3.5" /> Multi-Game
              </Badge>
              <Badge className="border-[#4f8cff]/30 bg-[#4f8cff]/10 text-[#8fb7ff] hover:bg-[#4f8cff]/10">
                <UploadCloud className="mr-1 h-3.5 w-3.5" /> Upload dari Browser
              </Badge>
              <Badge className="border-[#4f8cff]/30 bg-[#4f8cff]/10 text-[#8fb7ff] hover:bg-[#4f8cff]/10">
                <Zap className="mr-1 h-3.5 w-3.5" /> Auto-Deploy Vercel
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-slate-300 hover:bg-white/5">
                Tanpa Key System
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.34 }}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            >
              <Button
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="h-12 w-full bg-gradient-to-r from-[#f5c542] to-[#ffdd75] px-8 text-base font-bold text-[#1a1400] shadow-[0_0_28px_rgba(245,197,66,0.35)] hover:from-[#ffd970] hover:to-[#ffe9a3] sm:w-auto"
              >
                <UploadCloud className="mr-2 h-5 w-5" />
                Tambah Script
              </Button>
              <a
                href="#docs"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-[#4f8cff]/60 hover:bg-white/10 sm:w-auto"
              >
                Dokumentasi
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.42 }}
              className="mt-10 w-full"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <Image
                  src="/assets/banner.png"
                  alt="Banner ThorHub — Steal an Egg Edition"
                  width={1344}
                  height={768}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= STATISTIK ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...easeInOut(), delay: i * 0.06 }}
              >
                <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5c542]/15 to-[#4f8cff]/15 text-[#f5c542]">
                      <s.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-slate-100">
                        {s.value}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= PANEL SCRIPT ================= */}
        <section id="panel" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5c542]/10 text-[#f5c542]">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                    Script Panel
                  </h2>
                  <p className="text-xs text-slate-500">
                    {totalScripts} script · manifest{' '}
                    {source === 'github' ? 'live dari repo' : 'bundled build'}
                  </p>
                </div>
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
                  <button
                    onClick={() => setMode('domain')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition sm:text-xs ${
                      mode === 'domain'
                        ? 'bg-[#f5c542]/15 text-[#f5c542]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Domain Ini
                  </button>
                  <button
                    onClick={() => setMode('github')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition sm:text-xs ${
                      mode === 'github'
                        ? 'bg-[#f5c542]/15 text-[#f5c542]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    GitHub Raw
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void load()}
                  disabled={refreshing}
                  className="h-9 border-white/15 bg-white/[0.03] text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                  <RotateCw
                    className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
                <button
                  onClick={() => setAdminOpen((v) => !v)}
                  className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition ${
                    adminKey
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                      : 'border-white/15 bg-white/[0.03] text-slate-400 hover:text-slate-200'
                  }`}
                  title="Atur kunci admin panel"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {adminKey ? 'Admin aktif' : 'Admin'}
                </button>
              </div>
            </div>

            {adminOpen && (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <KeyRound className="h-4 w-4 shrink-0 text-[#f5c542]" />
                <span className="text-xs text-slate-400">Kunci admin (ADMIN_KEY):</span>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="mis. petir-kunci-2026"
                  className="min-w-[160px] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-[#f5c542]/60"
                  aria-label="Kunci admin"
                />
                <Button
                  size="sm"
                  onClick={() => saveAdminKey(adminKey)}
                  className="h-8 bg-[#f5c542]/15 text-xs font-semibold text-[#f5c542] hover:bg-[#f5c542]/25"
                  variant="outline"
                >
                  Simpan
                </Button>
                {adminKey && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => saveAdminKey('')}
                    className="h-8 text-xs text-slate-500 hover:text-red-400"
                  >
                    Hapus
                  </Button>
                )}
                <span className="w-full text-[11px] text-slate-600 sm:w-auto">
                  Tersimpan lokal di browser ini — tombol hapus script muncul setelah kunci aktif.
                </span>
              </div>
            )}

            {scripts.length === 0 ? (
              <Card className="border-dashed border-white/15 bg-white/[0.02]">
                <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5c542]/10 text-[#f5c542]">
                    <Egg className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">Belum ada script</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Mulai dengan meng-upload file .lua pertamamu — loadstring dibuat otomatis.
                    </p>
                  </div>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-gradient-to-r from-[#f5c542] to-[#ffdd75] font-bold text-[#1a1400] hover:from-[#ffd970] hover:to-[#ffe9a3]"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Tambah Script Pertama
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {scripts.map((entry, i) => (
                  <motion.div
                    key={entry.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ ...easeInOut(), delay: (i % 2) * 0.08 }}
                    className="h-full"
                  >
                    <ScriptCard
                      entry={entry}
                      origin={origin}
                      mode={mode}
                      live={liveMap[entry.slug] !== false}
                      copied={copiedSlug === entry.slug}
                      hasAdmin={Boolean(adminKey)}
                      confirming={confirmSlug === entry.slug}
                      deleting={deleting}
                      onCopy={(e) => {
                        void copyLoadstring(e)
                      }}
                      onConfirm={setConfirmSlug}
                      onDelete={(e) => {
                        void doDelete(e)
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* ================= CARA KERJA ================= */}
        <section
          id="cara-kerja"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              <span className="bg-gradient-to-r from-[#f5c542] to-[#ffe28a] bg-clip-text text-transparent">
                Cara Kerja
              </span>{' '}
              Panel
            </h2>
            <p className="mt-3 text-slate-500">
              Tiga langkah — tanpa terminal, tanpa git manual.
            </p>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: UploadCloud,
                title: 'Upload file .lua',
                desc: 'Tarik file script dari perangkat atau tempel source langsung di panel. Slug, ukuran, dan tanggal terdeteksi otomatis.',
              },
              {
                icon: GitBranch,
                title: 'Commit otomatis ke GitHub',
                desc: 'Panel membuat satu commit berisi file script + manifest di repo-mu sendiri. Riwayat versi tersimpan rapi di git.',
              },
              {
                icon: Rocket,
                title: 'Vercel redeploy otomatis',
                desc: '±1 menit setelah commit, loadstring baru aktif. Kartu di panel berubah sendiri dari "menunggu deploy" menjadi "aktif".',
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...easeInOut(), delay: i * 0.08 }}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
              >
                <span className="absolute right-4 top-3 font-mono text-4xl font-black text-white/5">
                  {i + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5c542] to-[#ffdd75] text-[#1a1400] shadow-[0_0_20px_rgba(245,197,66,0.3)]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= DOKUMENTASI ================= */}
        <section id="docs" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Dokumentasi
            </h2>
            <p className="mt-3 text-slate-500">
              Semua yang perlu diketahui untuk memakai dan mengelola panel.
            </p>
          </motion.div>
          <DocsSection />
        </section>

        {/* ================= KEAMANAN ================= */}
        <section
          id="keamanan"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Audit Keamanan
            </h2>
            <p className="mt-3 text-slate-500">
              Script utama dibongkar total dari pembungkus Luraph v15.1 — 3.044 string
              dianalisis.
            </p>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: KeyRound,
                title: 'Tanpa Key System',
                desc: 'Tidak ada lisensi, whitelist, HWID, atau gerbang kunci apa pun. Semua loadstring langsung jalan begitu dieksekusi.',
              },
              {
                icon: Radar,
                title: 'Tanpa Tracking',
                desc: 'Tidak ada pengiriman data ke server pembuat script. Panel pun hanya meng-commit ke repo-mu sendiri.',
              },
              {
                icon: Lock,
                title: 'Jaringan Wajar',
                desc: 'Script utama hanya menghubungi library UI Venyx, link Discord komunitas, dan API resmi Roblox untuk server hop.',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...easeInOut(), delay: i * 0.08 }}
              >
                <Card className="h-full border-emerald-400/15 bg-emerald-400/[0.03] backdrop-blur">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-100">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {c.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= DISCLAIMER ================= */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={easeInOut()}
            className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-sm leading-relaxed text-slate-400">
              <b className="text-amber-300">Peringatan:</b> penggunaan script pihak
              ketiga di Roblox selalu membawa risiko ban akun. Gunakan dengan bijak —
              Thor tidak menjamin kekebalan terhadap sistem anti-cheat game.
            </p>
          </motion.div>
        </section>
      </main>

      {/* ================= FOOTER (sticky bottom) ================= */}
      <footer className="mt-auto border-t border-white/10 bg-[#05080f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Logo ThorHub"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-extrabold tracking-tight text-slate-300">
              THOR<span className="text-[#f5c542]">HUB</span>
            </span>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-slate-600">
            ThorHub Panel — hosting script pribadi dengan loadstring otomatis.
            Script utama adalah rebrand dari Chilli Hub oleh tienkhanh1 (script gratis
            komunitas); UI, logo, dan branding diubah menjadi ThorHub. Kredit penuh
            untuk pembuat asli.{' '}
            <ShieldCheck className="inline h-3 w-3 text-slate-600" />
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a
              href="https://github.com/dwisetyabudi15581/ThorHub"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#f5c542]"
            >
              GitHub
            </a>
            <span aria-hidden>·</span>
            <span>Multi-Game · Roblox</span>
          </div>
        </div>
      </footer>

      {/* ================= DIALOG UPLOAD ================= */}
      <UploadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          void load()
        }}
        adminKey={adminKey}
        onAdminKeyChange={setAdminKey}
      />
    </div>
  )
}
