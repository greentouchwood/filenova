FROM python:3.11-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libreoffice \
        libreoffice-writer \
        libreoffice-calc \
        fonts-dejavu \
        fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY server ./server

WORKDIR /app/server

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-10000}"]