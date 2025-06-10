import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import clearConsole from 'vite-plugin-clear-console';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    clearConsole(), // 🧼 This clears the terminal
    react()
  ],
});
