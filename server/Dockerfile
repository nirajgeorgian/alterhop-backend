FROM node:8.11.4

MAINTAINER Niraj Georgian nirajgeorgian@gmail.com

# Make folder for project backend and attach your backend
RUN mkdir -p /alterhop/server
WORKDIR /alterhop/server

# Install the dependencies because node_modules folder change
# and we don't want to execute npm install every time
COPY ./package*.json /alterhop/server/
RUN npm install

# Now copy entire folder
COPY . /alterhop/server/

CMD ["npm", "run", "start"]
