from flask_sqlalchemy import SQLAlchemy

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
