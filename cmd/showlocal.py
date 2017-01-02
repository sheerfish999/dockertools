# -*- coding: utf-8 -*-

import sys

if sys.version_info.major==2:   
	from commands import getoutput as runshell
if sys.version_info.major==3:
	from subprocess import getoutput as runshell
 
import re
import copy

from SocketServer import TCPServer, BaseRequestHandler
import traceback

import json


###### 所有容器信息

def getids():

	ids=[]


	cmd="docker ps | awk '{print($1\" \"$NF)}' | grep -v 'CONTAINER NAMES'"

	## 逐行切割
	ret= runshell(cmd)
	lines=ret.split("\n")

	for num in range(len(lines)):
		line=lines[num]
		#print(line)
		name=line.split(" ")
		
		if len(name)>1:
			cmd="docker inspect --format='{{.NetworkSettings.IPAddress}}' " + name[0]
			ret= runshell(cmd)
	
			ids.append([name[0],name[1],ret])   # ['798a5ffa100d', 'centos3', '172.17.0.5']
		

	"""
	for num in range(len(ids)):
		print(ids[num])
	"""
	
	return(ids)
	

####### 容器端口转发信息

def getport():

	ids=getids()
	re_port=copy.deepcopy(ids)
	

	cmd="iptables -t nat -n -L DOCKER | grep DNAT | awk '{print($7\" \"$8)}'"

	## 逐行切割
	ret= runshell(cmd)
	lines=ret.split("\n")

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
	#print(re_port)	
	return(re_port)


def getportstr():

	strs=""

	re_porttemp=getport()
	re_port=copy.deepcopy(re_porttemp)

	for num in range(len(re_port)):

		if(len(re_port[num]))>3:
			strs=strs + "("+ re_port[num][1]+ " " +re_port[num][0]+"):"+ "\n"

			for porttoport in range(3,len(re_port[num])):
				strs=strs + re_port[num][porttoport] + "\n"
		
	return strs


def getportliststr():

	re_porttemp=getport()
	re_port=copy.deepcopy(re_porttemp)
	
	liststr=json.dumps(re_port)
	return liststr


#### 容器link信息

def getlink():

	ids=getids()
	link_ip=copy.deepcopy(ids)
	
	for num in range(len(ids)):
		#print(ids[num])
	
		cmd="docker exec " + ids[num][1] +" cat /etc/hosts"
		ret= runshell(cmd)
		#print(ret)
		lines=ret.split("\n")
	
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
								
									link_ip[num].append(ids[num1][1]+":" +ids[num1][0])
									
									yes=True
									break
				
					if yes==True:
						break		
	
	## ['5277fd40c00c', 'centos1', '172.17.0.3',  'centos1:5277fd40c00c', 'centos2:1277fd40c00c']
	#print(link_ip)
	return(link_ip)			



def getlinkstr():

	strs=""

	link_iptemp=getlink()
	link_ip=copy.deepcopy(link_iptemp)

	for num in range(len(link_ip)):

		#print(link_ip[num])

		if(len(link_ip[num]))>3:
			strs=strs + "(" + link_ip[num][1]+ " " +link_ip[num][0]+"):" + "\n"


			for iptoip in range(3,len(link_ip[num])):
				strs=strs + link_ip[num][iptoip] + "\n"

	return strs


def getlinkliststr():

	link_iptemp=getlink()
	link_ip=copy.deepcopy(link_iptemp)

	liststr=json.dumps(link_ip)
	return liststr
	



####################################  网络

class MyBaseRequestHandlerr(BaseRequestHandler):  

	def handle(self):  
	
		while True:  

			data =""
			ret=""
			
			try:  
				#print(dir(self.request))
				self.request.settimeout(3)    ####### 避免攻击性连接，会跳转到 except
				data = self.request.recv(1024).strip()
				
				#print(data)
				if data=="listport":
					ret=getportliststr()
					
				if data=="listlink":
					ret=getlinkliststr()
					
				if data[:4]=="run:":   ## 自定义
					strs=data[4:]
					ret= runshell(strs)
					print(strs)
					print(ret)
		
				self.request.sendall(ret)				
				self.request.close()
				
			except:  
				#traceback.print_exc()
				self.request.close()
				
				break
				


##########################################


if __name__ == '__main__':  

	
	### 参数
	
	if len(sys.argv)>1:
	
		if sys.argv[1]=="-d":   ## 后台监听模式  对外服务解决root权限问题， 所以必须root权限运行
		
			#host = ""
			host= "127.0.0.1"  #安全考虑只能本地服务连接       
			port = 31000
			addr = (host, port)  
		 
			server = TCPServer(addr, MyBaseRequestHandlerr)
			
			try:
				#print(dir(server))
				server.serve_forever()
			except:
				### 异常退出，释放端口
				server.shutdown()

	### 普通输出模式
	
	else:

		###### 输出端口转发信息
	
		print("***** All Port REDIRECT *****")
		print(getportstr())


		#### 输出link信息

		print("***** All CONTAINER LINKS *****")
		print(getlinkstr())





