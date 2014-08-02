class Quote
  include MongoMapper::Document
  key :text, String
  key :from, String
  key :speaker, String
  key :character, String # optional
end
