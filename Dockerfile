FROM node:fermium-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache openssl ca-certificates wget && \
    apk add --no-cache make gcc g++ python


COPY . /home/node/app
WORKDIR /home/node/app


RUN chown -R node:node /home/node/app

USER node
RUN npm ci && npm run compile && npm prune --production

FROM node:fermium-alpine

RUN apk update && apk upgrade && apk add --no-cache openssl ca-certificates
RUN update-ca-certificates

USER node

RUN mkdir ~/app
WORKDIR /home/node/app

COPY package.json package.json
RUN mkdir /home/node/app/node_modules
RUN mkdir /home/node/app/dist
COPY --from=builder /home/node/app/dist ./dist/
COPY --from=builder /home/node/app/node_modules ./node_modules/

CMD /usr/local/bin/npm start
