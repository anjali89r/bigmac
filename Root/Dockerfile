FROM node:8
ENV NODE_ENV=production DBNAME=${DBNAME} DBUID=${DBUID} DBPASWD=${DBPASWD} DBHOST=${DBHOST} DBPORT=${DBPORT} DPASWDENCRYPTED=${DPASWDENCRYPTED:-Y} ACCESSKEY=${ACCESSKEY} SECRETKEY=${SECRETKEY} REGION=${REGION} s3filebucket=${s3filebucket}
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production
COPY . .
RUN chown -R node:node /usr/src/app/log
RUN chmod 755 /usr/src/app/log
USER node
CMD ["node","app.js"]