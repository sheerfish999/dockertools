#!/bin/bash


##### args nums
if [ $# -lt 2 ]; then
	echo Parameter error:
	echo Delete Link: dellink.sh CONTAINER_ID/NAME1 LINK_CONTAINER_ID/NAME2
	exit
fi 

##### args is right
ret=`docker ps | awk '{print($1" "$NF)}' | grep -v 'CONTAINER NAMES' | grep -w $1`

# CONTAINER exist
if [ ${#ret} -eq 0 ]; then
	echo Parameter error:
	echo CONTAINER_ID/NAME1: $1 is not Up_status, or no such CONTAINER_ID/NAME
	exit
fi 

# CONTAINER exist
ret=`docker ps | awk '{print($1" "$NF)}' | grep -v 'CONTAINER NAMES' | grep -w $2`

if [ ${#ret} -eq 0 ]; then
	echo Parameter error:
	echo CONTAINER_ID/NAME2: $2 is not Up_status, or no such CONTAINER_ID/NAME
	exit
fi 


####


ip1=`docker inspect --format='{{.NetworkSettings.IPAddress}}' $1`
ip2=`docker inspect --format='{{.NetworkSettings.IPAddress}}' $2`

echo $1: $ip1
echo $2: $ip2


###  1 DEL 2

docker exec $1 cp /etc/hosts /etc/hosts.temp
docker exec $1 sed -i '/'$2'/d'  /etc/hosts.temp
docker exec $1 bash -c 'cat /etc/hosts.temp > /etc/hosts'

echo $1 delete $2 link is OK







