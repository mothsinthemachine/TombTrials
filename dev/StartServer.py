'''
StartServer

Imports modules and starts a basic HTTP server.
'''

import http.server
import socketserver

def main(PORT=8000):
	Handler = http.server.SimpleHTTPRequestHandler
	with socketserver.TCPServer(("", PORT), Handler) as httpd:
		print("Serving at port", PORT)
		httpd.serve_forever()
# end main()

main()