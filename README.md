

## 容器管理器原型

### 解决问题

1） 容器网络关系展示

自动分析容器间的网络关系进行动态布局

2） 镜像启动为容器的时候才能进行端口映射和link的重新设置,并且link有容器的启动时间的先后关系, 因此为保证服务的持续运行的灵活性和高可维护性, 有可能需要在服务不中断的条件下进行灵活调整

即时调整容器运行状态端口映射关系和容器link关系(支持彼此相互link,解决启动顺序问题)

3） 不使用 run --link 方式时， docker 原生的本地网路转发效率较低

运行状态下，即能进行设置，高效提高容器间的转发速率

dockertools link前，通过容器名自动转发的效率：

![image](http://callisto.ngrok.cc/wiki/lib/exe/fetch.php?w=300&tok=c5b2bc&media=232725438.jpg)

 通过 dockertools 动态link 后的转发效率：
 
![image](http://callisto.ngrok.cc/wiki/lib/exe/fetch.php?w=300&tok=73f485&media=674420238.jpg)


### 使用方法

1) 配置好 http服务器 与 php， 并将 www-data 添加进入 docker 组

usermod -a -G docker www-data

2) 运行服务
nohup sudo python cmd/showlocal.py -d &

随后访问 index.php 地址即可


## 内置本地工具组

### tolink.sh

两个已经启动的容器之间A通过 CONTAINER_ID/NAME 彼此建立link:

tolink.sh  CONTAINER_ID/NAME1  CONTAINER_ID/NAME2

tolink.sh　centos1 centos2

### toport.sh

已经启动的容器对外映射一个端口:

toport.sh  CONTAINER_ID/NAME  SYSTEMport:CONTAINERport

tolink.sh  centos1 8080:8081

### dellink.sh

已经启动的容器之间删除link

dellink.sh  CONTAINER_ID/NAME1  LINK_CONTAINER_ID/NAME2

dellink.sh  centos1  centos2

删除容器centos1 中对 centos2 的 link


### delport.sh

已经启动的容器删除端口映射

delport.sh CONTAINER_ID/NAME1  LINK_CONTAINER_ID/NAME2
dellink.sh  centos1 8080:8081

### showlocal.py

显示本地容器的所有的端口映射关系, 以及已经启动的容器之间的有效的link

python showlocal.py



