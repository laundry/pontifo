# pontifo

## Setting up web-app

Ensure you have the following installed:

 * Ruby version >= 2.0.0 (recommend using rvm for version management: https://rvm.io/)
 * Mongodb (http://www.mongodb.org/)
 * Git version >= 1.8 (make sure you have `git subtree` so you can deploy web-app)

Set up your Heroku client:

 * https://devcenter.heroku.com/articles/quickstart

## Starting web-app locally

From the web-app directory, run:

```
./server
```

## Deploying web-app

```
git subtree push --prefix web-app heroku master
```

When deploying, make sure your changes are also pushed to the github repo by running:

```
git push origin master
```
