import sys, popen2

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


words = [line.strip() for line in sys.stdin]
for word in words:
    (stdout, stdin) = popen2.popen2('/usr/local/WordNet-3.0/bin/wn %s -coorn' % word)
    swords = stream_to_list(stdout)
    print word, swords
    # TODO (fto): mongo
    # zygospore ['spore', 'basidiospore', 'endospore', 'carpospore', 'chlamydospore', 'conidium', 'conidiospore', 'oospore', 'tetraspore', 'zoospore', 'pollen', 'microspore', 'megaspore', 'macrospore', 'aeciospore', 'ascospore', 'zygospore']

