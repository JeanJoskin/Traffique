![Traffique. Real-time traffic information](https://traffique-demo.appspot.com/img/banner.png)

What is it?
-----------

Traffique is an open source app for Google App Engine. It allows you to see your
website's visitors in real-time. You can instantly see their estimated location
and the traffic volume.

Want to try it?
-------------------

Have a look at the public demo instance at <http://traffique-demo.appspot.com>.
Access to Traffique is limited to app administrators by default. Traffique
is limited to 20 concurrent observers to ensure performance.

How does it work?
-----------------

You include the single pixel image <http://your-traffique-instance.appspot.com/t.gif> on your
website (or e-mail, or whatever you want to track). Then you open Traffique
and see all page-views in real-time.

Use it on your own website!
---------------------------

You can install Traffique on your own App Engine account in 7 steps:

1. Download the latest Traffique distribution zip and unzip it on your hard-drive. Download
   location: <https://github.com/downloads/JeanJoskin/Traffique/traffique-0.1-dist.zip>.
2. Download and install the App Engine SDK for Python for your platform at <http://code.google.com/appengine/downloads.html>
3. Create a new application on the App Engine website and choose your own application identifier.
4. Open "app.yaml". Change the "application: <your application id here>" to refer
   to the app id you chose at the first step.
5. Register at <http://ipinfodb.com/register.php> and create a free API key. This key is needed
   to enable the app to estimate a user's location.
6. Open "settings.py". Change the line "IPINFO_API_KEY = '<your ipinfo api key here>'"
   to include your API key.
7. Add the Traffique folder to the App Engine Launcher (File > Add Existing Application) from
   the App Engine SDK and choose "Deploy".

Disclaimer
----------

This app has not been tested on high-volume websites and should not
be used as such. Since there is no Nagle-algorithm present, each
request results in a single message to be sent to all observers. It is
unknown how this affects the performance in case of a large number
of visitors.
