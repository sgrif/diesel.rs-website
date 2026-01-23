// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';

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
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'News',
					autogenerate: { directory: 'news' },
				},
				{
					label: 'API Docs',
					autogenerate: { directory: 'api_docs' },
				},
				{
					label: 'Changelog',
					autogenerate: { directory: 'changelog' },
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
			},
			customCss: ['./src/assets/css/main.css'],
		}),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['nofollow', 'noopener', 'noreferrer']
				}
			],
		],
	},
});
