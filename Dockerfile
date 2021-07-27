FROM node:14.17-slim as dependency
WORKDIR /opt/app

COPY backend/package.json /opt/app/backend/package.json
WORKDIR /opt/app/backend
RUN npm install

COPY frontend/package.json /opt/app/frontend/package.json
WORKDIR /opt/app/frontend
RUN npm install

FROM node:14.17-slim as build
WORKDIR /opt/app
COPY  --from=dependency /opt/app/backend/node_modules /opt/app/backend/node_modules
COPY  --from=dependency /opt/app/frontend/node_modules /opt/app/frontend/node_modules

COPY backend/ /opt/app/backend/
WORKDIR /opt/app/backend
RUN npm run build

COPY frontend/ /opt/app/frontend/
WORKDIR /opt/app/frontend
RUN npm run build


FROM node:14.17-slim as runtime
RUN apt update && \
    apt install -y tzdata

ENV TZ=Asia/Bangkok

WORKDIR /opt/app
COPY  --from=dependency /opt/app/backend/node_modules /opt/app/node_modules
COPY  --from=build /opt/app/backend/dist/ /opt/app/
COPY  --from=build /opt/app/frontend/dist/ /opt/app/public/

CMD node main