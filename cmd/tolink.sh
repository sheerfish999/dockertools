#!/bin/bash


##### args nums
if [ $# -lt 2 ]; then
	echo Parameter error:
	echo Link to each other: tolink.sh CONTAINER_ID/NAME1 CONTAINER_ID/NAME2
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


###  1 to 2

#docker exec $1 cp /etc/hosts /etc/hosts.temp
#docker exec $1 sed -i '/'$2'/d'  /etc/hosts.temp
#docker exec $1 bash -c 'cat /etc/hosts.temp > /etc/hosts'
#docker exec $1 bash -c 'echo '$ip2' '$2' >> /etc/hosts'

# 忽略注释行，精确匹配
has=`docker exec $1 cat /etc/hosts | grep $ip2 | grep -w $2 | grep -v ^#`

if [ ${#has} -eq 0 ]; then
	docker exec $1 cp /etc/hosts /etc/hosts.temp
	docker exec $1 bash -c 'cat /etc/hosts.temp > /etc/hosts'
	docker exec $1 bash -c 'echo '$ip2' '$2' >> /etc/hosts'
fi

echo $1 to $2 is OK

###  2 to 1

#docker exec $2 cp /etc/hosts /etc/hosts.temp
#docker exec $2 sed -i '/'$1'/d'  /etc/hosts.temp
#docker exec $2 bash -c 'cat /etc/hosts.temp > /etc/hosts'
#docker exec $2 bash -c 'echo '$ip1' '$1' >> /etc/hosts'

# 忽略注释行，精确匹配
has=`docker exec $2 cat /etc/hosts | grep $ip1 | grep -w $1 | grep -v ^#`

if [ ${#has} -eq 0 ]; then
	docker exec $2 cp /etc/hosts /etc/hosts.temp
	docker exec $2 bash -c 'cat /etc/hosts.temp > /etc/hosts'
	docker exec $2 bash -c 'echo '$ip1' '$1' >> /etc/hosts'
fi

echo $2 to $1 is OK






