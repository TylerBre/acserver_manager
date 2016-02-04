# TODO: convert this to js.
# stracker.ini needs to be compiled with env-specifc variables, such as paths.
# I'm not too sure if this can be a standalone script, but we'll see...

# #!/bin/sh

# stracker_dir=/home/acserver/stracker
# stracker_exec=$stracker_dir/stracker_linux_x86/stracker
# pid_file=/home/acserver/processes/stracker.pid

# nohup $stracker_exec --stracker_ini=$stracker_dir/stracker.ini >>/dev/null 2>&1 &
# RETVAL=$?
# PID=$!
# echo $PID > $pid_file

# if [ $RETVAL -eq 0 ]; then
#   echo "[OK] stracker started with process id ${PID}. Output logs saved to /home/acserver/log/stracker.log"
# else
#   echo "[FAILED] stracker not started"
# fi
# return $RETVAL
