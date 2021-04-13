%.html:
	mkdir -p out/$(dir $@)
	pandoc -t html5 --template=template.html -F code-block-filter.py src/$*.md -o out/$*.html --css ../assets/stylesheets/application.css -s

guides: guides/all-about-updates.html guides/all-about-inserts.html guides/composing-applications.html guides/configuring-diesel-cli.html guides/extending-diesel.html guides/getting-started.html guides/index.html guides/schema-in-depth.html
	mkdir -p out/guides/all-about-updates
	mkdir -p out/guides/all-about-inserts
	mkdir -p out/guides/composing-applications
	mkdir -p out/guides/configuring-diesel-cli
	mkdir -p out/guides/extending-diesel
	mkdir -p out/guides/getting-started
	mkdir -p out/guides/schema-in-depth
	ln -sf ../schema-in-depth.html out/guides/schema-in-depth/index.html
	ln -sf ../getting-started.html out/guides/getting-started/index.html
	ln -sf ../extending-diesel.html out/guides/extending-diesel/index.html
	ln -sf ../configuring-diesel-cli.html out/guides/configuring-diesel-cli/index.html
	ln -sf ../composing-applications.html out/guides/composing-applications/index.html
	ln -sf ../all-about-inserts.html out/guides/all-about-inserts/index.html
	ln -sf ../all-about-updates.html out/guides/all-about-updates/index.html


docs: docs/index.html

page: index.html guides docs
	cp assets/ out -r

clean:
	rm out -r
