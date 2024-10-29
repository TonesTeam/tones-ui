FROM node:latest


COPY . /usr/tones-ui

WORKDIR /usr/tones-ui/modules
RUN npm install

WORKDIR /usr/tones-ui/modules/backend
ENV DISABLE_ERD=true
RUN npx prisma generate


WORKDIR /usr/tones-ui/modules
EXPOSE 8080

CMD ["npm","run","start-dev:be"]
