require 'uri'
require 'open3'

module MongoImporter

  @@config = {}

  def self.config
    @@config
  end

  def self.setup(opts = {})
    if opts['uri']
      uri = URI.parse(opts['uri'])
      @@config = {
        :db => uri.path.gsub(/^\//, ''),
        :host => uri.host,
        :port => uri.port,
        :username => uri.user,
        :password => uri.password
      }
    else # local config
      @@config = {
        :db => opts['database'],
        :host => opts['host'],
        :port => opts['port']
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
