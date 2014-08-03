require 'digest/md5'
require 'json'
require 'mongo'
require 'mongo_mapper'
require 'mustache/sinatra'
require 'require_all'
require 'rubygems'
require 'sinatra/base'
require 'yaml'

require_all 'config/initializers'
require_all 'helpers'
require_all 'lib'
require_all 'models'
require_all 'views'

class App < Sinatra::Base
  include Mongo
  include MongoHelpers

  register Mustache::Sinatra

  set :mustache, {
    :views     => 'views/',
    :templates => 'templates/'
  }

  enable :logging

  setup_mongo settings

  get '/' do
    mustache(:index)
  end

  get '/game/new' do
    content_type :json

    mongo_quotes = Quote.all.sample(10)
    session[:game_ids] = mongo_quotes.collect { |quote| quote[:_id] }

    quotes = mongo_quotes.collect { |mongo_quote|
      quote = mongo_quote.serializable_hash
      text = quote['text']
      quote.delete('text')
      quote['tokens'] = text.split(" ")
      quote['removed'] = 0 # TODO (tstramer): call fandri's service
      quote['tokens'].delete_at(quote['removed'])
      quote['encrypted'] = Digest::MD5.hexdigest(text)
      quote
    }

    quotes.to_json
  end

  get '/admin/import_quotes' do
    # TODO (tstramer): Call quote generator script
    MongoImporter.import_json('quotes', './tmp/quotes.json')
    redirect collection_admin_path('quotes')
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
