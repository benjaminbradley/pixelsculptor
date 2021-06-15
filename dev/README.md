# Local Development

1. Run the app in a docker-based development environment:
  `dev/dockdev.sh start`

2. Run a command within the container (e.g. yarn commands)
  `dev/dockdev.sh cmd <command>`
  e.g.
  `dev/dockdev.sh cmd yarn install package`

3. To stop the docker container:
  `dev/dockdev.sh stop`

## Customizations

You can customize the name of the image that gets build, the container name, and the port. See localdev.env.dist
