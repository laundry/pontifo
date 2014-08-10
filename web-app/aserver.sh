ROOT="$(git rev-parse --show-toplevel)"
echo -n "Starting mongo... "
pgrep [m]ongo* > /dev/null || mongod &
echo "done"
echo -n "Starting web-svc... "
(cd $ROOT/web-svc && foreman start 2>&1 > /dev/null &)
echo "done"
echo "Starting web-app... "
(cd $ROOT/web-app && shotgun -o 192.168.1.186 -O config.ru)
