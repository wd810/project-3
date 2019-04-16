from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
# Create color database model
class BaseModel(db.Model):
    """Base data model for all objects"""
    __abstract__ = True

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

class AreaNumMethods(BaseModel, db.Model):
    __tablename__ = 'num_method'
    index = db.Column(db.Integer, primary_key=True)
    num_method_to_catch = db.Column(db.Integer)
    rate = db.Column(db.Float)

class CatchRateMethod(BaseModel, db.Model):
    __tablename__ = 'catch_rate_method'
    num_method_to_catch = db.Column(db.Integer, primary_key=True)
    avg_catch_one_pokemon = db.Column(db.Float)
    num_pokemon_encounter = db.Column(db.Float)

class MoveDamageClass(BaseModel, db.Model):
    __tablename__ = 'move_damage_class'
    damage_class = db.Column(db.String(120), primary_key=True)
    count = db.Column(db.Integer)
    accuracy = db.Column(db.Float)
    power = db.Column(db.Float)
    per = db.Column(db.Float)

class CombatsHistory(BaseModel, db.Model):
    __tablename__ = 'combats_history'
    bat_instance = db.Column(db.String(120), primary_key=True)
    Winner = db.Column(db.Integer)
    battle_time = db.Column(db.Integer)
    win_rate = db.Column(db.Float)

class PokemonBattle(BaseModel, db.Model):
    __tablename__ = 'pokemon_battle'
    pokemon_id = db.Column(db.Integer, primary_key=True)
    lose_battle = db.Column(db.Integer)
    win_battle = db.Column(db.Integer)
    battle_num = db.Column(db.Integer)
    win_rate = db.Column(db.Float)

class PokemonList(BaseModel, db.Model):
    __tablename__ = 'pokemon_predict_list'
    pokemon_id = db.Column(db.Integer, primary_key=True)
    type_1 = db.Column(db.String(120))
    type_2 = db.Column(db.String(120))
    name = db.Column(db.String(120))
    sprite = db.Column(db.String(120))