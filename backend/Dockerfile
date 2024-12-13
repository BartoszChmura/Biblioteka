FROM python:3.12

WORKDIR /app

COPY wait-for-it.sh /usr/local/bin/wait-for-it
COPY . .

RUN chmod +x /usr/local/bin/wait-for-it
RUN pip install --no-cache-dir -r requirements.txt

CMD ["wait-for-it", "db:5432", "--", "python", "run.py"]
