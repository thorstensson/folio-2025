![Static Badge](https://img.shields.io/badge/Nuxt3-green)

# Portfolio, first push

Repo for my upcoming portfolio. This is early work in progress; expect a 'full' folio early April. For the early April release, expect to see sections: Home, Work, Photography, and Contact. Later on in April, there will also come a blog session, where I will write about just about anything: code, life, art.

Toolbox: VSCode, GraphQL, Hygraph, Nuxt, Pixi 8, Lenis, GSAP.

To fork this, please remix and redesign.

I will be back. :penguin:

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Fixed

- [X] Changed the text scroller into a GSAP text scroller, see this [GSAP community post](https://gsap.com/community/forums/topic/42921-horizontal-infinite-text-loop-without-empty-spaces/)

- [X] Updated CSS for most wrappers.

- [X] Made the ThreeJS scene full screen and fixed responsive resize issue.

- [X] Added apple style toggle switch for audio, using v-model, credits to the original CSS solution here https://dev.to/urielbitton/how-to-design-an-ios-style-switch-4maj - which I've now adpoted into Vue.
.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## More on Nuxt 3

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information :penguin: