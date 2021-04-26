# Local Development

1. Run the app in a docker-based development environment:
  `./dockdev.sh`

2. Run a command within the container (e.g. yarn commands)
  `docker exec -it $DOCKER_CONTAINER <command>`
  e.g.
  `docker exec -it $DOCKER_CONTAINER yarn install package`

#TODO: add start / cmd / stop to dockdev.sh
