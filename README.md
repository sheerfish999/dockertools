docker 便捷工具组

## 工具组一

解决启动后容器link与重新设定端口映射的问题:

由于理论上只有在镜像启动为容器的时候才能进行端口映射和link,并且link有容器的启动时间的先后关系, 因此为保证服务的持续运行的灵活性和高可维护性, 有可能需要在后期进行调整


### tolink.sh

两个已经启动的容器之间A通过 CONTAINER_ID/NAME 彼此建立link:

tolink.sh  CONTAINER_ID/NAME1  CONTAINER_ID/NAME2

tolink.sh　centos1 centos2

### toport.sh

已经启动的容器对外映射一个端口:

toport.sh  CONTAINER_ID/NAME  SYSTEMport:CONTAINERport

tolink.sh  centos1 8080:8081

### showlocal.py

显示本地容器的所有的端口映射关系, 以及已经启动的容器之间的有效的link

python showlocal.py
