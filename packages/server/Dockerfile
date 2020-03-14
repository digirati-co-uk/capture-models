FROM node:12 as build

WORKDIR /home/node/app

ADD ./package.json /home/node/app/package.json

RUN yarn install --no-interactive

COPY ./src /home/node/app/src
COPY ./tsconfig.docker.json /home/node/app/tsconfig.json

RUN yarn build

FROM node:12

WORKDIR /home/node/app

RUN npm install -g nodemon

COPY --from=build /home/node/app/package.json /home/node/app/package.json
COPY --from=build /home/node/app/yarn.lock /home/node/app/yarn.lock
COPY --from=build /home/node/app/lib /home/node/app/lib
COPY ./ecosystem.config.js /home/node/app/ecosystem.config.js

WORKDIR /home/node/app/

RUN yarn install --no-dev --no-interactive --frozen-lockfile

ENV SERVER_PORT=3000
ENV DATABASE_HOST=localhost
ENV DATABASE_NAME=capture_model_api
ENV DATABASE_PORT=5400
ENV DATABASE_USER=capture_model_api
ENV DATABASE_SCHEMA=public
ENV DATABASE_PASSWORD=capture_model_api_password

EXPOSE 3000

RUN npm install -g pm2

USER node

CMD ["pm2-runtime", "start ecosystem.config.js", "--only", "server-ui-prod"]
