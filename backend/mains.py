import os
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scoring import calculate_composite_scores

# Dynamically target the exact database file in the backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "medicaid_cache.db")

app = FastAPI(title="Medicaid Payor Comparison API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/compare")
def get_comparison():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT payor_id, metric_key, metric_label, raw_value, unit, source_name, source_url, fetched_date
        FROM payor_metrics
    """)
    rows = cursor.fetchall()
    conn.close()

    metrics_data = {"molina": {}, "centene": {}}
    numeric_payload = {"molina": {}, "centene": {}}

    for row in rows:
        payor, key, label, val, unit, src, url, date = row
        metrics_data[payor][key] = {
            "label": label,
            "value": val,
            "unit": unit,
            "citation": {"source": src, "url": url, "fetched_date": date},
        }
        numeric_payload[payor][key] = val

    scoring_results = calculate_composite_scores(numeric_payload)

    return {"metrics": metrics_data, "scoring": scoring_results}
