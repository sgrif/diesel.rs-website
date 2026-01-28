import { definePlugin } from '@expressive-code/core';

export function titleLinkPlugin() {
    return definePlugin({
        name: 'title-link',
        hooks: {
            postprocessRenderedBlock: ({ codeBlock, renderData }) => {
                // In recent versions, we parse the metadata string
                // This looks for link="url" in the code block header
                const metaMatch = codeBlock.meta.match(/link=["'](.*?)["']/);
                const link = metaMatch ? metaMatch[1] : null;

                if (!link) return;

                // Find the title element in the rendered AST
                const figure = renderData.blockAst;
                const figcaption = figure.children.find((child) => child.tagName === 'figcaption');

                if (figcaption) {
                    const titleSpan = figcaption.children.find((child) =>
                        child.properties?.className?.includes('title')
                    );

                    if (titleSpan) {
                        // Turn the span into an <a> tag
                        titleSpan.tagName = 'a';
                        titleSpan.properties.href = link;
                        titleSpan.properties.target = '_blank';
                        titleSpan.properties.rel = 'noopener noreferrer';
                        // Styling to make it look like a title but clickable
                        titleSpan.properties.style = 'color: inherit; text-decoration: none; cursor: pointer;';
                    }
                }
            },
        },
    });
}
