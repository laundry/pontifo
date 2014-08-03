require 'uri'
require 'open3'

module MongoClient

  @@config = {}

  def self.config
    @@config
  end

  def self.setup(config = {}, environment)
    env_config = config[environment.to_s]
    if env_config['uri']
      uri = URI.parse(env_config['uri'])
      @@config = {
        :db => uri.path.gsub(/^\//, ''),
        :host => uri.host,
        :port => uri.port,
        :username => uri.user,
        :password => uri.password
      }
    else # local config
      @@config = {
        :db => env_config['database'],
        :host => env_config['host'],
        :port => env_config['port']
      }
    end
  end

  def self.import_json(collection, filename)
    args = @@config.merge(:collection => collection)

    cmd_args = args.collect { |arg, value|
      "--#{arg} #{value}"
    }.join(' ')

    cmd = "mongoimport --jsonArray --drop #{cmd_args} #{filename}"
    out, err, status = Open3.capture3(cmd)

    raise ScriptError, "#{cmd} failed: #{err}" unless status.success?
  end
end
