class Quote
  include MongoMapper::Document
  key :text, String
  key :from, String
  key :speaker, String
  key :character, String # optional
  key :movie_img_url, String # optional
  key :speaker_img_url, String # optional
end
