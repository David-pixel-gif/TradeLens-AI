import random

def predict_transaction(data):
    # Simulate a model
    is_fraud = data['type'] == 'TRANSFER' and data['amount'] > 10000
    confidence = round(random.uniform(0.85, 0.99), 2)
    risk_score = round(random.uniform(0.5, 0.99), 2)

    return {
        "is_fraud": is_fraud,
        "confidence": confidence,
        "risk_score": risk_score
    }
