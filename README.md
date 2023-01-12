# ![Rastrr](https://rastrr.ru/github/rastrr-title-logo.svg?v=1)

**A simple and free graphic editor for novice artists**

![Demo UI](https://rastrr.ru/github/demo.png)

## Features

- Layers
- Operation history
- Projects (saved in browser)
- Customizable color palettes
- Tools: brush, eraser, shapes
- Image export

## For developers

### Quick Start

1. Create `.npmrc` file in the root directory with given contents:
   ```
   @rastrr-editor:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=<PERSONAL ACCESS TOKEN WITH read:packages SCOPE>
   ```
2. `npm i`
3. `npm run dev`

### NPM Scripts

- `npm run format` - format code using prettier
- `npm run check` - check code for svelte errors
- `npm run format:check` - check formatting errors
- `npm run build` - build project
- `npm run preview` - launch built project
- `npm run lint` - lint code

### VSCode Setup

Add this to `.vscode/settings.json`:

```JSON
{
  "editor.tabSize": 2,
  "typescript.tsdk": "node_modules\\typescript\\lib",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "svelte.enable-ts-plugin": true
}
```
