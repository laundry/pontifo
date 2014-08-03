require 'digest/md5'
require 'json'
require 'mongo'
require 'mongo_mapper'
require 'mustache/sinatra'
require 'open3'
require 'require_all'
require 'rubygems'
require 'sinatra/base'
require 'yaml'

require_all 'client'
require_all 'config/initializers'
require_all 'helpers'
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

  enable :sessions

  set :session_secret, "asdfghjklqwertyuio"

  setup_mongo settings
  setup_text_client settings

  before do
    headers['Access-Control-Allow-Origin'] = '*'
  end

  get '/' do
    mustache(:index)
  end

  get '/game/new' do
    content_type :json
    session[:quote_ids] = []
    generate_quote.to_json
  end

  get '/game/next_quote' do
    content_type :json
    generate_quote.to_json
  end

  get '/admin/import_quotes' do
    tmp_quotes_file = './tmp/quotes.json'
    if params.has_key?("scrape")
      cmd = "ruby ./scripts/quote_scraper.rb #{tmp_quotes_file}"
      out, err, status = Open3.capture3(cmd)
      raise ScriptError, "#{cmd} failed: #{err}" unless status.success?
    end
    MongoImportClient.import_json('quotes', tmp_quotes_file)
    redirect collection_admin_path('quotes')
  end

  private
  
  def generate_quote
    seen_quote_ids = (session[:quote_ids] || []).to_set

    mongo_quotes = Quote.all.shuffle.select do |quote|
      !seen_quote_ids.include?(quote[:_id].to_s)
    end 

    quote = nil
    mongo_quotes.each do |mongo_quote|
      quote = mongo_quote.serializable_hash
      text = quote['text']
      remove_index = TextClient.remove_word(text)

      if remove_index >= 0
        quote.delete('text')
        quote['tokens'] = text.split(" ")
        quote['removed'] = remove_index 
        quote['tokens'].delete_at(quote['removed'])
        quote['encrypted'] = Digest::MD5.hexdigest(text.downcase.gsub(/[^a-zA-Z0-9]/, ""))
        session[:quote_ids] << quote['id'].to_s
        break 
      end
    end 

    quote
  end
end
