FROM node:fermium-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache openssl ca-certificates wget && \
    apk add --no-cache make gcc g++ python


RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN chown -R node:node /home/node/app

USER node
RUN npm ci --production \
    && rm .npmrc

FROM node:fermium-alpine

RUN apk update && apk upgrade && apk add --no-cache openssl ca-certificates
RUN update-ca-certificates

USER node

RUN mkdir ~/app
WORKDIR /home/node/app

COPY dist dist
COPY package.json package.json
RUN mkdir /home/node/app/node_modules
COPY --from=builder /home/node/app/node_modules ./node_modules/

CMD /usr/local/bin/npm start