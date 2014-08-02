require 'json'
require 'nokogiri'
require 'open-uri'

URL = "http://en.wikipedia.org/wiki/AFI's_100_Years...100_Movie_Quotes"

outfile = ARGV[0]

doc = Nokogiri::HTML(open(URL))

quotes = doc.css('.wikitable tr').drop(1).collect { |row|
  cells = row.css('td')
  {
    :text => cells[1].content.gsub(/"/, "").gsub(/\[.*?\]/, ""),
    :character => cells[2].content,
    :speaker => cells[3].content,
    :from => cells[4].content
  }
}

File.open(outfile, 'w') { |file|
  file.write(quotes.to_json)
}
