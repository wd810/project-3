from flask import Flask, render_template, jsonify, request
import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
# import json
import pandas as pd
import numpy as np
import sys

from .models import *
from .pokemon_go import *
# from models import *
# from pokemon_go import *

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vsivctjqbfloss:a480a5974c31aad03363de7e8a3584f0c7393199684e6c492bd3bcbc1672f3a0@ec2-18-214-189-70.compute-1.amazonaws.com:5432/ddthvatqq2dsj1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
# db.init_app(app)
db = SQLAlchemy(app)

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
@app.route('/shape')
def shape():
    return render_template('shape.html')

@app.route('/evolution')
def evolution():
    return render_template('evolution.html')

# encounter page
@app.route('/encounter')
def encounter():
    return render_template('encounter.html')

# move page
@app.route('/move')
def move():
    return render_template('move.html')

# element page
@app.route('/elements')
def elements():
    return render_template('elements.html')

# battle predict page
@app.route('/predict')
def predict():
    return render_template('predict.html')

# battle predict api
@app.route('/pokemon-go', methods=['POST'])
def pokemon_go():
    post = request.get_json()
    pok1 = post['pok_1']
    pok2 = post['pok_2']

    full_stmt = db.session.query(PokemonBattle).statement
    full = pd.read_sql_query(full_stmt, db.session.bind)
    history_stmt = db.session.query(CombatsHistory).statement
    combats_history_df = pd.read_sql_query(history_stmt, db.session.bind)

    # battle history check list
    bat_history = combats_history_df.bat_instance.tolist()

    # initial win_rate check chart based the history data get
    win_rate = combats_history_df.groupby('battle_time').win_rate.value_counts().to_frame().rename(columns={'win_rate': 'win_num'})
    win_per = [
        100, 
        win_rate.loc[(2, 100)].win_num / (win_rate.loc[(2, 100)].win_num + win_rate.loc[(2, 50)].win_num) * 100,
        win_rate.loc[(2, 50)].win_num / (win_rate.loc[(2, 100)].win_num + win_rate.loc[(2, 50)].win_num) * 100,
        win_rate.loc[(3, 100)].win_num / (win_rate.loc[(3, 100)].win_num + win_rate.loc[(3, 66.67)].win_num) * 100,
        win_rate.loc[(3, 66.67)].win_num / (win_rate.loc[(3, 100)].win_num + win_rate.loc[(3, 66.67)].win_num) * 100,
        win_rate.loc[(4, 100)].win_num / (win_rate.loc[(4, 100)].win_num + win_rate.loc[(4, 75)].win_num) * 100,
        win_rate.loc[(4, 75)].win_num / (win_rate.loc[(4, 100)].win_num + win_rate.loc[(4, 75)].win_num) * 100,
    ]
    win_rate['per'] = np.round(win_per, decimals=2)

    win_rate_check = win_rate

    #result = post
    result = predict_winner(bat_history, combats_history_df, full, win_rate_check, pok1, pok2)
    return jsonify(result)

if(__name__ == '__main__'):
    app.run(debug = True)