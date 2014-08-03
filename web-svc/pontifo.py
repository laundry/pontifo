import os
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def pontifo():
    return 'hello from pontifo services'

@app.route('/score', methods=['GET'])
def score():
    one = request.args.get('one', '')
    two = request.args.get('two', '')
    return "[%s] to [%s]" % (one, two)

@app.route('/remove', methods=['GET'])
def remove():
    sentence = request.args.get('s', '')
    return '0'
