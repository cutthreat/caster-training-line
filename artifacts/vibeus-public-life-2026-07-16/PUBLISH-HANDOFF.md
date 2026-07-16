# Bounded publish handoff

- Repository: `https://github.com/cutthreat/caster-training-line`
- Source branch: `codex/vibeus-public-life`
- Base branch: `main`
- Added public route only: `variants/vibeus-public-life/`
- Existing published variants are not modified.
- GitHub Pages workflow publishes from `main`.
- Expected default URL: `https://cutthreat.github.io/caster-training-line/variants/vibeus-public-life/`
- Expected comparison URLs: default plus `?hero=quantum` and `?hero=singularity`.
- Publish gate: static verifier pass, browser proof, Caster pass, Anton ready, known-route closeout pass.
- Rollback: revert the single landing commit or remove only `variants/vibeus-public-life/` and its proof packet.
