const astroConfig = {"base":"/","root":"file:///home/runner/work/diesel.rs-website/diesel.rs-website/","srcDir":"file:///home/runner/work/diesel.rs-website/diesel.rs-website/src/","build":{"assets":"static"},"markdown":{"shikiConfig":{"langs":[]}}};
const ecIntegrationOptions = {"plugins":[{"hooks":{"postprocessRenderedBlock":"[Function]"},"name":"title-link"}]};
let ecConfigFileOptions = {};
try {
	ecConfigFileOptions = (await import('./ec-config-CzTTOeiV.js')).default;
} catch (e) {
	console.error('*** Failed to load Expressive Code config file "file:///home/runner/work/diesel.rs-website/diesel.rs-website/ec.config.mjs". You can ignore this message if you just renamed/removed the file.\n\n(Full error message: "' + (e?.message || e) + '")\n');
}

export { astroConfig, ecConfigFileOptions, ecIntegrationOptions };
