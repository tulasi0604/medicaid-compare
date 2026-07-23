# Weights total 1.0 (100%)
METRIC_WEIGHTS = {
    "ncqa_quality_rating": 0.30,      # High weight on Quality
    "hedis_preventive_score": 0.25,   # High weight on Clinical Preventive Care
    "states_served": 0.20,           # Geographic reach
    "medicaid_enrollment": 0.15,     # Scale / Footprint
    "medical_care_ratio": 0.10,      # Financial efficiency
}

def calculate_composite_scores(raw_data: dict):
    scores = {"molina": 0.0, "centene": 0.0}
    explanations = []

    for metric, weight in METRIC_WEIGHTS.items():
        v1 = raw_data["molina"][metric]
        v2 = raw_data["centene"][metric]

        max_v, min_v = max(v1, v2), min(v1, v2)
        range_v = (max_v - min_v) if max_v != min_v else 1.0

        # Min-Max Normalization to 0–100 scale
        molina_norm = ((v1 - min_v) / range_v) * 100
        centene_norm = ((v2 - min_v) / range_v) * 100

        scores["molina"] += molina_norm * weight
        scores["centene"] += centene_norm * weight

        metric_name = metric.replace("_", " ").title()
        if v1 > v2:
            explanations.append(f"Molina leads in {metric_name} ({v1} vs {v2}).")
        elif v2 > v1:
            explanations.append(f"Centene leads in {metric_name} ({v2} vs {v1}).")

    winner = "Centene Corporation (WellCare)" if scores["centene"] > scores["molina"] else "Molina Healthcare"

    return {
        "scores": {k: round(v, 1) for k, v in scores.items()},
        "winner": winner,
        "rationale": explanations
    }