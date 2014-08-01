require 'active_support'
require './app'
require 'genghis'

use Rack::ShowExceptions

run Rack::URLMap.new \
  '/'         => App.new,
  '/admin/db' => Genghis::Server.new
