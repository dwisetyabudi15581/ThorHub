# THORHUB

> Luarmor-style Roblox script hosting — auto-indexed, served entirely from Vercel's edge network.

![runtime](https://img.shields.io/badge/runtime-Vercel%20Edge-3b82f6) ![indexing](https://img.shields.io/badge/indexing-GitHub%20Actions-fbbf24) ![keys](https://img.shields.io/badge/key%20system-none-34d399) ![deps](https://img.shields.io/badge/dependencies-zero-8fa0b8)

**Live site:** `https://thorhub.vercel.app`

## What this is

A tiny static "script hub" platform — think Luarmor, minus the key system:

| Path | What it does |
|------|--------------|
| `public/scripts/<game>/*.lua` | Every script is directly downloadable at `https://thorhub.vercel.app/scripts/<game>/<file>.lua` |
| `public/index.html` | Dark catalog page listing **every** hosted script with a copyable loadstring. Auto-regenerated — never edit by hand |
| `public/404.html` | Branded 404 for mistyped script URLs (also auto-generated) |
| `tools/generate_index.py` | The generator (pure Python stdlib, zero dependencies) |
| `config.json` | Base URL + site branding used by the generator |
| `.github/workflows/update-index.yml` | Regenerates the index on every push that touches `public/scripts/**` |

Runtime and authoring are fully decoupled:

```
authoring :  you  →  GitHub web UI (upload .lua)  →  Actions re-index  →  Vercel auto-deploy
runtime   :  Roblox executor  →  HttpGet  →  thorhub.vercel.app        (GitHub never contacted)
```

Even if the GitHub repo disappears, the last Vercel deployment keeps serving every loadstring. No personal tokens exist anywhere in this repo — the Action uses the runner's built-in `GITHUB_TOKEN`.

## Deploy to Vercel (once, ~2 minutes)

1. Log in at [vercel.com](https://vercel.com) with the **same GitHub account** that owns this repo (`dwisetyabudi15581`).
2. **Add New → Project** → import the `thorhub` repo.
3. Name the project exactly **`thorhub`** so it claims `thorhub.vercel.app`. Leave every build setting empty — the site is pre-built static. **The dashboard framework preset doesn't matter:** `vercel.json` ships `"framework": null`, which overrides the preset per-deployment (this is what fixes builds that fail with `NEXT_NO_VERSION` / "built using `next build`" when the project was imported with the Next.js preset). With no framework selected, Vercel serves the `public/` directory as-is.
4. Click **Deploy**. Done — `https://thorhub.vercel.app` is live.

> If the name `thorhub` is taken, Vercel appends a random suffix. Either rename the project in Settings, or connect any custom domain under Settings → Domains. Then update `base_url` in `config.json` — the index regenerates itself on the next push. (Note: the *Steal an Egg* build embeds an auto-load-after-teleport URL pointing at `thorhub.vercel.app/scripts/steal-an-egg/ThorHub.lua` — if you change the domain, that embedded URL must be rebuilt too.)

## Add a new game (the Luarmor workflow)

1. GitHub → `public/scripts` → **Add file → Upload files**.
2. In the filename box, type your folder name **with a trailing slash** (e.g. `pet-sim-99/`) — this creates the folder — then drop `ThorHub.lua` (any `.lua` filename works).
3. Optional: add `info.json` in the same folder:

   ```json
   {
     "title": "Pet Sim 99",
     "description": "Auto-farm, hatch & trade helper",
     "status": "working",
     "version": "1.0.0"
   }
   ```

   `status` accepts `working` / `maintenance` / `down` (controls the badge color).

4. Commit → the Action regenerates the index → Vercel deploys (~1 min). New loadstring, zero dashboard clicks:

   ```lua
   loadstring(game:HttpGet("https://thorhub.vercel.app/scripts/pet-sim-99/ThorHub.lua"))()
   ```

No Vercel dashboard, no CLI, no tokens. URL paths are **case-sensitive** — keep them lowercase.

> Note: uploads produce two quick deployments (your commit, then the indexer's commit). The second one always carries the fresh index — wait ~60 seconds after committing before sharing the new loadstring.

## Panduan cepat (ID)

1. **Deploy sekali:** login [vercel.com](https://vercel.com) pakai GitHub `dwisetyabudi15581` → Add New → Project → import repo `thorhub` → pastikan nama project **`thorhub`** → Deploy.
2. **Loadstring utama (Steal an Egg):**
   ```lua
   loadstring(game:HttpGet("https://thorhub.vercel.app/scripts/steal-an-egg/ThorHub.lua"))()
   ```
3. **Nambah game baru:** buka folder `public/scripts` di GitHub → Add file → Upload files → ketik nama folder diakhiri `/` (mis. `pet-sim-99/`) → upload file `.lua` → Commit. Index & loadstring baru otomatis hidup dalam ±1 menit.
4. **Ganti domain?** edit `config.json` (field `base_url`) → commit → index regenerate sendiri. URL auto-load teleport di dalam script Steal an Egg perlu di-rebuild bila domain berubah.

## Local preview

```bash
python3 tools/generate_index.py
python3 -m http.server -d public 8000
# open http://localhost:8000
```

## Hosted scripts

| Game | Status | Loadstring URL |
|------|--------|----------------|
| Steal an Egg | working | `https://thorhub.vercel.app/scripts/steal-an-egg/ThorHub.lua` |

*(This table is illustrative — the live, always-current list is the index page itself.)*

## Vendored files

| File | Origin | Why |
|------|--------|-----|
| `public/vendor/DiscordLink.lua` | tienkhanh1/spicy | The in-game Discord popup is served from this domain, not GitHub. Edit `INVITE_URL` inside it to point the popup at **your own** Discord server. |

The Venyx UI library itself is loaded from Luarmor's own CDN (`api.luarmor.net`) via the original author's redirector — deliberately left untouched, since it is Luarmor's protected distribution channel and the most stable link in the chain. Runtime dependencies: `thorhub.vercel.app` (self) + Luarmor CDN. GitHub is never contacted by the game client.

## Notes

- The `Steal an Egg` script is a ThorHub rebrand of the original Chilli Hub build (credits: tienkhanh1). It is keyless and was audited to contain no telemetry/webhooks.
- **Executor compatibility (v1.4):** the loader embeds a pure-Luau polyfill of the full `buffer` library (26 functions). It auto-installs **only** when the executor has no complete native `buffer` (common on Delta, Codex, Arceus X, Hydrogen, Fluxus, Solara and older PC executors), which previously made the loadstring fail with "[ThorHub] Executor tidak mendukung library buffer". The polyfill is byte-exact with native Luau semantics — validated with 6,318 differential tests against the official `luau` CLI, and references in the payload are renamed to a non-builtin global so it also survives executors that resolve builtin globals through the VM import registry.
- For educational purposes only. Not affiliated with Roblox Corporation. Using scripts violates Roblox ToS — use at your own risk.
