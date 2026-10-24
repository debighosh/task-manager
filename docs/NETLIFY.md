# Deploying to Netlify

`netlify.toml` builds this Vite app with pnpm and publishes `dist/`. The API base URL is not in the repo. Set it in Netlify when the Railway host is known.

## Connect the site

1. In Netlify, add a site from Git and authorize the GitHub repository.
2. Leave the production branch as `main` unless you intend to deploy another branch.
3. Netlify reads `netlify.toml`. The build command is `pnpm run build` and the publish directory is `dist`. Node is pinned to 22 in that file. pnpm is pinned to 10.33.4 by the `packageManager` field in `package.json`, which Netlify's Corepack uses because `pnpm-lock.yaml` is present. You do not need to re-enter those in the UI.

## Set `VITE_API_URL`

1. In the site settings, open Environment variables.
2. Add `VITE_API_URL` with the TaskFlow API origin, for example `https://your-api.up.railway.app`.
3. Scope it to the builds that should call that API (production, and deploy previews if those should hit the same backend).

Vite reads `VITE_*` variables while it bundles. The value is compiled into the static JavaScript in `dist/`. Saving a new value in Netlify does nothing to the site that is already published. After every change to `VITE_API_URL`, start a new deploy so the variable is baked in again. Clear the build cache on that deploy if a previous build cached the old bundle.

The variable is documented in `.env.example`. For a local production build, copy that file to `.env` (gitignored) and run `pnpm run build`.

## Allow the Netlify origin on the API

The browser calls Railway from the Netlify site origin, so the Spring Boot API has to allow that origin in CORS. After the first deploy, copy the site URL (and any deploy-preview host you actually use) into the backend's allowed origins. A preview URL is a different origin from the production URL. Until CORS allows the origin you are browsing, the frontend will load and the API calls will fail in the browser.
