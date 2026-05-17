from .modules import data
from .modules.data import (
    generate_stream, apply_custom_correlations,
    company_gen, companies_gen, job_gen, jobs_gen,
    medical_record, medical_records,
    university_gen, universities_gen,
    transaction_gen, transactions_gen,
)

__version__ = "2.1.0"
__author__ = "abhay557"

__all__ = [
    "data",
    "generate_stream", "apply_custom_correlations",
    "company_gen", "companies_gen",
    "job_gen", "jobs_gen",
    "medical_record", "medical_records",
    "university_gen", "universities_gen",
    "transaction_gen", "transactions_gen",
]
