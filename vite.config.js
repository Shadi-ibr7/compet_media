import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [UnoCSS()],
  server: {
    proxy: {
      '/api': {
        target: 'http:://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
// La clé API sera récupérée depuis les variables d'environnement
export const getApiKey = () => {
  const apiKey = localStorage.getItem('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error("Clé API OpenAI non trouvée. Veuillez la configurer.");
  }
  return apiKey;
};