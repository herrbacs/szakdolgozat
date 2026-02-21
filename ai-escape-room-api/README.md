
Szükséges csomagok telepítése migrációhoz
    - pip install alembic sqlalchemy psycopg2-binary

Modell létrehozása
    - db/models mappába a users mintájára hozz létre új modelt
    - Létrehozott modelt húzd be az db/migrations/env.py file-ba, a file importoknál

Migráció Generálása
    - Futtasd ```alembic revision --autogenerate -m "create my table"```

Adatbázis frissítése
    - Futtasd ```alembic upgrade head```

History lekérdezése
    - Futtasd ```alembic history```

Migráció visszavonása
    - Futtasd ```alembic downgrade -1```
