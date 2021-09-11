FROM node:fermium-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache openssl ca-certificates wget && \
    apk add --no-cache make gcc g++ python && mkdir -p /opt


COPY . /opt/app
WORKDIR /opt/app

RUN npm ci && npm run compile && npm prune --production



FROM node:fermium-alpine

RUN apk update && apk upgrade && apk add --no-cache openssl ca-certificates
RUN update-ca-certificates

RUN mkdir ~/app
WORKDIR /opt/app

COPY package.json package.json
RUN mkdir /opt/app/node_modules
RUN mkdir /opt/app/dist
COPY --from=builder /opt/app/dist ./dist/
COPY --from=builder /opt/app/node_modules ./node_modules/

CMD /usr/local/bin/npm start
