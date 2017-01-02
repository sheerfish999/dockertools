
<?php

	// 载入模板的方式，今后复合使用

	$filename = "js/manage.js";
	$handle = fopen($filename, "r");
	$contents = fread($handle, filesize ($filename));
	fclose($handle);

echo <<<JS

	<div id="output"></div>
	
	<div id="canvas">

		<script type="text/javascript" src="js/qunee-min.js"></script>
		<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>

		<SCRIPT Language = "JavaScript">

			$contents

		</script>
		
	</div>

	<div id="bottom">
		<font color=#FFFFFF>
		即时生效:<br>
		1)  添加  "link 连接" 或 "端口映射":    双击 "节点", 填写需要"连接的节点名";   选择节点, 选择 "节点", "A" 键添加端口映射关系;<br>
		2)  删除  "link 连接" 或 "端口映射":    选择 "link 连接线" 或 "端口映射文本",  "Del" 键进行删除;<br>
		</font>
	
	</div>
	

JS;

?>




<!DOCTYPE html>
<html>
<head>
<title>容器网络即时设置</title>
<meta charset="utf-8">
 <style>
  	html
        {
         height:100%;
         margin:0;
        }
        body
        {
            height:100%;
            margin:0; 
            background:#000000;
        }
        
	#canvas
	{
	height:90%;
	background:#000000;
	}
	
	#output
	{ 
	position:absolute; 
	background: #000000; 
	float: left; 
	}
	
	#bottom
	{ 
	position:absolute; 
	background: #000000;
	float: bottom; 
	}
	
</style> 
  </style>
</head>

<body style="height:100%">



</body>
</html>




