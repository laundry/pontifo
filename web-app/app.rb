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

  get '/game/save' do
    content_type :json

    if params[:name].nil? || params[:name].length == 0 || params[:score].nil? || !(params[:score] =~ /\A\d+\z/)
      return {:error => "You must provide name and score"}
    end

    game = Game.new
    game.update_attributes(:name => params[:name], :score => params[:score])
    game.save!
    
    {}
  end

  get '/leaderboard' do
    scores = {}
    games = Game.all.each do |game|
      unless game.name.nil? || game.name.length == 0 || game.score.nil?
        scores[game.name] ||= 0
        scores[game.name] += game.score
      end
    end

    leaderboard = scores.collect do |name, score|
      {:name => name, :score => score}
    end

    leaderboard.sort! { |a, b| b[:score] <=> a[:score] }

    mustache(:leaderboard, {}, {:leaderboard => leaderboard})
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

    mongo_quotes = Quote.all.shuffle.select do |mongo_quote|
      !seen_quote_ids.include?(mongo_quote[:_id].to_s)
    end 

    quote = nil
    mongo_quotes.each do |mongo_quote|
      quote = mongo_quote.serializable_hash
      remove_index = TextClient.remove_word(quote['text'])

      if remove_index >= 0
        quote['tokens'] = quote['text'].split(" ")
        quote['removed_index'] = remove_index
        quote['removed_token'] = quote['tokens'].delete_at(remove_index)
        session[:quote_ids] << quote['id'].to_s
        break 
      end
    end 

    quote
  end
end
