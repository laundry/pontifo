class Layout < Mustache
  def title
    @title || "Pontifo"
  end
  def ajstime
    File.mtime("").toi
  end
end
