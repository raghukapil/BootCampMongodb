# Node JS

FROM node:14.15.5

RUN mkdir -p /node/bootcamp


WORKDIR /node/bootcamp
RUN chmod 777 /node/bootcamp

COPY . .

RUN npm install

EXPOSE 3500

CMD ["npm", "start"]