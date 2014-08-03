require 'json'
require 'nokogiri'
require 'open-uri'
require 'cgi'

BASE_URL = "http://www.imdb.com"

def movie_img_url(title)
  search_url = "#{BASE_URL}/find?q=#{CGI.escape(title)}&s=all"
  search_doc = Nokogiri::HTML(open(search_url))
  movie_path = search_doc.css('.findList tr a')[0]["href"]

  movie_url = "#{BASE_URL}/#{movie_path}"
  movie_doc = Nokogiri::HTML(open(movie_url))
  image_el = movie_doc.css('.image img')
  if image_el.size > 0
    image_el[0]["src"]
  else
    ""
  end
end

def actor_img_url(actor)
  search_url = "#{BASE_URL}/find?q=#{CGI.escape(actor)}&s=all"
  search_doc = Nokogiri::HTML(open(search_url))
  actor_path = search_doc.css('.findList tr a')[0]["href"]

  actor_url = "#{BASE_URL}/#{actor_path}"
  actor_doc = Nokogiri::HTML(open(actor_url))
  image_el = actor_doc.css('.image img')
  if image_el.size > 0
    image_el[0]["src"]
  else
    ""
  end
end
