require 'cgi'

module MongoHelpers

  def collection_admin_path(collection)
    config = MongoClient.config
    name = if config[:username]
      CGI.escape("#{config[:username]}@#{config[:host]}:#{config[:port]}/#{config[:db]}")
    else
      config[:host]
    end

    redirect "/admin/db/servers/#{name}/databases/#{config[:db]}/collections/#{collection}"
  end
end
