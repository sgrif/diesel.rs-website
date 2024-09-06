#!/usr/bin/env python3

"""
Pandoc filter to postprocess code blocks from our guides
"""

import json
from pandocfilters import toJSONFilter, RawBlock, Div

def html(x):
    return RawBlock('html', x)

backend_map = {'postgres': 'PostgreSQL', 'sqlite': 'SQLite', 'mysql': 'MySQL'}

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
        if "shared-example" in classes:
            backends = [x[1] for x in kvs if x[0] == "backends"][0].split(",")
            kvs = [x for x in kvs if x[0] != "backends"]
            backends = [b.strip() for b in backends]
            out = []
            [block] = content
            out = []
            for b in backends:
                copy_block = json.loads(json.dumps(block))
                [link, code_block] = copy_block['c'][1]
                link['c'][0]['c'][2][0] = link['c'][0]['c'][2][0].replace('$backend', b)
                link['c'][0]['c'][1][0]['c'] = link['c'][0]['c'][1][0]['c'] + " (" + backend_map[b] + ")"
                out.append(Div([ident, [b + "-example"], kvs ], [copy_block]))
            return Div(["", [], []], out)

if __name__ == "__main__":
  toJSONFilter(behead)
