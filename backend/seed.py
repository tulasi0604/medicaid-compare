from datetime import date
import os
import sqlite3

# Dynamically target the exact backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "medicaid_cache.db")


def init_and_seed_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS payor_metrics")
    cursor.execute("DROP TABLE IF EXISTS payors")

    cursor.execute("""
        CREATE TABLE payors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE payor_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            payor_id TEXT NOT NULL,
            metric_key TEXT NOT NULL,
            metric_label TEXT NOT NULL,
            raw_value REAL NOT NULL,
            unit TEXT NOT NULL,
            source_name TEXT NOT NULL,
            source_url TEXT NOT NULL,
            fetched_date DATE NOT NULL,
            FOREIGN KEY(payor_id) REFERENCES payors(id)
        )
    """)

    cursor.executemany(
        "INSERT INTO payors (id, name) VALUES (?, ?)",
        [
            ("molina", "Molina Healthcare"),
            ("centene", "Centene Corporation (WellCare)"),
        ],
    )

    today = str(date.today())

    metrics = [
        # MOLINA HEALTHCARE
        (
            "molina",
            "medicaid_enrollment",
            "Medicaid Enrollment",
            4.7,
            "Million Members",
            "Molina SEC Form 10-K Filings / KFF",
            "https://investors.molinahealthcare.com/financial-information/financial-reports",
            today,
        ),
        (
            "molina",
            "states_served",
            "States Served",
            19.0,
            "States",
            "Medicaid.gov Managed Care Profiles",
            "https://www.medicaid.gov/medicaid/managed-care/index.html",
            today,
        ),
        (
            "molina",
            "ncqa_quality_rating",
            "NCQA Quality Star Rating",
            3.6,
            "out of 5.0 Stars",
            "NCQA Health Plan Report Cards",
            "https://reportcards.ncqa.org/health-plans",
            today,
        ),
        (
            "molina",
            "medical_care_ratio",
            "Medical Loss Ratio (MLR/MCR)",
            91.8,
            "%",
            "Molina Earnings Reports",
            "https://investors.molinahealthcare.com/financial-information/financial-reports",
            today,
        ),
        (
            "molina",
            "hedis_preventive_score",
            "HEDIS Preventive Care Score",
            81.2,
            "%",
            "State Medicaid Managed Care Quality Reports",
            "https://www.kff.org/medicaid/",
            today,
        ),
        # CENTENE (WELLCARE)
        (
            "centene",
            "medicaid_enrollment",
            "Medicaid Enrollment",
            12.5,
            "Million Members",
            "Centene Investor Relations & SEC Filings",
            "https://investors.centene.com/",
            today,
        ),
        (
            "centene",
            "states_served",
            "States Served",
            30.0,
            "States",
            "Centene Medicaid Footprint Summary",
            "https://www.centene.com/products-and-services/medicaid.html",
            today,
        ),
        (
            "centene",
            "ncqa_quality_rating",
            "NCQA Quality Star Rating",
            3.5,
            "out of 5.0 Stars",
            "NCQA Managed Care Rating Portal",
            "https://reportcards.ncqa.org/health-plans",
            today,
        ),
        (
            "centene",
            "medical_care_ratio",
            "Medical Loss Ratio (MLR/MCR)",
            93.0,
            "%",
            "Centene SEC Financial Filings",
            "https://investors.centene.com/",
            today,
        ),
        (
            "centene",
            "hedis_preventive_score",
            "HEDIS Preventive Care Score",
            78.5,
            "%",
            "State Medicaid Agency Quality Reports",
            "https://www.kff.org/medicaid/",
            today,
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO payor_metrics 
        (payor_id, metric_key, metric_label, raw_value, unit, source_name, source_url, fetched_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """,
        metrics,
    )

    conn.commit()
    conn.close()
    print("SUCCESS: Database seeded at", DB_NAME)


if __name__ == "__main__":
    init_and_seed_db()