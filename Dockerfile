FROM node:current-alpine

COPY . /usr/tones-ui

WORKDIR /usr/tones-ui
RUN npm install

WORKDIR /usr/tones-ui/backend
ENV DISABLE_ERD=true
RUN npx prisma generate


WORKDIR /usr/tones-ui
EXPOSE 8080

CMD ["npm","run","start-dev:be"]
