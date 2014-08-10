ROOT="$(git rev-parse --show-toplevel)"
echo -n "Starting mongo... "
pgrep [m]ongo* > /dev/null || mongod &
echo "done"
echo -n "Starting web-svc... "
(cd $ROOT/web-svc && foreman start 2>&1 > /dev/null &)
echo "done"
echo "Starting web-app... "
(cd $ROOT/web-app && rackup config.ru -p 9393)
