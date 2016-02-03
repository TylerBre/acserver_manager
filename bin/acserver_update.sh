#!/bin/bash
install_dir="/home/acserver/acserver"

# get user/pass info for steamcmd authentication
read -p "Your Steam username: " uname
read -s -p "Your Steam password: " pass

/home/acserver/steamcmd/steamcmd.sh +login $uname $pass +force_install_dir $install_dir +@sSteamCmdForcePlatformType windows +app_update 302550 validate +quit
