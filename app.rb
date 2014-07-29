require 'rubygems'
require 'sinatra/base'

class App < Sinatra::Base

  get '/' do
    "Hello pontifo!"
  end

  get '/score' do
    halt 404 unless ![nil, ''].include?(params['guess'])
    'Your guess of ' + params['guess'] + ' is terrible.'
  end
end
