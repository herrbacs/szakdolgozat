FROM python:3.9 
WORKDIR /app
COPY app.py .
COPY requirements.txt requirements.txt
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--debug", "--reload"]