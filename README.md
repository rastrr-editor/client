# ![Rastrr](https://rastrr.ru/github/rastrr-title-logo.svg?v=1)

**A simple and free graphic editor for novice artists**

[Try it out!](https://rastrr.ru/)

![Demo UI](https://rastrr.ru/github/demo.png?v=1)

## Features

- Layers
- Operation history
- Projects (saved in browser)
- Customizable color palettes
- Tools: brush, eraser, shapes
- Image export

## Architecture

This project is implemented following the [Feature-Sliced Design](https://feature-sliced.design/) methodology.

**Disclaimer:** the project was originally implemented using Svelte 3. The initial version of the source code can be found [here](https://github.com/rastrr-editor/client/tree/svelte-spa).

### Pages

There is a single main page.

### Widgets

- tool panel
- about modal

### Features

- create project
- dock panels
- hotkeys manager
- tools

### Entities

- [project](./src/entities/project)
- [tool](./src/entities/tool)
- [palette](./src/entities/palette)

### Shared

- api - indexed db adapter
- lib
  - actions - svelte actions
  - decorators
  - dom - dom helpers
  - persistent store - svelte persistent store implementation
  - strings
  - typed event emitter - types for event emitter with context support
  - url - url helpers
- styles - sass theme, mixins, functions, etc.
- ui - ui-kit components

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
