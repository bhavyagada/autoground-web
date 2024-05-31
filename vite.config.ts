import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		define: {
			'process.env.FB_ADMIN_PRIVATE_KEY': JSON.stringify(env.FB_ADMIN_PRIVATE_KEY),
			'process.env.FB_ADMIN_CLIENT_EMAIL': JSON.stringify(env.FB_ADMIN_CLIENT_EMAIL)
		},
		plugins: [sveltekit()]
	}
});
