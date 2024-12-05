%.html: venv
	mkdir -p out/$(dir $@)
	. $(VENV)/activate && pandoc -t html5 --template=template.html -F code-block-filter.py --lua-filter=anchor-links.lua src/$*.md -o out/$*.html -s --syntax-definition=toml.xml --highlight-style=diesel.theme

page: index.html compare_diesel.html guides docs news changelog
	cp -R assets/ out

guides: guides/all-about-updates.html guides/all-about-inserts.html guides/composing-applications.html guides/configuring-diesel-cli.html guides/extending-diesel.html guides/getting-started.html guides/index.html guides/schema-in-depth.html guides/migration_guide.html guides/relations.html
	cp -R src/guides/all-about-inserts/ out/guides/all-about-inserts/ 
	cp -R src/guides/all-about-updates/ out/guides/all-about-updates/
	cp -R src/guides/composing-applications/ out/guides/composing-applications/
	cp -R src/guides/configuring-diesel-cli/ out/guides/configuring-diesel-cli/
	cp -R src/guides/extending-diesel/ out/guides/extending-diesel/
	cp -R src/guides/getting-started/ out/guides/getting-started/
	cp -R src/guides/schema-in-depth/ out/guides/schema-in-depth/
	cp -R src/guides/relations/ out/guides/relations

news: news/index.html news/2_0_0_release.html news/2_1_0_release.html news/2_2_0_release.html

changelog: changelog.html

docs: docs/index.html

clean:
	rm out -r

include Makefile.venv
