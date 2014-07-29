require 'rubygems'
require 'sinatra/base'

class App < Sinatra::Base

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
