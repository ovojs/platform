# OvO Platform

🥳 Monorepo for the OvO platform.

## Workspaces

This monorepo uses [bun](https://bun.sh) as the package manager, because [npm workspace](https://docs.npmjs.com/cli/v10/using-npm/workspaces) sucks but [pnpm](https://pnpm.io) has an extra configuration file for workspaces :(

- [apps](./apps) - Applications that consist the OvO platform, web apps, API server, periodic tasks, etc.
- [internal](./internal) - Packages used by [apps](./apps), entangled with OvO.
- [packages](./packages) - Packages used by [apps](./apps), independent of OvO.
- [deploy](./deploy) - Configurations for deploying the OvO platform on Docker, Kubernetes, etc.
- [scripts](./scripts) - Miscellaneous scripts for testing, benchmarking, etc.
