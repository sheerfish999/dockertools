# -*- coding: utf-8 -*-

import commands
import re
import copy



###### 所有容器信息

def getids():

	ids=[]


	cmd="docker ps | awk '{print($1\" \"$NF)}' | grep -v 'CONTAINER NAMES'"

	## 逐行切割
	ret= commands.getstatusoutput(cmd)
	lines=ret[1].split("\n")

	for num in range(len(lines)):
		line=lines[num]
		#print(line)
		name=line.split(" ")
		cmd="docker inspect --format='{{.NetworkSettings.IPAddress}}' " + name[0]
		ret= commands.getstatusoutput(cmd)
	
		ids.append([name[0],name[1],ret[1]])   # ['798a5ffa100d', 'centos3', '172.17.0.5']


	"""
	for num in range(len(ids)):
		print(ids[num])
	"""
	
	return(ids)
	

####### 容器转发信息

def getport():

	ids=getids()
	re_port=copy.deepcopy(ids)
	

	cmd="iptables -t nat -n -L DOCKER | grep DNAT | awk '{print($7\" \"$8)}'"

	## 逐行切割
	ret= commands.getstatusoutput(cmd)
	lines=ret[1].split("\n")

	for num in range(len(lines)):
		line=lines[num]
		line=line.replace("dpt:","")
		line=line.replace("to:","")
		line=line.replace(":"," ")
	
		#print(line)           #  220 172.17.0.3 22
		theport=line.split(" ")   

		for num in range(len(ids)):
			if ids[num][2]==theport[1]:
				re_port[num].append(theport[0]+":"+theport[2])     
				
				
	# ['1ffbaeb31a68', 'archsocks', '172.17.0.2', '9501:9501', '9500:9500']			
	return(re_port)




#### 容器link信息

def getlink():

	ids=getids()
	link_ip=copy.deepcopy(ids)
	
	for num in range(len(ids)):
		#print(ids[num])
	
		cmd="docker exec " + ids[num][1] +" cat /etc/hosts"
		ret= commands.getstatusoutput(cmd)
		lines=ret[1].split("\n")
	
		#### 文件的每一行
		for x in range(len(lines)):
			line=lines[x]
			#print(line)
						
			if(line[:1] !="#"): ### 非注释行
				#print(line)
			
				ret=re.split("\t| ",line)   ### hosts文件的分割可能
				
				yes=False
			
				#### 一个ip对应多个hostname
				for w in range(1,len(ret)):   
				
					if ids[num][1]!=ret[w] and ids[num][0]!=ret[w]:   ### 非容器本身的地址

						for num1 in range(len(ids)):
				
							if ids[num1][0]==ret[w] or ids[num1][1]==ret[w]:
								#print(line)
									
								if ret[0]==ids[num1][2]:			#### link的 ip正确
									link_ip[num1].append(ids[num][1]+":" +ids[num][0])
									
									yes=True
									break
				
					if yes==True:
						break		
	
	## ['5277fd40c00c', 'centos1', '172.17.0.3', '220:22', 'centos1:5277fd40c00c', 'centos1:5277fd40c00c']
	return(link_ip)			



##########################################


if __name__ == '__main__':  


	###### 输出端口转发信息
	
	print("***** All Port REDIRECT *****")
	
	re_porttemp=getport()
	re_port=copy.deepcopy(re_porttemp)
	

	for num in range(len(re_port)):
		#print(re_port[num])
	
		if(len(re_port[num]))>3:
			print(re_port[num][1]+ " " +re_port[num][0]+":")

		
			for porttoport in range(3,len(re_port[num])):
				print("-- " + re_port[num][porttoport])
				
			print("")



	#### 输出link信息

	print("")
	print("***** All CONTAINER LINKS *****")
	
	link_iptemp=getlink()
	link_ip=copy.deepcopy(link_iptemp)

	for num in range(len(link_ip)):

		#print(link_ip[num])
	
		if(len(link_ip[num]))>3:
			print(link_ip[num][1]+ " " +link_ip[num][0]+":")

		
			for iptoip in range(3,len(link_ip[num])):
				print("-- " + link_ip[num][iptoip])	


			print("")




