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
import uuid
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import channel
from google.appengine.api import memcache
import view.main
import settings

class Backend(webapp.RequestHandler):
    def get(self):
        session_id = str(uuid.uuid4())
        
        channel_token = channel.create_channel(session_id)

        client = model.Session(key_name = session_id)
        client.channel_token = channel_token 
        client.put()
        
        memcache.delete("channel_tokens")
        
        template_params = { 'session_id' : session_id, 'channel_token' : channel_token, 'ipinfo_key' : settings.IPINFO_API_KEY }
        self.response.out.write( view.main.render(template_params) )

class Ping(webapp.RequestHandler):
    def get(self):
        session_id = self.request.get('s', None)
        if not session_id is None:
            client = model.Session.get_by_key_name(session_id)
            if not client is None:
                # updating causes client.last_activity to be set to "now"
                client.put()

application = webapp.WSGIApplication(
                                     [
                                      ('/', Backend)
                                     ,('/ping', Ping)
                                     ],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
