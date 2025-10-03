from app.database import SessionLocal
from app.models.problem import Problem
import json

def dump_problems():
    db = SessionLocal()
    problems = db.query(Problem).all()
    output = []

    for p in problems:
        output.append({
            "id": p.id,
            "title": p.title,
            "statement": p.statement,
            "expected": p.expected,
            "stars": p.stars,
            "tags": json.loads(p.tags or "[]"),
            "difficulty_notes": p.difficulty_notes
        })

    with open("existing_problems.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Dumped {len(output)} problems to existing_problems.json")

if __name__ == "__main__":
    dump_problems()