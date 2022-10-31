FROM node:18
RUN apt update && apt -y upgrade && \
    apt install -y netcat-traditional && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /srv
COPY package-lock.json package.json ./
RUN npm i
COPY static ./static
COPY app.ts ./
RUN ./node_modules/.bin/tsc app.ts
CMD ["node", "app.js"]
