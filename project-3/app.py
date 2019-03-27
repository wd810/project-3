from flask import Flask, render_template, jsonify, request
#from flask_pymongo import PyMongo
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
import json
import pandas as pd
import sys
#from .models import *
from models import *

app = Flask(__name__)
#app.config['MONGO_DBNAME'] = 'pokemon_db'
#app.config['MONGO_URI'] = 'mongodb://localhost:27017/pokemon_db'
#mongo = PyMongo(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vuncmjlkhnmans:610ac2b5df61bcd4aed66992647b94f98b0fbb4b677f4f721f09b244482d718a@ec2-54-204-41-109.compute-1.amazonaws.com/d8vgn7vtrufr72'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
db.init_app(app)

def str_to_class(classname):
    return getattr(sys.modules[__name__], classname)
# homepage
@app.route('/')
def index():
    return render_template('index.html')
# postgres data checking page
@app.route('/data/<item>', methods=['GET'])
def data(item):
     # Use Pandas to perform the sql query
    c = str_to_class(item)
    stmt = db.session.query(c).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    output = []
    d = df.T.to_dict()
    for item in d:
        output.append(d[item])
    return jsonify(output)

# shape page
@app.route('/api/shape', methods=['GET'])
def api_shape():
    type_data = mongo.db.pokemon_type.find()
    output = []
    for item in type_data:
        output.append(
            {'type': item['type'], 
             'height': item['height'], 
             'weight': item['weight'], 
             'dens': item['dens'], 
             'number': item['number']
             })
    return jsonify(output)

@app.route('/shape')
def shape():
    #type_data = pokemon_type_json
    return render_template('shape.html')

@app.route('/evolution')
def evolution():
    return render_template('evolution.html')

# encounter page
@app.route('/encounter')
def generic():
    #img_list = mongo.db.Hemispheres.find()
    return render_template('encounter.html')

# element page
@app.route('/elements')
def elements():
    return render_template('elements.html')

if(__name__ == '__main__'):
    app.run(debug = True)