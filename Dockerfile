FROM node:current-alpine

COPY . /usr/tones-ui
WORKDIR /usr/tones-ui
RUN npm install

ENV DISABLE_ERD=true
EXPOSE 8080
CMD ["npm","run","backend"]
