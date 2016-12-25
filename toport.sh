#!/bin/bash



function error()
{
	echo Parameter error:
	echo toport.sh CONTAINER_ID/NAME SYSTEM_port:CONTAINER_port
	exit
}



###### args nums
if [ $# -lt 2 ]; then
	error
fi 


##### args is right

ret=`docker ps | awk '{print($1" "$NF)}' | grep -v 'CONTAINER NAMES' | grep -w $1`

# CONTAINER exist
if [ ${#ret} -eq 0 ]; then
	echo Parameter error:
	echo CONTAINER_ID/NAME: $1 is not Up_status, or no such CONTAINER_ID/NAME
	exit
fi 

# port exist :
ret=`echo $2 | grep :`
if [[ $ret == "" ]]; then
	error
fi

# post is digit
var=${2//:/ }
echo Port:

for element in $var   
do  
	if grep '^[[:digit:]]*$' <<< "$element" ;then 
		if [[ $systemport == "" ]]; then
			systemport=$element
		else
			containerport=$element
		fi
	else
		error
	fi
	
	let nums=${nums}+1

done


if [ $nums -ne 2 ]; then
	error
fi

 
########

ip=`docker inspect --format='{{.NetworkSettings.IPAddress}}' $1`
echo IP: $ip

# delete
lines=`iptables -t nat -n -L DOCKER | grep -n "tcp dpt:$systemport to:$ip:$containerport" | awk -F ':' '{print $1}'   |head -n 1`
let lines=lines-2

if [ $lines -gt 0 ];then
	iptables  -t nat -D DOCKER $lines
fi

# add
iptables -t nat -I DOCKER -p tcp --dport $systemport -j DNAT --to $ip:$containerport


echo OK.









