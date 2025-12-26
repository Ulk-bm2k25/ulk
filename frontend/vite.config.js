import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()/*, tailwindcss()*/],
  server: {
    port: 5173,
    open: true,
    //open: '/src/projet2/statistiques/index.html',
  },
});