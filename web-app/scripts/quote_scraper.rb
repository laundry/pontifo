require 'json'
require 'nokogiri'
require 'open-uri'

def clean(txt)
  txt.gsub(/"/, "").gsub(/\[.*?\]/, "")
end

def content(td)
  if td.css('a').size > 0 && td.css('a')[0].content.length > 4
    td.css('a')[0].content
  else
    td.content
  end
end

URL = "http://en.wikipedia.org/wiki/AFI's_100_Years...100_Movie_Quotes"

outfile = ARGV[0]

doc = Nokogiri::HTML(open(URL))

quotes = doc.css('.wikitable tr').drop(1).collect { |row|
  cells = row.css('td')
  {
    :text => clean(content(cells[1])),
    :character => clean(content(cells[2])),
    :speaker => clean(content(cells[3])),
    :from => clean(content(cells[4]))
  }
}

File.open(outfile, 'w') { |file|
  file.write(quotes.to_json)
}
