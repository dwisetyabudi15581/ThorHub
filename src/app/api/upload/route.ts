import { NextResponse } from 'next/server'
import bundled from '@/data/scripts.json'
import {
  ghConfigFromEnv,
  readManifest,
  createBlob,
  commitTree,
  safeRepoPath,
  type TreeEntry,
} from '@/lib/github'
import type { ScriptEntry, ScriptsManifest } from '@/lib/scripts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SLUG_RE = /^[a-zA-Z0-9_-]{1,64}$/
const MAX_LUA_BYTES = 5 * 1024 * 1024

function fail(message: string, code: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

/**
 * POST /api/upload  (header: x-admin-key)
 * Body: { slug, name, game?, gameId?, version?, description?, features?, luaSource }
 * Upload slug yang sama = update/overwrite versi lama.
 * Melakukan 1 commit berisi: public/scripts/<slug>.lua + manifest src/data/scripts.json.
 * Vercel lalu auto-redeploy sehingga loadstring aktif ±1 menit kemudian.
 */
export async function POST(req: Request) {
  // Fail-closed: tanpa ADMIN_KEY, upload lewat panel dimatikan demi keamanan.
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) {
    return fail(
      'ADMIN_KEY belum di-set di Environment Variables Vercel — upload lewat panel dinonaktifkan demi keamanan. Set dulu (lihat seksi "Setup Vercel" di Dokumentasi) atau gunakan mode manual.',
      'NO_ADMIN_KEY',
      503
    )
  }
  if (req.headers.get('x-admin-key') !== adminKey) {
    return fail('Admin key salah.', 'UNAUTHORIZED', 401)
  }
  const cfg = ghConfigFromEnv()
  if (!cfg) {
    return fail(
      'GITHUB_TOKEN belum di-set di Environment Variables Vercel (PAT dengan akses repo / Contents Read & Write). Set dulu (lihat seksi "Setup Vercel") atau gunakan mode manual.',
      'NO_TOKEN',
      503
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return fail('Body bukan JSON valid.', 'BAD_BODY', 400)
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const slug = str(body.slug)
  const name = str(body.name)
  const luaSource = typeof body.luaSource === 'string' ? body.luaSource : ''

  if (!SLUG_RE.test(slug)) {
    return fail('Slug wajib 1-64 karakter (huruf, angka, -, _).', 'BAD_SLUG', 400)
  }
  if (!name) return fail('Nama script wajib diisi.', 'BAD_NAME', 400)
  if (luaSource.trim().length < 10) {
    return fail('Source Lua kosong atau terlalu pendek.', 'BAD_SOURCE', 400)
  }
  const bytes = Buffer.byteLength(luaSource, 'utf8')
  if (bytes > MAX_LUA_BYTES) {
    return fail('File terlalu besar (maksimal 5 MB).', 'TOO_BIG', 400)
  }

  const features = Array.isArray(body.features)
    ? body.features
        .filter((f): f is string => typeof f === 'string')
        .map((f) => f.trim())
        .filter(Boolean)
        .slice(0, 20)
    : []
  const gameIdRaw = Number(body.gameId)

  const entry: ScriptEntry = {
    slug,
    name: name.slice(0, 80),
    game: str(body.game).slice(0, 60) || 'Universal',
    gameId: Number.isFinite(gameIdRaw) && gameIdRaw > 0 ? gameIdRaw : undefined,
    version: str(body.version).slice(0, 16) || '1.0.0',
    description: str(body.description).slice(0, 500),
    file: `/scripts/${slug}.lua`,
    sizeBytes: bytes,
    updatedAt: new Date().toISOString().slice(0, 10),
    features: features.map((f) => f.slice(0, 40)),
  }
  if (!safeRepoPath(entry.file)) {
    return fail('Path file tidak valid.', 'BAD_PATH', 400)
  }

  // Manifest dasar selalu dibaca dari repo agar upload beruntun sebelum redeploy tetap aman.
  const base = (await readManifest(cfg).catch(() => null)) ?? (bundled as ScriptsManifest)
  const others = (base.scripts ?? []).filter((s) => s.slug !== slug)
  const manifest: ScriptsManifest = { scripts: [...others, entry] }

  try {
    const luaBlob = await createBlob(cfg, luaSource)
    const manifestBlob = await createBlob(
      cfg,
      JSON.stringify(manifest, null, 2) + '\n'
    )
    const entries: TreeEntry[] = [
      { path: `public/scripts/${slug}.lua`, mode: '100644', type: 'blob', sha: luaBlob },
      { path: 'src/data/scripts.json', mode: '100644', type: 'blob', sha: manifestBlob },
    ]
    const commit = await commitTree(
      cfg,
      entries,
      `feat(panel): tambah script ${slug} (${entry.game}) [via ThorHub Panel]`
    )
    return NextResponse.json({
      ok: true,
      commit,
      entry,
      note: 'Commit berhasil dibuat. Vercel otomatis redeploy ±1 menit — panel akan menandai script ini "menunggu deploy" lalu aktif sendiri setelah file live.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tidak dikenal'
    return fail(`Gagal commit ke GitHub: ${message}`, 'GH_ERROR', 502)
  }
}
