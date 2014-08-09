require 'open-uri'

module TextClient

  @@base_uri = ""

  def self.setup(config = {}, environment)
    env_config = config[environment.to_s]
    @@base_uri = env_config['uri']
  end

  def self.remove_word(sentence)
    response = self.make_request('remove', :s => sentence)
    response.to_i
  end

  private

  def self.make_request(endpoint, args = {})
    url = "#{@@base_uri}/#{endpoint}?#{args.to_query}"
    open(url).read
  end
end
