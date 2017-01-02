
<?php

error_reporting(E_ALL); 

//$read=system("id");   
//echo $read;  

/// 获得服务器地址
 if ( isset( $_SERVER['HTTP_X_FORWARDED_HOST'] ) ) { // Support ProxyPass
        $t_hosts = explode( ',', $_SERVER['HTTP_X_FORWARDED_HOST'] );
        $t_host = $t_hosts[0];
    } else if ( isset( $_SERVER['HTTP_HOST'] ) ) {
        $t_host = $_SERVER['HTTP_HOST'];
    } else if ( isset( $_SERVER['SERVER_NAME'] ) ) {
        $t_host = $_SERVER['SERVER_NAME'] . $t_port;
    } else if ( isset( $_SERVER['SERVER_ADDR'] ) ) {
        $t_host = $_SERVER['SERVER_ADDR'] . $t_port;
    }

#echo $t_host;
list($ip,$port)=split(":",$t_host,2);
#echo $ip;

#$address=$ip;  # 非必要不使用非本地连接
$address="127.0.0.1";
$service_port=31000;


##### 连接命令端

	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);  
	$result = socket_connect($socket, $address, $service_port);
	
	$cmd=$_GET["cmd"];  ## 预定义
	if ($cmd=="listport"){$in = "listport"; }
	if ($cmd=="listlink"){$in = "listlink"; }
	
	## 转化为命令到本地服务执行，尽量避免js直接拼凑命令形成攻击
	if ($cmd=="addport"){
		$str=$_GET["string"];
		$in = "run:cmd/toport.sh ".$str;
	}
	if ($cmd=="addlink"){
		$str=$_GET["string"];
		$in = "run:cmd/tolink.sh ".$str;
	}	
	if ($cmd=="delport"){
		$str=$_GET["string"];
		$in = "run:cmd/delport.sh ".$str;
	}
	if ($cmd=="dellink"){
		$str=$_GET["string"];
		$in = "run:cmd/dellink.sh ".$str;
	}
	
	### 容器内部
	if ($cmd=="exec"){
		$str=$_GET["string"];
		$in = "run:docker exec ".$str;
	}		

	### 直接接收运行服务器命令，正常状态未启用
	/**
	if ($cmd=="run"){
		$str=$_GET["string"];
		$in = "run:".$str;
	}
	**/

	
	socket_write($socket, $in, strlen($in));  

	while ($out = socket_read($socket, 2048)) {  
		echo $out;  
	}  

	socket_close($socket);  



?>



