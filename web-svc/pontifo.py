import os, pymongo, json
from flask import Flask, request

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def pontifo():
    return 'hello from pontifo services'

def get_relation_collection():
    c = pymongo.Connection('localhost', 27017)
    collection = c.db['relations']
    return collection

def relation_exist_p(query, collection):
    return query in collection.find({}, {query: 1})[0]
 
def relation_query_p(query, collection):
    try:
        return set(collection.find({}, {query: 1})[0][query])
    except:
        return set()

def expand(ones, collection):
    new_ones = ones.copy()
    for one in ones:
        new_ones.update(relation_query_p(one, collection))
    return new_ones

FARTHEST = 10
@app.route('/relation-score', methods=['GET'])
def relation_score():
    one = request.args.get('one', '')
    two = request.args.get('two', '')
    collection = get_relation_collection()
    if not relation_exist_p(one, collection) or not relation_exist_p(two, collection):
        return "fock"
        #return str(FARTHEST)
    ones = set([one])
    twos = set([two])
    for i in range(FARTHEST):
        if len(ones.intersection(twos)) > 0:
            return str(i)
        ones = expand(ones, collection)
        twos = expand(twos, collection)
    return str(FARTHEST)

@app.route('/remove', methods=['GET'])
def remove():
    sentence = request.args.get('s', '')
    return '0'

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

