import tenjin, sys

def indent(lines,n):
    return map(lambda l: (' ' * n) + l, lines)

def render(name):
    f = open(name, 'r')
    input = f.read()
    f.close()

    template = tenjin.Template(None)
    template.convert(input)
    
    body = []
    body += ['_buf = []']
    body += template.script.split('\n')
    body += ["return ''.join(_buf)"]

    p = []
    p += ["from templateUtil import to_str,escape"]
    p += ['def render(e):']
    p += indent(body,4)
    return '\n'.join(p)

print render(sys.argv[1])