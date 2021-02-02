FROM bigwisu/pm2:8.11

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

ENV NODE_ENV production
RUN npm run build
CMD [ "pm2", "start", "build/server.js", "--no-daemon"]