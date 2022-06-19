require 'webrick'

srv = WEBrick::HTTPServer.new({
  :DocumentRoot => './',
  :BindAddress => '127.0.0.1',
  :Port => 3000,
})

srv.mount('/', WEBrick::HTTPServlet::FileHandler, 'index.html')

srv.mount_proc '/test' do |req, res|
  test = req.request_line
  res.body = 'test_response'
end

trap("INT"){ srv.shutdown }
srv.start