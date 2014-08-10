require 'active_support'
require 'genghis'

require './app'

use Rack::ShowExceptions

run Rack::URLMap.new \
  '/'         => App.new,
  '/admin/db' => Genghis::Server.new
