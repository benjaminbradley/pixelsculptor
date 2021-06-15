#!/bin/bash
# Run this script to start up the docker-based development environment.
ACTION=$1
shift 1
if [ "$ACTION" == "" ]; then
  echo "USAGE: dockdev.sh [start|stop|cmd|cleanup] [command]"
  exit
fi
if [ -e dev/localdev.env ]; then
  echo -e "\033[1;32mLoading environment from dev/localdev.env\033[0m"
  source dev/localdev.env
fi
# set defaults if not defined
DOCKER_CONTAINER=${DOCKER_CONTAINER:-mynode}
DOCKER_IMAGE=${DOCKER_IMAGE:-nodedev}
HOST_PORT=${HOST_PORT:-3000}
if [ "$ACTION" == "start" ]; then
  # Build or refresh the development image
  docker build dev -t $DOCKER_IMAGE > /dev/null
  echo -e "\033[1;34mWhen startup completes, the app will be available locally at \033[1;37mhttp://localhost:${HOST_PORT}/\033[0m"
  # check if a container already exists
  if [ "$(docker ps -a | grep $DOCKER_CONTAINER)" ]; then
    # if so, start it up
    set -x
    docker start $DOCKER_CONTAINER && docker logs --tail=0 -f $DOCKER_CONTAINER
  else
    # otherwise, create the container and start it up
    set -x
    docker run -it --name $DOCKER_CONTAINER -v `pwd`:/app -p $HOST_PORT:3000 $DOCKER_IMAGE
  fi
elif [ "$ACTION" == "stop" ]; then
  docker stop $DOCKER_CONTAINER
elif [ "$ACTION" == "cmd" ]; then
  docker exec -it $DOCKER_CONTAINER $*
elif [ "$ACTION" == "cleanup" ]; then
  docker rm -f $DOCKER_CONTAINER
  docker rmi $DOCKER_IMAGE
  rm -f dev/packages.installed
else
  echo "Unrecognized subcommand: '$ACTION'"
fi
