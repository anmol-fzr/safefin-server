FROM oven/bun:1.2.2

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN bun i
COPY . .

#RUN apt-get -y update
#RUN apt-get -y install curl

CMD ["bun", "run", "dev"]
