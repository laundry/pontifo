import sys, popen2, json

def stream_to_list(stream):
    lines = [line.strip() for line in stream]
    i = 0
    for line in lines:
        if 'Sense' in line:
            break
        i += 1
    swords = []
    for line in lines[i:]:
        if len(line) == 0 or 'Sense ' in line:
            continue
        words = []
        if '->' in line:
            line = line.split('->')[1]
            words = [word.strip() for word in line.split(',')]
        if '=>' in line:
            line = line.split('=>')[1]
            words = [word.strip() for word in line.split(',')]
        words = [word for word in words if ' ' not in word]
        swords.extend(words)
    return swords

def json_dump(relations):
    return json.dumps(relations, sort_keys=True, indent=4, separators=(',', ': '))

def json_load(string):
    return json.loads(string)

words = [line.strip() for line in sys.stdin]
relations = {}
for word in words:
    (stdout, stdin) = popen2.popen2('/usr/local/WordNet-3.0/bin/wn %s -coorn' % word)
    swords = stream_to_list(stdout)
    print word, swords
    relations[word] = swords
    # TODO (fto): mongo
    # zygospore ['spore', 'basidiospore', 'endospore', 'carpospore', 'chlamydospore', 'conidium', 'conidiospore', 'oospore', 'tetraspore', 'zoospore', 'pollen', 'microspore', 'megaspore', 'macrospore', 'aeciospore', 'ascospore', 'zygospore']
open(sys.argv[1], 'w').write(json_dump(relations))
