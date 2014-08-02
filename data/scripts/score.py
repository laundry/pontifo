import sys, popen2, json

def expand(ones, relations):
    new_ones = ones.copy()
    for one in ones:
        if one in relations:
            new_ones.update(relations[one])
    return new_ones

FARTHEST = 10
def score(one, two, relations):
    ones = set([one])
    twos = set([two])
    for i in range(FARTHEST):
        if len(ones.intersection(twos)) > 0:
            return i
        ones = expand(ones, relations)
        twos = expand(twos, relations)
    return FARTHEST

lines = ''.join([line for line in sys.stdin])
relations = json.loads(lines)
print relations['member']

print score('member', 'material', relations)
print score(sys.argv[1], sys.argv[2], relations)

