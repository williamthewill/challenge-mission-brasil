# Run Project
Mission Brasil challenge.
- The api has only one `/images/zip` route that returns a zip file of images.
- The api was developed with typescript following functional practices.

Below are the steps of using api.

## Step 1 - Add node_modules
Create the .env file and copy the environments that are in .env.example and populate them
```
$ npm install
```
### or
```
$ yarn
```
## Step 2 - Transpile to js
```
$ yarn run tsc
```
## Step 3 - Start the Project
```
$ node dist/src/index
```
## Step 4 - Access the route

```
$ curl localhost:3000/images/zip --output ~/Documents/images.zip
```
Or goin to favorite browser and access `localhost:3000/images/zip`

# To run with docker
To facilitate development, it is not required to pass environment variables with the docker, just to have created the .env file and populated its environment variables.

```
$ docker build --rm -t challenge-mb .
```
```
$ docker run -p 3000:3000 challenge-mb
```