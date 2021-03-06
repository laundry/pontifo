import os, pymongo, json, random, nltk
from flask import Flask, request, redirect, make_response

app = Flask(__name__)
app.config['DEBUG'] = True
local = False

@app.route('/')
def pontifo():
    return 'hello from pontifo services'

@app.route('/typer/<t>')
def typer(t):
    return redirect('http://periodic-typer.herokuapp.com/typer/' + t)

##
# part of speech

def pos_tag_p(banana):
    nltk.data.path = ['./data']
    return nltk.tag.pos_tag(banana)

@app.route('/pos', methods=['GET'])
def pos_tag():
    query = request.args.get('s', '')
    return str(pos_tag_p(query.split(' ')))

@app.route('/pos-test', methods=['GET'])
def pos_tagg():
    query = request.args.get('s', '')
    m = dict(pos_tag_p(query.split(' ')))
    return str([(m[pk], m[pk].find('NN') != -1) for pk in m.keys()])

def is_good_pos(pos):
    return pos.find('NN') >= 0 or pos.find('PRP') >= 0

##
# word relations

def get_relation_collection():
    if local:
        c = pymongo.MongoClient('localhost:27017')
    else:
        # MONGOLAB
        c = pymongo.MongoClient('mongodb://pontifo:infopot@ds061199.mongolab.com:61199/heroku_app28075733')
        # MONGOHQ c = pymongo.MongoClient('mongodb://pontifo:infopot@kahana.mongohq.com:10061/app28075733')
        #c.the_database.authenticate('pontifo', 'infopot', source='relations')
    collection = c.get_default_database()['relations']
    return collection

def relation_exist_p(query, collection):
    return len(query) > 2 and query in collection.find({}, {query: 1})[0]
 
def relation_query_p(query, collection):
    try:
        return set(collection.find({}, {query: 1})[0][query])
    except:
        return set()

def expand(ones, collection, new_ones=set()):
    for one in ones:
        new_ones.update(relation_query_p(one, collection))
    return new_ones

FARTHEST = 10
def distance_score(one, two, collection):
    if not relation_exist_p(one, collection) or not relation_exist_p(two, collection):
        return FARTHEST
    ones = set([one])
    twos = set([two])
    for i in range(FARTHEST):
        if len(ones.intersection(twos)) > 0:
            return i
        ones = expand(ones, collection, new_ones=set(ones.copy()))
        twos = expand(twos, collection, new_ones=set(twos.copy()))
    return FARTHEST

def hint_by_distance(target, distance, collection):
    if not relation_exist_p(target, collection):
        return ''
    rolling = set([target])
    for i in range(int(distance)):
        rolling = expand(rolling, collection, new_ones=set())
    if len(rolling) == 0:
        return ''
    return random.sample(rolling, 1)[0]

@app.route('/relation-score', methods=['GET'])
def relation_score():
    one = request.args.get('one', '')
    two = request.args.get('two', '')
    collection = get_relation_collection()
    sout = str(distance_score(one, two, collection))
    resp = make_response(sout,200)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

@app.route('/relation-query', methods=['GET'])
def relation_query():
    collection = get_relation_collection()
    query = request.args.get('q', '')
    return str(relation_query_p(query, collection))
    
@app.route('/relation-exist', methods=['GET'])
def relation_exist():
    collection = get_relation_collection()
    query = request.args.get('q', '')
    return str(relation_exist_p(query, collection))
    
@app.route('/relation-list')
def relation_list():
    collection = get_relation_collection()
    return str(collection.find({})[0].keys())
    
@app.route('/relation-load')
def relation_load():
    collection = get_relation_collection()
    relations = json.loads(''.join([line for line in open('./data/relations.json')]))
    collection.insert(relations)
    return 'loaded'

@app.route('/relation-load-heavy')
def relation_load_heavy():
    collection = get_relation_collection()
    relations = json.loads(''.join([line for line in open('./data/heavy-relations.json')]))
    collection.insert(relations)
    return 'loaded'

##
# TODO (fto): rhyming

##
# game operations

def remove_p(banana, collection):
    removal_candidates = []
    banana_pos = dict(pos_tag_p(banana))
    for i in range(len(banana)):
        if relation_exist_p(banana[i], collection) and is_good_pos(banana_pos[banana[i]]):
            removal_candidates.append(i)
    if len(removal_candidates) == 0:
        return -1
    return random.sample(removal_candidates, 1)[0]

@app.route('/remove', methods=['GET'])
def remove():
    sentence = request.args.get('s', '')
    collection = get_relation_collection()
    banana = sentence.split(' ')
    return str(remove_p(banana, collection))

@app.route('/hint', methods=['GET'])
def hint():
    target = request.args.get('target', '')
    distance = request.args.get('distance', 1)
    collection = get_relation_collection()
    sout = str(hint_by_distance(target, distance, collection))
    resp = make_response(sout,200)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

