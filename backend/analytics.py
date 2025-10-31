from flask import Blueprint, jsonify
from models import Transaction

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/api/analytics")
def get_analytics():
    txns = Transaction.query.all()
    fraud = sum(1 for t in txns if t.prediction == "Fraud")
    legit = len(txns) - fraud

    types = {}
    for txn in txns:
        types[txn.type] = types.get(txn.type, 0) + 1

    return jsonify({
        "total": len(txns),
        "fraud": fraud,
        "safe": legit,
        "types": types
    })
