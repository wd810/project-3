from flask import Flask, render_template, jsonify, request
#from flask_pymongo import PyMongo
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
import json
import pandas as pd
import numpy as np
import sys

#from .models import *
from models import *

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vuncmjlkhnmans:610ac2b5df61bcd4aed66992647b94f98b0fbb4b677f4f721f09b244482d718a@ec2-54-204-41-109.compute-1.amazonaws.com/d8vgn7vtrufr72'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
db.init_app(app)

# threshhold of battle time in history
enough_history = 10
# win rate general depends on Linear Regression Model R2 score
win_rate_with_linear = 0.94
error_rate_mean = 0.04
''' 
    const data statement END !!!
'''

''' generate battle instance '''
def get_battle_instance(pok_1, pok_2):
    pok_container = [np.int(pok_1), np.int(pok_2)]
    pok_container.sort()
    battle = str(pok_container[0]) + 'vs' + str(pok_container[1])
    
    return battle

''' check battle num if battle does not have related records in hostory or record result are even '''
# win battle check is based on win_battle VS win_rate linear model
predict_win_rate = lambda x: x * 0.93 + 2.35
def check_win_battle(full, pok_id_1, pok_id_2):
    # select out pokemon series
    pok_s_1 = full.loc[full.pokemon_id == pok_id_1].T.squeeze()
    pok_s_2 = full.loc[full.pokemon_id == pok_id_2].T.squeeze()
    # check if this is a low possibility win predict
    win_rate_dif = np.abs(pok_s_1.win_rate - pok_s_2.win_rate)
    #win_bat_dif = pok_s_1.win_battle - pok_s_2.win_battle
    if win_rate_dif < error_rate_mean:
        win_rate_predict = np.round(win_rate_with_linear * win_rate_dif, decimals=2)
    else:
        win_rate_predict = win_rate_with_linear
    
    if pok_s_1.win_rate > pok_s_2.win_rate:
        win_pre = pok_s_1.pokemon_id
    else:
        win_pre = pok_s_2.pokemon_id
    
    return {'win_predict': win_pre, 'win_rate': win_rate_predict}

''' ultimate winner predict function '''
def predict_winner(bat_history, combats_history_df, full, pok_id_1, pok_id_2):
    pok_1 = np.int(pok_id_1)
    pok_2 = np.int(pok_id_2)
    # set up battle instance
    battle = get_battle_instance(pok_1, pok_2)
    
    # check if this battle has history 
    if battle in bat_history:
        # select the record out
        record = combats_history_df.loc[combats_history_df.bat_instance == battle].T.squeeze()
        
        # check if win_rate > 50%
        if record['win_rate'] > 50:
            # check if this win_rate has enough records as reference
            bat_time = record['battle_time']
            bat_num_check = bat_time + 1
            bat_sum = win_rate_check.loc[(bat_num_check)].win_num.sum()
            
            # check if bat_num data sample big enough
            if bat_sum > enough_history:
                # select valid data out (win_rate > 50)
                valid_d = win_rate_check.loc[(bat_num_check)].loc[win_rate_check.loc[(bat_num_check)].index > 50]
                win_rate = 0
                for index, row in valid_d.iterrows():
                    row_rate = np.round(index * row['per'] / 100, decimals=2)
                    win_rate = win_rate + row_rate
                win_pre = record['Winner']
                win_out = {'win_predict': win_pre, 'win_rate': win_rate}
                
            else:
                win_out = check_win_battle(full, pok_1, pok_2)
            
        else:
            win_out = check_win_battle(full, pok_1, pok_2)

    else:
        win_out = check_win_battle(full, pok_1, pok_2)
        
    return win_out

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
    bat_history = combats_history_df.bat_instance.to_list()
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
    result = predict_winner(bat_history, combats_history_df, full, pok1, pok2)
    return jsonify(result)

if(__name__ == '__main__'):
    app.run(debug = True)