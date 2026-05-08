## VueUse auto-imports

- All VueUse composables are available and auto-imported in this project.
- Do not add runtime imports from `@vueuse/core` for standard composables unless there is a specific reason.
- Prefer the existing auto-import convention when using helpers such as `useMediaQuery`, `useWindowSize`, `useEventListener`, and similar VueUse composables.
- If you need to confirm availability, check `src/app/auto-imports.d.ts`.

## Nuxt UI documentation access

- When working with Nuxt UI, `https://ui.nuxt.com/llms.txt` can be fetched to access the structured documentation index for Nuxt UI, including links to component, composable, and theming.
