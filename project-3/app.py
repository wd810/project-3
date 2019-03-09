from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
import json
import pandas as pd
import sys
#from models import *
db = SQLAlchemy()
# Create color database model
class BaseModel(db.Model):
    """Base data model for all objects"""
    __abstract__ = True
'''
    def __init__(self, *args):
        super().__init__(*args)

    def __repr__(self):
        """Define a base way to print models"""
        return '%s(%s)' % (self.__class__.__name__, {
            column: value
            for column, value in self._to_dict().items()
        })

    def json(self):
        """
                Define a base way to jsonify models, dealing with datetime objects
        """
        return {
            column: value if not isinstance(value, datetime.date) else value.strftime('%Y-%m-%d')
            for column, value in self._to_dict().items()
        }
        '''

class Color(BaseModel, db.Model):
    __tablename__ = "color"
    name = db.Column(db.String(120), primary_key=True)
    number = db.Column(db.Integer, unique=False)

class Shape(BaseModel, db.Model):
    __tablename__ = 'shape'
    name = db.Column(db.String(120), primary_key=True)
    type = db.Column(db.String(120), unique=False)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    id = db.Column(db.Integer)

class TypeAvg(BaseModel, db.Model):
    __tablename__ = 'type_avg_final'
    type = db.Column(db.String(120), primary_key=True)
    number = db.Column(db.Integer)
    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    dens = db.Column(db.Float)
    experience = db.Column(db.Float)

class EvolveType(BaseModel, db.Model):
    __tablename__ = 'evol_type'
    stage = db.Column(db.Integer, primary_key=True)
    chain = db.Column(db.Integer)

class EvolveTwoStage(BaseModel, db.Model):
    __tablename__ = 'two_stage'
    evl_id = db.Column(db.Integer, primary_key=True)
    chain = db.Column(db.String(120))
    stage_change = db.Column(db.Integer)
    weight_change = db.Column(db.Integer)

class EvolveThreeStage(BaseModel, db.Model):
    __tablename__ = 'three_stage_v'
    evl_id = db.Column(db.Integer, primary_key=True)
    chain = db.Column(db.String(120))
    height_change = db.Column(db.Integer)
    weight_change = db.Column(db.Integer)
    step1 = db.Column(db.Integer)
    step2 = db.Column(db.Integer)
    weight_1 = db.Column(db.Integer)
    weight_2 = db.Column(db.Integer)

class EvlTwoInPerCentent(BaseModel, db.Model):
    __tablename__ = 'evl_two'
    chain = db.Column(db.String(120), primary_key=True)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    experience = db.Column(db.Integer)

class EvlThreeInPerCentent(BaseModel, db.Model):
    __tablename__ = 'evl_three'
    chain = db.Column(db.String(120), primary_key=True)
    height_1 = db.Column(db.Integer)
    height_2 = db.Column(db.Integer)
    weight_1 = db.Column(db.Integer)
    weight_2 = db.Column(db.Integer)
    experience_1 = db.Column(db.Integer)
    experience_2 = db.Column(db.Integer)

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'pokemon_db'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/pokemon_db'
mongo = PyMongo(app)

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
# element page
@app.route('/elements')
def elements():
    return render_template('elements.html')

# generic page
@app.route('/generic')
def generic():
    #img_list = mongo.db.Hemispheres.find()
    return render_template('generic.html')

if(__name__ == '__main__'):
    app.run(debug = True)