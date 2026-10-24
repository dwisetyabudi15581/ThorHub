// Helper GitHub API (server-only). Dipakai oleh /api/upload, /api/delete, /api/scripts.
// Strategi penyimpanan: repo GitHub adalah source of truth — file .lua di public/scripts/
// + manifest src/data/scripts.json. Setiap commit memicu Vercel auto-redeploy.
import type { ScriptsManifest } from './scripts'

export type GhConfig = { token: string; repo: string; branch: string }

export function ghConfigFromEnv(): GhConfig | null {
  const token = process.env.GITHUB_TOKEN
  if (!token || token.trim().length === 0) return null
  return {
    token: token.trim(),
    repo: process.env.GITHUB_REPO || 'dwisetyabudi15581/ThorHub',
    branch: process.env.GITHUB_BRANCH || 'main',
  }
}

async function gh<T>(
  path: string,
  cfg: GhConfig,
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cfg.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'thorhub-panel',
      ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    let msg = `GitHub API ${res.status} ${res.statusText}`
    try {
      const j = JSON.parse(text) as { message?: string }
      if (j.message) msg += `: ${j.message}`
    } catch {
      /* respons bukan JSON */
    }
    throw new Error(msg)
  }
  return JSON.parse(text) as T
}

type GhBlob = { sha: string }
type GhRef = { object: { sha: string } }
type GhCommit = { sha: string; html_url: string; tree: { sha: string } }
type GhTree = { sha: string }
type GhContents = { content?: string; encoding?: string }

export type TreeEntry = {
  path: string
  mode: '100644'
  type: 'blob'
  sha: string | null
}

/** Buat blob (upload file berukuran besar aman — Git Data API, bukan Contents PUT) */
export async function createBlob(cfg: GhConfig, content: string): Promise<string> {
  const b = await gh<GhBlob>(`/repos/${cfg.repo}/git/blobs`, cfg, {
    method: 'POST',
    body: {
      content: Buffer.from(content, 'utf8').toString('base64'),
      encoding: 'base64',
    },
  })
  return b.sha
}

/** Baca manifest langsung dari repo (selalu segar, tahan upload beruntun sebelum redeploy) */
export async function readManifest(cfg: GhConfig): Promise<ScriptsManifest | null> {
  const c = await gh<GhContents>(
    `/repos/${cfg.repo}/contents/src/data/scripts.json?ref=${encodeURIComponent(cfg.branch)}`,
    cfg
  )
  if (!c.content) return null
  try {
    const parsed = JSON.parse(
      Buffer.from(c.content, 'base64').toString('utf8')
    ) as ScriptsManifest
    return Array.isArray(parsed?.scripts) ? parsed : null
  } catch {
    return null
  }
}

/** Baca manifest dari repo; null jika gagal (mis. file belum ada / token kosong) */
export async function fetchRawManifest(cfg: GhConfig): Promise<ScriptsManifest | null> {
  try {
    return await readManifest(cfg)
  } catch {
    return null
  }
}

/**
 * Commit beberapa file sekaligus ke branch target lewat Git Data API:
 * blob -> tree (base_tree HEAD) -> commit -> update ref.
 * Entri dengan sha: null menghapus file pada path tersebut.
 */
export async function commitTree(
  cfg: GhConfig,
  entries: TreeEntry[],
  message: string
): Promise<{ sha: string; url: string }> {
  const ref = await gh<GhRef>(
    `/repos/${cfg.repo}/git/ref/heads/${encodeURIComponent(cfg.branch)}`,
    cfg
  )
  const headSha = ref.object.sha
  const headCommit = await gh<GhCommit>(
    `/repos/${cfg.repo}/git/commits/${headSha}`,
    cfg
  )
  const tree = await gh<GhTree>(`/repos/${cfg.repo}/git/trees`, cfg, {
    method: 'POST',
    body: { base_tree: headCommit.tree.sha, tree: entries },
  })
  const commit = await gh<GhCommit>(`/repos/${cfg.repo}/git/commits`, cfg, {
    method: 'POST',
    body: { message, tree: tree.sha, parents: [headSha] },
  })
  await gh<GhRef>(
    `/repos/${cfg.repo}/git/refs/heads/${encodeURIComponent(cfg.branch)}`,
    cfg,
    { method: 'PATCH', body: { sha: commit.sha } }
  )
  return { sha: commit.sha, url: commit.html_url }
}

/** Validasi path file publik dari manifest (cek traversal) */
export function safeRepoPath(file: string): boolean {
  return typeof file === 'string' && file.startsWith('/') && !file.includes('..')
}
