require_relative '../config_helpers'

def setup_mongo(settings)
  config = ConfigHelpers.load_yaml_config('mongo.yml', settings)

  MongoImportClient.setup(config, settings.environment)
  MongoMapper.setup(config, settings.environment)
end
