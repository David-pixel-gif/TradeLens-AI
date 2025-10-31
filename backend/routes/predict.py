from flask import Blueprint, request, jsonify
from models import db, Transaction
import joblib
import pandas as pd
import numpy as np
import os

# ✅ Load the trained model once
model_path = os.path.join(os.getcwd(), "models", "model.pkl")
model = joblib.load(model_path)

# ✅ Map transaction types to numeric codes
type_map = {
    "TRANSFER": 0,
    "CASH_OUT": 1,
    "PAYMENT": 2,
    "DEBIT": 3,
    "CASH_IN": 4
}

predict_bp = Blueprint('predict', __name__)

@predict_bp.route("/api/predict", methods=["POST"])
def single_prediction():
    data = request.get_json()

    txn_type_str = data.get("type", "TRANSFER").upper()
    txn_type_code = type_map.get(txn_type_str, 0)

    try:
        # ✅ Use pandas DataFrame to ensure compatibility
        input_df = pd.DataFrame([{
            "step": float(data.get("step", 0)),
            "type": txn_type_code,
            "amount": float(data.get("amount", 0)),
            "oldbalanceOrg": float(data.get("oldbalanceOrg", 0)),
            "newbalanceOrig": float(data.get("newbalanceOrig", 0)),
            "oldbalanceDest": float(data.get("oldbalanceDest", 0)),
            "newbalanceDest": float(data.get("newbalanceDest", 0)),
        }])

        prediction = model.predict(input_df)[0]
        confidence = float(model.predict_proba(input_df)[0].max())
        risk_score = round(confidence * 100, 2)

        result = {
            "is_fraud": bool(prediction),
            "confidence": confidence,
            "risk_score": risk_score
        }

        txn = Transaction(
            step=int(data.get("step", 0)),
            type=txn_type_str,
            amount=float(data.get("amount", 0)),
            nameOrig=data.get("nameOrig", ""),
            oldbalanceOrg=float(data.get("oldbalanceOrg", 0)),
            newbalanceOrig=float(data.get("newbalanceOrig", 0)),
            nameDest=data.get("nameDest", ""),
            oldbalanceDest=float(data.get("oldbalanceDest", 0)),
            newbalanceDest=float(data.get("newbalanceDest", 0)),
            prediction="Fraud" if result["is_fraud"] else "Legit",
            confidence=confidence,
            risk_score=risk_score
        )

        db.session.add(txn)
        db.session.commit()

        return jsonify(result)

    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500


print("✅ predict.py loaded")
