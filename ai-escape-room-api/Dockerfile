FROM python:latest
WORKDIR /app

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

RUN apt-get update && \
    apt-get install -y libgl1 libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/* && \
    pip install -r requirements.txt

RUN alembic upgrade head

EXPOSE 5000

CMD ["flask", "run", "--debug", "--reload"]
