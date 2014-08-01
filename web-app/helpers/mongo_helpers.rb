require 'cgi'

module MongoHelpers

  def collection_admin_path(collection)
    config = MongoImporter.config
    name = if config[:username]
      CGI.escape("#{config[:username]}@#{config[:host]}:#{config[:port]}/#{config[:db]}")
    elsif config[:host] == "localhost"
      config[:host]
    else
      "config[:host]:config[:port]"
    end

    redirect "/admin/db/servers/#{name}/databases/#{config[:db]}/collections/#{collection}"
  end
end
