import pandas as pd
import numpy as np

'''
    const data statement 
'''
# threshhold of battle time in history
enough_history = 100
# win rate general depends on Linear Regression Model R2 score
win_rate_with_linear = 88
error_rate_mean = 15
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
        exp_rate_1 = predict_win_rate(pok_s_1.win_battle)
        exp_rate_2 = predict_win_rate(pok_s_2.win_battle)
        exp_dif = np.abs(exp_rate_1 - exp_rate_2)
        rate_dif = np.abs(exp_dif - win_rate_dif)
        if exp_dif >= win_rate_dif:
            win_rate_predict = np.round(win_rate_with_linear * win_rate_dif / 100, decimals=2)
        else:
            win_rate_predict = np.round(win_rate_with_linear * (win_rate_dif + rate_dif) / 100, decimals=2)
    else:
        win_rate_predict = win_rate_with_linear
    
    if pok_s_1.win_rate > pok_s_2.win_rate:
        win_pre = pok_s_1.pokemon_id
    else:
        win_pre = pok_s_2.pokemon_id
    
    return {'win_predict': win_pre, 'win_rate': win_rate_predict}

''' ultimate winner predict function '''
def predict_winner(bat_history, combats_history_df, full, win_rate_check, pok_id_1, pok_id_2):
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