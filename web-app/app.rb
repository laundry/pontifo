require 'mongo'
require 'mongo_mapper'
require 'mustache/sinatra'
require 'require_all'
require 'rubygems'
require 'sinatra/base'
require 'yaml'

require_all 'views'

class App < Sinatra::Base
  include Mongo

  register Mustache::Sinatra

  set :mustache, {
    :views     => 'views/',
    :templates => 'templates/'
  }

  enable :logging

  configure do
    mongo_config_file = File.new(File.expand_path('./config/mongo.yml', File.dirname(__FILE__)))
    mongo_config = YAML.load(ERB.new(mongo_config_file.read).result)
    MongoMapper.setup(mongo_config, settings.environment)
  end

  get '/' do
    mustache(:index)
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
