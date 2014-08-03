require_relative '../config_helpers'

def setup_text_client(settings)
  config = ConfigHelpers.load_yaml_config('text_service.yml', settings)
  TextClient.setup(config, settings.environment)
end
