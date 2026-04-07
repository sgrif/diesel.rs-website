let userCollections;
			try {
				userCollections = (await import('./content.config-CoI18LSM.js')).collections;
			} catch {}
			const collections = userCollections;

export { collections };
