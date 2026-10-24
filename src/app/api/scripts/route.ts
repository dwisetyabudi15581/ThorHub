import { NextResponse } from 'next/server'
import bundled from '@/data/scripts.json'
import { ghConfigFromEnv, fetchRawManifest } from '@/lib/github'
import type { ScriptsManifest } from '@/lib/scripts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/scripts
 * Manifest script yang dikelola panel. Jika GITHUB_TOKEN tersedia, manifest
 * dibaca langsung dari repo (instan setelah upload, tanpa menunggu redeploy);
 * jika tidak, memakai manifest yang di-bundled saat build.
 */
export async function GET() {
  const cfg = ghConfigFromEnv()
  if (cfg) {
    const live = await fetchRawManifest(cfg)
    if (live) {
      return NextResponse.json({ ...live, source: 'github' })
    }
  }
  return NextResponse.json({ ...(bundled as ScriptsManifest), source: 'bundled' })
}
