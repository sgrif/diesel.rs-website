// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import starlightChangelogs from 'starlight-changelogs';
import { titleLinkPlugin } from './src/plugins/ec-title-link.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'DIESEL',
			favicon: './src/assets/images/diesel_logo_favicon_32.png',
			logo: {
				src: './src/assets/images/diesel_logo_favicon.png',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/diesel-rs/diesel' }],
			sidebar: [
				{
					label: 'Guides to Diesel',
					items: [
						{ label: 'Overview', link: '/guides/' },
						{ label: 'Getting Started', link: '/guides/getting-started/' },
						{ label: 'All About Selects', link: '/guides/all-about-selects/' },
						{ label: 'All About Updates', link: '/guides/all-about-updates/' },
						{ label: 'All About Inserts', link: '/guides/all-about-inserts/' },
						{ label: 'Relations', link: '/guides/relations/' },
						{ label: 'Composing Applications with Diesel', link: '/guides/composing-applications/' },
						{ label: 'Schema in Depth', link: '/guides/schema-in-depth/' },
						{ label: 'Extending Diesel', link: '/guides/extending-diesel/' },
						{ label: 'Configuring Diesel CLI', link: '/guides/configuring-diesel-cli/' },
						{ label: 'Diesel 2.0 migration guide', link: '/guides/migration-guide/' },
					]
				},
				{
					label: 'News',
					items: [
						{ label: 'News', link: '/news/' },
						{ label: 'Diesel 2.3.0', link: '/news/2_3_0_release' },
						{ label: 'Diesel 2.2.0', link: '/news/2_2_0_release' },
						{ label: 'Diesel 2.1.0', link: '/news/2_1_0_release' },
						{ label: 'Diesel 2.0.0', link: '/news/2_0_0_release' },
					]
				},
				{
					label: 'API Docs',
					autogenerate: { directory: 'api_docs' },
				},
				{
					label: 'Changelog',
					link: '/changelog/', // This matches the "base" you set in the loader
				},
				{
					label: 'Compare Diesel',
					autogenerate: { directory: 'compare' },
				},
			],
			components: {
				// This replaces the SocialIcons area with custom component
				SocialIcons: './src/components/Header.astro',
				// Hides the theme switch - Dark is used by default
				ThemeSelect: './src/components/Theme/Empty.astro',
			},
			customCss: ['./src/assets/css/main.css'],
			plugins: [starlightChangelogs()],
			expressiveCode: {
				plugins: [titleLinkPlugin()],
			},
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
