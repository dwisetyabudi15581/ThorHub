// Tipe & helper bersama untuk manifest script ThorHub (dipakai client + server)
export type ScriptEntry = {
  slug: string
  name: string
  game: string
  gameId?: number
  version: string
  description: string
  /** Path publik file relatif root situs, mis. "/ThorHub.lua" atau "/scripts/nama.lua" */
  file: string
  sizeBytes: number
  updatedAt: string
  features: string[]
}

export type ScriptsManifest = {
  scripts: ScriptEntry[]
}

export const GITHUB_REPO_DEFAULT = 'dwisetyabudi15581/ThorHub'
export const GITHUB_BRANCH_DEFAULT = 'main'

export function githubRawUrl(file: string): string {
  return `https://raw.githubusercontent.com/${GITHUB_REPO_DEFAULT}/${GITHUB_BRANCH_DEFAULT}/public${file}`
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function formatDateId(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

export function loadstringFor(
  origin: string,
  file: string,
  mode: 'domain' | 'github'
): string {
  const url = mode === 'github' ? githubRawUrl(file) : `${origin}${file}`
  return `loadstring(game:HttpGet("${url}"))()`
}
