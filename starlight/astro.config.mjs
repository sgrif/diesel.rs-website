// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'DIESEL',
			logo: {
				src: './src/assets/images/diesel_logo_favicon.png',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/diesel-rs/diesel' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started with Diesel', slug: 'guides/getting-started' },
					],
				},
				{
					label: 'Compare Diesel',
					autogenerate: { directory: 'compare' },
				},
			],
			components: {
				// This replaces the SocialIcons area with custom component
				SocialIcons: './src/components/Header.astro',
				Footer: './src/components/Footer.astro',
			}
		}),
	],
});
