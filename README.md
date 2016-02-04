# [<img title="ac-logo" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/302550/6531e1aa4c9afb455b32a2323ab4ee57985fc93b.jpg" width="184px" alt="Assetto Corsa logo"/>](https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/302550/6531e1aa4c9afb455b32a2323ab4ee57985fc93b.jpg)

[![Dependency Status](https://gemnasium.com/TylerBre/acserver_manager.svg)](https://gemnasium.com/TylerBre/acserver_manager)

Acserver Manager is designed to be the only solution you will need to manage a dedicated server for Assetto Corsa.

It aims to provide elegant interfaces and automation for:
- Uploading third-party cars and tracks
- Uploading custom skins
- Updating the Assetto Corsa Dedicated server app
- Editing ```server_cfg.ini``` and ```driver_list.ini``` files
- Managing 3rd-party apps such as stracker
- Starting and Stopping the server

As well as add new features entirely:
- Rotate server setup on race end
- Automated driverlists
- Series presets
- Car list presets
- Race-specific content bundles
- ... and more!

The app is designed to run on incredibly affordable ($5/mo) digital ocean boxes, which also grants users the ability to launch a dedicated server worldwide, ideally being from a pre-built image, but it is possible to install and run this app locally on your home computer.

### Disclaimer
This app is very much a development state, but please feel free to try it out, make some pull requests and contribute to the code :)

# Installation
In order to use this app to its full potential, you must have a few programs installed.

- postgresql
- node.js (latest)
- p7zip-full + p7zip-rar
- npm packages
  - gulp
  - pm2

These must all be installed and available in your PATH. If you're on ubuntu, you must enable multiverse in order to download p7zip-rar

