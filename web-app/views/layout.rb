class Layout < Mustache
  def title
    @title || "Pontifo"
  end
  def jsfile
    if File.mtime("public/a.js").to_i>File.mtime("public/a.min.js").to_i
      "/a.js?v="+File.mtime("public/a.js").to_i.to_s
    else
      "/a.min.js?v="+File.mtime("public/a.min.js").to_i.to_s
    end
  end
  def acsstime
    File.mtime("public/a.css").to_i
  end
end
