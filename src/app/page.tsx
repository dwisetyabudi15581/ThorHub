'use client'

import { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Zap,
  Copy,
  Check,
  Download,
  Egg,
  Sparkles,
  RefreshCw,
  Eye,
  Swords,
  Footprints,
  Globe,
  Gauge,
  Bell,
  Save,
  ShieldCheck,
  KeyRound,
  Radar,
  Lock,
  Github,
  ChevronRight,
  Terminal,
  MousePointerClick,
  Play,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const GITHUB_RAW =
  'https://raw.githubusercontent.com/dwisetyabudi15581/ThorHub/main/public/ThorHub.lua'

const FITUR = [
  {
    icon: Egg,
    title: 'Steal',
    desc: 'Auto Steal dengan filter zona, rarity, nilai & prioritas. Instant Steal V1-V3, Steal Missing Index.',
  },
  {
    icon: Sparkles,
    title: 'Event',
    desc: 'Shooting Star, Butterfly Bloom, Wisp, Banjo Cricket, event Halloween lengkap, Ghost Dog Quest, Phantom Express.',
  },
  {
    icon: RefreshCw,
    title: 'Otomasi',
    desc: 'Auto Hatch + Equip, Auto Sell pet & egg, Auto Fuse, Auto Mutate, Auto Place Egg, Auto Treadmill.',
  },
  {
    icon: Eye,
    title: 'ESP',
    desc: 'ESP egg, pemain, guard, base sendiri/orang — lengkap dengan info rarity, nilai, dan jarak.',
  },
  {
    icon: Swords,
    title: 'Combat',
    desc: 'Auto Hit, Hit Aura, Hit Sweep/Lead, targeting pemain atau pembawa egg.',
  },
  {
    icon: Footprints,
    title: 'Movement',
    desc: 'Speed Boost, Infinite Jump, Invisibility, Anti Ragdoll/Trap/AFK.',
  },
  {
    icon: Globe,
    title: 'Server',
    desc: 'Auto Hop pintar (cari egg langka antar server), Auto Rejoin saat koneksi putus.',
  },
  {
    icon: Gauge,
    title: 'Optimasi',
    desc: 'FPS Cap, Disable 3D Render, Optimizer grafis, Hide Game UI.',
  },
  {
    icon: Bell,
    title: 'Notifikasi',
    desc: 'Discord Webhook milik sendiri (opsional), Egg Predictor, HUD FPS/Ping.',
  },
  {
    icon: Save,
    title: 'Config',
    desc: 'Save/Load/Import/Export pengaturan, Startup Config otomatis saat join.',
  },
]

const LANGKAH = [
  {
    icon: Play,
    title: 'Buka Game',
    desc: 'Jalankan Roblox dan masuk ke game Steal an Egg.',
  },
  {
    icon: Copy,
    title: 'Copy Loadstring',
    desc: 'Tekan tombol Copy di atas, lalu tempel ke executor kamu.',
  },
  {
    icon: MousePointerClick,
    title: 'Execute',
    desc: 'Tekan tombol Execute di executor (Delta, Solara, Wave, Cryptic, dll).',
  },
  {
    icon: Zap,
    title: 'Thor Menyambar',
    desc: 'UI ThorHub muncul. Buka tab Farm, atur filter, dan biarkan petir bekerja.',
  },
]

function easeInOut() {
  return { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
}

const emptySubscribe = () => () => {}

export default function Home() {
  const [mode, setMode] = useState<'vercel' | 'github'>('vercel')
  const [copied, setCopied] = useState(false)

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ''
  )

  const isVercel = mode === 'vercel' && origin
  const scriptUrl = isVercel ? `${origin}/ThorHub.lua` : GITHUB_RAW
  const loadstring = `loadstring(game:HttpGet("${scriptUrl}"))()`

  const copyLoadstring = async () => {
    try {
      await navigator.clipboard.writeText(loadstring)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = loadstring
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
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
            <a href="#loadstring" className="transition hover:text-[#f5c542]">
              Loadstring
            </a>
            <a href="#fitur" className="transition hover:text-[#f5c542]">
              Fitur
            </a>
            <a href="#cara-pakai" className="transition hover:text-[#f5c542]">
              Cara Pakai
            </a>
            <a href="#keamanan" className="transition hover:text-[#f5c542]">
              Keamanan
            </a>
          </nav>
          <a
            href="https://github.com/dwisetyabudi15581/ThorHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-[#f5c542]/50 hover:text-[#f5c542]"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <main className="relative flex-1">
        {/* ================= HERO ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
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
                width={168}
                height={168}
                className="rounded-3xl drop-shadow-[0_0_36px_rgba(79,140,255,0.45)]"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.1 }}
              className="mt-8 text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl"
            >
              <span className="bg-gradient-to-r from-[#f5c542] via-[#ffe28a] to-[#4f8cff] bg-clip-text text-transparent">
                THORHUB
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.18 }}
              className="mt-4 max-w-2xl text-base text-slate-400 sm:text-lg"
            >
              Script lengkap untuk Roblox{' '}
              <span className="font-semibold text-slate-200">Steal an Egg</span>.
              Seperti petir Thor yang menyambar — egg Eternal dan Divine tidak
              akan luput dari pandanganmu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.26 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Badge className="border-[#f5c542]/30 bg-[#f5c542]/10 text-[#f5c542] hover:bg-[#f5c542]/10">
                <Zap className="mr-1 h-3.5 w-3.5" /> 150+ Fitur
              </Badge>
              <Badge className="border-[#4f8cff]/30 bg-[#4f8cff]/10 text-[#8fb7ff] hover:bg-[#4f8cff]/10">
                Gratis
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-slate-300 hover:bg-white/5">
                Tanpa Key
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-slate-300 hover:bg-white/5">
                Tanpa Tracking
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
                onClick={() => {
                  document
                    .getElementById('loadstring')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="h-12 w-full bg-gradient-to-r from-[#f5c542] to-[#ffdd75] px-8 text-base font-bold text-[#1a1400] shadow-[0_0_28px_rgba(245,197,66,0.35)] hover:from-[#ffd970] hover:to-[#ffe9a3] sm:w-auto"
              >
                <Zap className="mr-2 h-5 w-5" />
                Copy Loadstring
              </Button>
              <a
                href="/ThorHub.lua"
                download="ThorHub.lua"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-[#4f8cff]/60 hover:bg-white/10 sm:w-auto"
              >
                <Download className="h-5 w-5" />
                Download Script
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeInOut(), delay: 0.42 }}
              className="mt-12 w-full"
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

        {/* ================= LOADSTRING ================= */}
        <section id="loadstring" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5c542]/10 text-[#f5c542]">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                  Loadstring
                </h2>
                <p className="text-sm text-slate-500">
                  Domain menyesuaikan otomatis dengan hosting halaman ini.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur">
              <div className="flex items-center justify-between gap-1 rounded-xl bg-[#0a0f1e]/80 p-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => setMode('vercel')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      mode === 'vercel'
                        ? 'bg-[#f5c542]/15 text-[#f5c542]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Hosting Ini
                  </button>
                  <button
                    onClick={() => setMode('github')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      mode === 'github'
                        ? 'bg-[#f5c542]/15 text-[#f5c542]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    GitHub Raw
                  </button>
                </div>
                <span className="mr-2 hidden items-center gap-1.5 text-xs text-slate-600 sm:flex">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isVercel ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  {isVercel ? 'domain aktif' : 'cadangan'}
                </span>
              </div>

              <div className="relative mt-1.5">
                <pre className="overflow-x-auto rounded-xl bg-black/50 p-4 pr-28 font-mono text-xs leading-relaxed text-emerald-300 selection:bg-emerald-500/30 sm:text-sm">
                  {loadstring}
                </pre>
                <Button
                  onClick={copyLoadstring}
                  size="sm"
                  className="absolute right-3 top-3 h-9 bg-white/10 text-slate-200 backdrop-blur transition hover:bg-[#f5c542] hover:text-black"
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4 text-emerald-400" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8cff]" />
                <p className="text-sm leading-relaxed text-slate-400">
                  Tempel ke executor lalu tekan <b className="text-slate-200">Execute</b>{' '}
                  saat berada di game Steal an Egg.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8cff]" />
                <p className="text-sm leading-relaxed text-slate-400">
                  Auto-load setelah pindah server mengarah ke GitHub raw —
                  script tetap menyala setelah teleport.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= FITUR ================= */}
        <section id="fitur" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              <span className="bg-gradient-to-r from-[#f5c542] to-[#ffe28a] bg-clip-text text-transparent">
                150+ Fitur
              </span>{' '}
              Siap Menyambar
            </h2>
            <p className="mt-3 text-slate-500">
              10 kategori otomasi lengkap, semuanya gratis tanpa key.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...easeInOut(), delay: (i % 3) * 0.08 }}
              >
                <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur transition hover:border-[#f5c542]/40 hover:bg-white/[0.05]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5c542]/15 to-[#4f8cff]/15 text-[#f5c542]">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-slate-100">{f.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= CARA PAKAI ================= */}
        <section
          id="cara-pakai"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={easeInOut()}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Cara Pakai
            </h2>
            <p className="mt-3 text-slate-500">Empat langkah, langsung menyambar.</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LANGKAH.map((l, i) => (
              <motion.div
                key={l.title}
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
                  <l.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-100">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {l.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= KEAMANAN ================= */}
        <section
          id="keamanan"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6"
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
              Dibongkar total dari pembungkus Luraph v15.1 — 3.044 string
              dianalisis.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: KeyRound,
                title: 'Tanpa Key System',
                desc: 'Tidak ada lisensi, whitelist, HWID, atau gerbang kunci apa pun. Script langsung jalan begitu dieksekusi.',
              },
              {
                icon: Radar,
                title: 'Tanpa Tracking',
                desc: 'Tidak ada pengiriman data ke server pembuat script. Beda total dengan script lama yang memasang beacon Firebase.',
              },
              {
                icon: Lock,
                title: 'Jaringan Wajar',
                desc: 'Hanya 3 kontak: library UI Venyx, link Discord komunitas, dan API resmi Roblox untuk server hop.',
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
              <b className="text-amber-300">Peringatan:</b> penggunaan script
              pihak ketiga di Roblox selalu membawa risiko ban akun. Gunakan
              dengan bijak — Thor tidak menjamin kekebalan terhadap sistem
              anti-cheat game.
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
            ThorHub adalah rebrand dari Chilli Hub oleh tienkhanh1 (script
            gratis komunitas). UI, logo, dan branding diubah menjadi ThorHub;
            kredit penuh untuk pembuat asli.{' '}
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
            <span>Steal an Egg · Roblox</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
