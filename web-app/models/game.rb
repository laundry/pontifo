class Game
  include MongoMapper::Document

  key :name, String
  key :score, Fixnum 
end
