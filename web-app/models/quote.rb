class Quote
  include MongoMapper::Document

  key :text, String
  key :from, String
  key :speaker, String
  key :character, String # optional
  key :movie_img_url, String # optional
  key :actor_img_url, String # optional
end
