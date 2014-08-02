def setup_mongo(settings)
  config_file = File.new(File.expand_path("#{settings.root}/config/mongo.yml", File.dirname(__FILE__)))
  config = YAML.load(ERB.new(config_file.read).result)

  MongoImporter.setup(config[settings.environment.to_s])
  MongoMapper.setup(config, settings.environment)
end
