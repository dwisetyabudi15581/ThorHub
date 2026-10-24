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
import type { ScriptsManifest } from '@/lib/scripts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function fail(message: string, code: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

/**
 * POST /api/delete  (header: x-admin-key)
 * Body: { slug, confirm } — confirm harus sama dengan slug (konfirmasi ganda).
 * Menghapus public/scripts/<slug>.lua + entry manifest dalam 1 commit.
 */
export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) {
    return fail(
      'ADMIN_KEY belum di-set di Environment Variables Vercel — fitur hapus dinonaktifkan. Set dulu di Vercel (lihat Dokumentasi).',
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
      'GITHUB_TOKEN belum di-set di Environment Variables Vercel.',
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

  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  const confirm = typeof body.confirm === 'string' ? body.confirm.trim() : ''
  if (!slug) return fail('Slug wajib diisi.', 'BAD_SLUG', 400)
  if (confirm !== slug) {
    return fail('Konfirmasi tidak cocok (harus sama dengan slug).', 'BAD_CONFIRM', 400)
  }

  const base = (await readManifest(cfg).catch(() => null)) ?? (bundled as ScriptsManifest)
  const entry = (base.scripts ?? []).find((s) => s.slug === slug)
  if (!entry) {
    return fail(`Script "${slug}" tidak ditemukan di manifest.`, 'NOT_FOUND', 404)
  }
  if (!safeRepoPath(entry.file)) {
    return fail('Path file manifest tidak valid.', 'BAD_PATH', 400)
  }

  const manifest: ScriptsManifest = {
    scripts: (base.scripts ?? []).filter((s) => s.slug !== slug),
  }

  try {
    const manifestBlob = await createBlob(
      cfg,
      JSON.stringify(manifest, null, 2) + '\n'
    )
    const entries: TreeEntry[] = [
      { path: `public${entry.file}`, mode: '100644', type: 'blob', sha: null },
      { path: 'src/data/scripts.json', mode: '100644', type: 'blob', sha: manifestBlob },
    ]
    const commit = await commitTree(
      cfg,
      entries,
      `chore(panel): hapus script ${slug} [via ThorHub Panel]`
    )
    return NextResponse.json({
      ok: true,
      commit,
      note: 'Script dihapus dari repo. Setelah Vercel redeploy, file dan kartunya hilang dari panel.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tidak dikenal'
    return fail(`Gagal commit ke GitHub: ${message}`, 'GH_ERROR', 502)
  }
}
