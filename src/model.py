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

from google.appengine.ext import db

class Session(db.Model):
    # key_name = session_id
    channel_token = db.StringProperty(indexed=False)
    last_activity = db.DateTimeProperty(auto_now=True)
