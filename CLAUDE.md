# rugby-oudsbergen

Redesign proposal for rugbyoudsbergen.be. Static site: `src/` -> `npm run build` -> `dist/`, deployed to GitHub Pages on push to `main`.

## Git

- Commit and push straight to `main`, no feature branches and no asking first: every push is the deploy.
- The robair-superpowers hook blocks pushes from `main`; push with `CLAUDE_ALLOW_DANGEROUS_GIT=1 git push`.
- After pushing, watch the Pages run (`gh run watch`) and confirm the live site changed.
