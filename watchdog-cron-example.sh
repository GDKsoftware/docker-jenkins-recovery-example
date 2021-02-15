#!/bin/sh
curl --silent -f -m 2 --resolve api.myapplication.com:3000:127.0.0.1 https://api.myapplication.com:3000/api/v1/commandthatmightfail > /dev/null
status=$?
if [ $status -ne 0 ]; then
  echo date >> /home/mydockeruser/scripts/restarted.txt # log the restart event
  ./restart.sh
fi
