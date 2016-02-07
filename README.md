# [<img title="ac-logo" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/302550/6531e1aa4c9afb455b32a2323ab4ee57985fc93b.jpg" width="184px" alt="Assetto Corsa logo"/>](https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/302550/6531e1aa4c9afb455b32a2323ab4ee57985fc93b.jpg)
[![Build Status](https://travis-ci.org/TylerBre/acserver_manager.svg?branch=master)](https://travis-ci.org/TylerBre/acserver_manager)
[![Dependency Status](https://gemnasium.com/TylerBre/acserver_manager.svg)](https://gemnasium.com/TylerBre/acserver_manager)

Acserver Manager is designed to be the only solution you will need to manage a dedicated server for Assetto Corsa.

It aims to provide elegant interfaces and automation for:
- ~~Uploading third-party cars and tracks~~ ✔
- Uploading custom skins
- Updating the Assetto Corsa Dedicated server app
- Editing ```server_cfg.ini``` and ```driver_list.ini``` files
- Managing 3rd-party apps such as stracker
- Starting and Stopping the server

As well as to add new features entirely:
- Rotate server setup on race end
- Automated driverlists
- Series presets
- Car list presets
- Race-specific content bundles
- ... and more!

The app is designed to run on incredibly affordable ($5/mo) [Digital Ocean](https://www.digitalocean.com/) boxes, and launched from a pre-built image. This will also grant users the ability to launch a dedicated server worldwide, minimizing ping. It is possible to install and run this app locally on your home computer.

### Disclaimer
This app is very much in a development state at the moment, but please feel free to try it out, make some pull requests and contribute to the code!

Happy hacking!

# Installation

Though Acserver Manager will be bundled inside of a VM image for easy installation, in the meantime, you'll need to run it in a standolone environment.

As this is being developed for deployment to a 32-bit Ubuntu 15 installation, I recommend you do the same, either with Digital Ocean, or a local environment. However, if you have your own Linux installation and are comfortable with some googling when things go wrong, the installation procedure should be pretty similar.

### Requirements

<strong>postgresql</strong>
```
$ sudo apt-get install postgresql postgresql-contrib
```
<strong>node.js</strong>

You can find links to the latest builds here: [https://nodejs.org/dist/latest/](https://nodejs.org/dist/latest/)
```
$ wget http://nodejs.org/dist/latest/node-v5.5.0-linux-x86.tar.gz
$ sudo tar -C /usr/local --strip-components 1 -xzf node-v5.5.0-linux-x86.tar.gz
$ rm node-v5.5.0-linux-x86.tar.gz
```
<strong>p7zip-full + p7zip-rar</strong>

Enable multiverse by uncommenting lines in ```/etc/apt/sources.list```, more info here [https://help.ubuntu.com/community/Repositories/CommandLine#Adding_Repositories](https://help.ubuntu.com/community/Repositories/CommandLine#Adding_Repositories)
```
$ sudo apt-get update
$ sudo apt-get install p7zip-full p7zip-rar -y
```

<strong>gulp</strong>
```
$ sudo npm install -g gulp
```

# Setup

Login to the postgres user and enter the psql cli
```
$ sudo -u postgres psql postgres
```
Update the postgres user password and create the databases
```
postgres=# \password postgres
postgres=# create database acserver_manager;
postgres=# create database stracker;
```
Clone this repo and cd into it
```
$ cd ~
$ git clone git@github.com:TylerBre/acserver_manager.git
$ cd acserver_manager
```
Install local dependencies. Note, this will also run steamcmd for the first time and will prompt you for your steam credentials and a steam guard key
```
$ npm install
```
Populate the database with data about the installed content
```
$ npm run db:seed
```
Finally, copy ```config/default.json``` to ```config/development.json``` and update your database password with what you set earlier.

# Usage
From the project directory
```
$ npm run server
```


