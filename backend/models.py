from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ✅ Already existing transaction model
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    step = db.Column(db.Integer)
    type = db.Column(db.String(20))
    amount = db.Column(db.Float)
    nameOrig = db.Column(db.String(100))
    oldbalanceOrg = db.Column(db.Float)
    newbalanceOrig = db.Column(db.Float)
    nameDest = db.Column(db.String(100))
    oldbalanceDest = db.Column(db.Float)
    newbalanceDest = db.Column(db.Float)
    prediction = db.Column(db.String(10))  # Fraud / Legit
    confidence = db.Column(db.Float)
    risk_score = db.Column(db.Float)


# ✅ For batch-uploaded CSV/XLSX logs
class BatchTransactionLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(255))  # Uploaded file name
    step = db.Column(db.Integer)
    type = db.Column(db.String(20))
    amount = db.Column(db.Float)
    nameOrig = db.Column(db.String(100))
    oldbalanceOrg = db.Column(db.Float)
    newbalanceOrig = db.Column(db.Float)
    nameDest = db.Column(db.String(100))
    oldbalanceDest = db.Column(db.Float)
    newbalanceDest = db.Column(db.Float)
    prediction = db.Column(db.String(10))  # Fraud / Legit
    confidence = db.Column(db.Float)
    risk_score = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ New user model for authentication (login/register)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)