# pontifo

## Setting up the web-app

Ensure you have the following installed:

 * Ruby version >= 2.0.0 (recommend using rvm for version management: https://rvm.io/)
 * Mongodb (http://www.mongodb.org/)
 * Git version >= 1.8 (make sure you have `git subtree` so you can deploy web-app)

Set up your Heroku client:

 * https://devcenter.heroku.com/articles/quickstart

Install python modules for the web-svc:

```
cd web-svc
brew install pip
pip install -r requirements.txt
```

## Starting the web-app locally

From the web-app directory, run:

```
./server
```

## Deploying the web-app

From the web-app directory, run
```
./deploy
```

After deploying, make sure to also push your changes to the github repo by running:

```
git push origin master
```
