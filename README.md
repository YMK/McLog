# YaManicLog

## What is this?

I got bored of logging onto my server to view my IRC logs, so I looked for something that would do what I wanted. It didn't exist (at least not one that would work).
So I made this. It doesn't fulfill all my needs yet, but it will soon.

It's a very simple app, it just shows you the servers you are have, then the channel, what days you have logs from, and then you can view the logs from that day.

It uses Google Authenticator to authenticate (just as 1fa). It will present you with a QR code on first run on /setup, and use the code that it generates to log in.

## Do you have any screenshots?

Sure:

![Index view](https://github.com/YaManicKill/YaManicLog/raw/master/docs/img/root-view.png "Index view")
![Server view](https://github.com/YaManicKill/YaManicLog/raw/master/docs/img/server-view.png "Server view")
![Channel view](https://github.com/YaManicKill/YaManicLog/raw/master/docs/img/chan-view.png "Channel view")
![Log view](https://github.com/YaManicKill/YaManicLog/raw/master/docs/img/log-view.png "Log view")


## Installation

* Clone https://github.com/YaManicKill/YaManicLog.git
* npm i
* npm start

If your logs are stored anywhere other than ~/logs, then you must edit your config to show that.

Note that your logs must be stored as "server/chan/day" to work.

* Navigate to /setup and scan the QR code with your 2fa app
* Log in with your 2fa code

## Config

The config file is created in ~/.config/YaManicLog on first run. These are your options:

* port (default 4000)

The port that the app will run under.

* rootPath (default ~/logs/)

This is where your list of server directories is.

* allowAnonymous (default false)

If you want anonymous people to be able to view logs, then set that here.

* filterUsersForAnonymous (default true)

If you allow anonymous users, settings this to true will hide PMs (anything not starting in #). Set to false to allow access to everything.

* hideForAnonymous (default ["#someChan", "aUser"])

If you allow anonymous users, everything in this array will be hidden from anonymous view.
