cd "$(git rev-parse --show-toplevel)"
git push heroku `git subtree split --prefix web-app master`:master --force
