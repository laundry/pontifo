class Layout < Mustache
  def title
    @title || "Pontifo"
  end
  def ajstime
    File.mtime("public/a.js").to_i
  end
  def acsstime
    File.mtime("public/a.css").to_i
  end
end
