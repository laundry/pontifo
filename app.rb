require 'rubygems'
require 'sinatra/base'

class App < Sinatra::Base

  get '/' do
    "Hello pontifo!"
  end
end
