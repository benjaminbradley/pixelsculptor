FROM node:14

RUN yarn global add nodemon

# customize dev environment
RUN sed -i.orig -e "s/# ?alias ll=/alias ll=/" ~/.bashrc

# keep node_modules directory inside container
RUN mkdir -p /tmp/node_modules

EXPOSE 3000

WORKDIR /app

CMD dev/startup.sh
