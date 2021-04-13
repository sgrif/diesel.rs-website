#!/usr/bin/env python3

"""
Pandoc filter to convert all level 2+ headings to paragraphs with
emphasized text.
"""

from pandocfilters import toJSONFilter, RawBlock, Div

def html(x):
    return RawBlock('html', x)


def behead(key, value, format, meta):
    if key == 'Div':
        [[ident, classes, kvs], content] = value
        if "code-block" in classes:
            [link, code_block] = content
            source_file = ""
            for s in link['c'][0]['c'][1]:
                if s['t'] == 'Str':
                    source_file += str(s['c'])
                elif s['t'] == 'Space':
                    source_file += ' '
            target = link['c'][0]['c'][2][0]
            github_link = html('<a class = "btn-demo-example" href = "'+ target + '">View on GitHub</a>')
            browser_bar = Div([ident, ['browser-bar'], kvs], [html(source_file)])
            if len(target.strip()) == 0:
                browser_content = [browser_bar, code_block]
            else:
                browser_content = [browser_bar, github_link, code_block]

            demo_example_browser = Div([ident, ['demo__example-browser'], kvs],
                                       browser_content)
            return Div([ident, ['demo__example'], kvs], [demo_example_browser])

if __name__ == "__main__":
  toJSONFilter(behead)
