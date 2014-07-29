require 'mongo'
require 'mongo_mapper'
require 'rubygems'
require 'sinatra/base'

class App < Sinatra::Base
  include Mongo

  enable :logging

  configure do
    mongo_config_file = File.new(File.expand_path('./config/mongo.yml', File.dirname(__FILE__)))
    mongo_config = YAML.load(ERB.new(mongo_config_file.read).result)
    MongoMapper.setup(mongo_config, settings.environment)
  end

  get '/' do
    "Hello pontifo!"
  end

  get '/fandri' do
    'Hello fandri'
  end

  get '/type/:q' do
    redirect('http://fathomless-crag-2770.herokuapp.com/typer/' + params['q'])
  end

  get '/score/:guess' do
    #halt 404 unless ![nil, ''].include?(params['guess'])
    'Your guess of ' + params['guess'] + ' is terrible.'
  end
end
