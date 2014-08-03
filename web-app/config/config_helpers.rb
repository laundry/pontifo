require 'yaml'

module ConfigHelpers

  def self.load_yaml_config(name, settings)
    config_file = File.new(File.expand_path("#{settings.root}/config/#{name}", File.dirname(__FILE__)))
    YAML.load(ERB.new(config_file.read).result)
  end
end
