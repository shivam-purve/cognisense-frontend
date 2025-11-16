# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Extension: Dev & Load Instructions

**✅ All necessary files are now properly configured!**

To load the extension during development or after building:

### Quick Development Load (no build required):

1. Open `chrome://extensions` (or `edge://extensions`) in your browser
2. Enable "Developer mode"  
3. Click "Load unpacked" and select the `footprint-extension` folder

### Production Build + Load:

1. From the `footprint-extension` folder run:
   ```bash
   npm install
   npm run build
   ```

2. Load the generated `dist` folder as an unpacked extension in the browser

### What was fixed:
- ✅ Added root `manifest.json` (copied from `public/manifest.json`)
- ✅ Fixed `vite-plugin-static-copy` version from `^0.24.0` to `^3.1.4` 
- ✅ Verified build works and generates correct `dist` structure
- ✅ Confirmed all entry points exist: `background/background.js`, `content/contentScript.js`, `popup/`, `options/`

The extension is now ready to load and should work properly in Chrome/Edge!