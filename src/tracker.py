# Traffique: live visitor statistics on App Engine
# Copyright (C) 2011 Jean Joskin <jeanjoskin.com>
#
# Traffique is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Traffique is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Traffique. If not, see <http://www.gnu.org/licenses/>.

import model
from datetime import datetime, timedelta
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import channel
from google.appengine.api import memcache

PIXEL_GIF = "GIF87a\x01\x00\x01\x00\x80\x00\x00\x0A\x00\x00\x00\x00\x00\x21\xF9" + \
            "\x04\x01\x00\x00\x01\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02" + \
            "\x02\x4C\x01\x00\x3B"

class Tracker(webapp.RequestHandler):
    @staticmethod
    def get_active_channel_tokens():
        # Fetch active clients
        channel_tokens = memcache.get("channel_tokens")
        
        if channel_tokens is None:
            q = model.Session.all()
            q.filter("last_activity > ", datetime.utcnow() - timedelta(minutes = 5))
            q.order("-last_activity")
            clients = q.fetch(limit = 20)
        
            channel_tokens = []
            for client in clients:
                channel_tokens.append(client.key().name())
        
            memcache.set("channel_tokens", channel_tokens, 3600)
        
        return channel_tokens
        
    def get(self):
        try:
            # Notify all sessions
            tokens = Tracker.get_active_channel_tokens()
            msg = '{"i":"' + self.request.remote_addr + '"}';
            for token in tokens:
                channel.send_message(token, msg)
        finally:
            # Return pixel to user
            self.response.headers["Content-Type"] = "image/gif"
            self.response.out.write(PIXEL_GIF)

application = webapp.WSGIApplication(
                                     [
                                      ("/t.gif", Tracker)
                                     ],
                                     debug=False)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
