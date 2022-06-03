require 'webrick'
srv = WEBrick::HTTPServer.new({
  :DocumentRoot => './',
  :BindAddress => '127.0.0.1',
  :Port => 3000,
  # :MimeTypes => {
  #   '.css' => 'text/css',
  #   '.js' => 'text/javascript'
  # }
})

srv.mount('/', WEBrick::HTTPServlet::FileHandler, 'index.html')
# srv.mount('/copy', WEBrick::HTTPServlet::FileHandler, 'index_copy.html')
# srv.mount('/', WEBrick::HTTPServlet::FileHandler, 'style.css')
# srv.mount('/', WEBrick::HTTPServlet::FileHandler, 'main.js')

# srv.mount_proc('/'){|req, res|
#   content_types = {
#     '.html' => 'text/html',
#     '.css' => 'text/css',
#     '.js' => 'text/javascript'
#   }

#   content_type = content_types[File.extname(req.path)]
#   if content_type == nil
#     content_type = 'text/html'
#   end
#   res['Content-Type'] = content_type
# }



trap("INT"){ srv.shutdown }
srv.start