


//////////////////// 初始绘图操作

var showCircle = function() {

	var PI = Math.PI;
	return {
	draw: function(_x, _y , a, b,  w, _num) {

	var add;
	add=360/_num;

	nos=0;

	///////  椭圆

	for(var i = 0; i < 360; i += add) {

	  	hudu=(Math.PI/180)*i,
		x1=a*Math.sin(hudu)+_x;
		y1=_y-(b*Math.cos(hudu));


		//////画节点
		names=portlist[nos][0]+"\n"+portlist[nos][1]   // 容器名
	  	hello[nos] = graph.createNode(names, x1-_x, y1-_y + w);   ///画节点
		hello[nos].image = Q.Graphs.subnetwork;   //cloud
		
		hello[nos].setStyle(Q.Styles.LABEL_COLOR, "#FF5809");

		//////节点端口信息  

		grouptemp[nos]=graph.createGroup("");
		grouptemp[nos].setStyle(Q.Styles.GROUP_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_HORIZONTAL);
		grouptemp[nos].groupType = Q.Consts.GROUP_TYPE_ELLIPSE;
		grouptemp[nos].setStyle(Q.Styles.GROUP_STROKE_LINE_DASH, [3,2]);
		grouptemp[nos].setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, false);
		
		grouptemp[nos].addChild(hello[nos]);


		if(portlist[nos].length>3){  //  ['1ffbaeb31a68', 'archsocks', '172.17.0.2', '9501:9501', '9500:9500']	
				
			for(var x=3;x<portlist[nos].length;x++)
				{
					Addaport(hello[nos],portlist[nos][x]);
					
				}
		}


		//////

		nos=nos+1;

	}

	///////   连线  需要在节点添加完成后
	
	for(var i=0;i<nums;i++)   // i的次序是一样的
	{
		if(linklist[i].length>3){  // ['5277fd40c00c', 'centos1', '172.17.0.3', 'centos1:5277fd40c00c', 'centos1:5277fd40c00c']
				
				for(var x=3;x<linklist[i].length;x++)    // 第四个成员开始
					{
						names=linklist[i][x].split(":");
						thename=names[1]+ "\n" +names[0];
						
						model.forEachReverse(function(nodes){   //枚举节点 是否有匹配
						
							if(nodes.name==thename)
								{
									namefroms=hello[i].name.split("\n");
									namefrom=namefroms[1];
									var edges = graph.createEdge(namefroms[1] +" to " + names[0], hello[i] , nodes);
									edges.setStyle(Q.Styles.LABEL_COLOR, "#53FF53");
									
									edges.setStyle(Q.Styles.EDGE_COLOR, '#FFFFFF');
									edges.setStyle(Q.Styles.EDGE_WIDTH, 3);
								}
						
						});
						
					}
				
			}
	}
	

	////////////////// 按键操作

	graph.onkeydown = function(evt) {

		    /// DEL删除
		    if(evt.keyCode == 46){      //delete

			model.forEachReverse(function(node){
			if (graph.isSelected(node)==true)
			{
				delit(node);
			}
			});

		    }


		    /// A添加端口映射
		  if(evt.keyCode == 65){       //A

			model.forEachReverse(function(node){
			if (graph.isSelected(node)==true)
			{
				akey(node);
			}
			});

		    }

	}

	/////  双击 添加link

	graph.ondblclick = function(evt){
	    var node = graph.getElementByMouseEvent(evt);
	    if(node){
			dbkey(node);
	    }
	}

	/////// 单击 显示运行进程

	graph.onclick = function(evt){
	    var node = graph.getElementByMouseEvent(evt);
	    if(node){
			clicknode(node);
	    }
	}


	///////


    }
}
}();


////////////////// 容器和图像操作

//DEL触发事件
function delit(node)
{

	// 删除 link
	if (node.type=="Q.Edge"){
		names=node.name.split("\n");
	 	ret = confirm("确认要删除该link: " + node.name  +" 吗？(立即生效)");
		if (ret==true){
			model.remove(node);

			////删除link动作
			
			cmd=node.name;   // xxx to xxx
			delthelink(cmd);

		}

	 }

	// 删除端口映射
	if (node.type=="Q.Text"){

	 	ret = confirm(node.name + " 确认要删除该端口映射关系吗？(立即生效)");
		if (ret==true){
		
			////删除端口映射动作
			
			//找到其所属容器
			model.forEachReverse(function(nodes){

				if (nodes.type=="Q.Node"){  //类型		
					if(node.parent==nodes.parent){  //同一个组下
						names=nodes.name.split("\n");
						cmd=names[1] + " " + node.name;   // name xx:xx
						deltheport(cmd);	
					}  
				}

			});
			
			
			/////
			
			model.remove(node);
			

		}
	 }

	///


}


//A 触发事件
function akey(node)
{

	////添加端口映射
	if (node.type=="Q.Node"){
	
		names=node.name.split("\n");
		ret = prompt("节点: " +  names[0]+","+names[1] +"\n"  + "请填写需要添加的端口映射关系, 格式:  外部端口:容器端口.(立即生效)");
		if (ret!="" && ret!=null ){
		
			//格式判断
			var bool = ret.indexOf(":"); 
			//alert(bool);
			if(bool!=0 && bool!=1 && bool!=ret.length){
			
				ports=ret.split(":");
				port1=ports[0];
				port2=ports[1];
				
				if(isNaN(port1)==false && isNaN(port2)==false){  //数字
		
					if(port1%1 == 0 && port2%1 == 0 && port1>0 && port2>0 && port1<65535 && port2<65535){  //整形及范围
					
						
						// 判断端口是否已经重复
						hascheck=0;
						model.forEachReverse(function(nodes){
						
							if (nodes.type=="Q.Text"){  //类型					
								if(node.parent==nodes.parent && nodes.name==ret){hascheck=1;}  //同一个组下，并且同名
							}
							

						});
						
						if (hascheck==0){
						
							Addaport(node,ret);
			
							////添加端口映射动作
							
							cmd=names[1] + " " + ret;   //// name port:port
							addtheport(cmd);
							
						}
						
						
					}
					
				}
			
			
			}


		}
	}


}


//添加一个端口的绘图操作

function Addaport(node,text){

	x=node.location.x;
	y=node.location.y;

	xpos=GetRandomNum(40,48);
	xplus=Getplus();

	ypos=GetRandomNum(40,48);
	yplus=Getplus();

	xt=parseInt(x+xpos*xplus);
	yt=parseInt(y-ypos);   //上方

	var temps = graph.createText(text,xt, yt);

	temps.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
	node.parent.addChild(temps);  //父节点添加  到组
	temps.host=node;   //节点跟随

}



// 随机值  用于绘图

function GetRandomNum(Min,Max){   //范围随机
	var Range = Max - Min;
	var Rand = Math.random();
	rets=Min + Math.round(Rand * Range);
	return(rets);

}

function Getplus(){    //符号随机

	var Rand = Math.random();
	if (Rand>0.5){
		return 1;
	}else {
		return -1;
	}


}


// 双击触发事件
function dbkey(node)
{

	////添加 link
	if (node.type=="Q.Node"){
	
		names=node.name.split("\n");
		ret = prompt("节点: " +  names[0]+","+names[1] +"\n"  + "请填写需要建立link的另一个容器名.(彼此link,立即生效)");
		
		if (ret!="" && ret!=null && ret!=node.name ){

			model.forEachReverse(function(nodes){    //枚举节点是否有匹配
			
				if (nodes.type=="Q.Node"){   //节点类型
				
					name2=nodes.name.split("\n");
				
					if (ret==name2[0] || ret==name2[1])  //匹配其中一个
					{						
						nametos=nodes.name.split("\n");
						
						// 正向连接线
						
						linkname=names[1] +" to " + name2[1];
						haslink=0;
						
						model.forEachReverse(function(edgenode){    //枚举link是否有重复
						
							if (edgenode.type=="Q.Edge"){   //连线类型
								if(edgenode.name==linkname){haslink=1;};
							}
							
						});
						
						if(haslink==0) {  //不存在
							var edgestemp = graph.createEdge(linkname,  node , nodes);
							edgestemp.setStyle(Q.Styles.LABEL_COLOR, "#53FF53");
							edgestemp.setStyle(Q.Styles.EDGE_COLOR, '#FFFFFF');
							edgestemp.setStyle(Q.Styles.EDGE_WIDTH, 3);
						}

						
						// 反向连接线					
						linkname=name2[1] +" to " + names[1];
						haslink=0;
		
						model.forEachReverse(function(edgenode){    //枚举link是否有重复
						
							if (edgenode.type=="Q.Edge"){   //连线类型
								if(edgenode.name==linkname){haslink=1;};
							}
							
						});

						if(haslink==0) {  //不存在
							var edgestemp = graph.createEdge(linkname,  nodes , node);
							edgestemp.setStyle(Q.Styles.LABEL_COLOR, "#53FF53");
							edgestemp.setStyle(Q.Styles.EDGE_COLOR, '#FFFFFF');
							edgestemp.setStyle(Q.Styles.EDGE_WIDTH, 3);
						
						}

						////添加link动作
						
						cmd=names[1] + " " + name2[1];     //  xxx1 xxx2
						addthelink(cmd);


					}
				}
				
			});

		}
	}

	/////////


}


// 单击触发事件

function clicknode(node)
{

	if (node.type=="Q.Node"){
	
		names=node.name.split("\n");
		thename=names[1];

		ret=execcommand(thename,"ps -ef | grep -v 'ps -ef'");
		
		ret=ret.replace(/\n/g,"<br>");
	
		var innerstr=" <br><font color=#4DFFFF>"+ names + " :";
		innerstr=innerstr+ret;
		innerstr=innerstr+"</font>";
		$("#output").html(innerstr);
	}
}



  
////////////////////// 获取容器信息与操作
  
// 端口映射信息

function getportlist()
{
	var datalist;
	$.ajax({
		url:"getcmd.php?cmd=listport",
		async:false,			// get异步模式无法及时得到返回值
		type:"GET",
		success:function(data)
			{
			//alert("数据：" + data);
			datalist=eval("("+data+")"); 
			
			}
		});
			
	return datalist;
			
}  


// link信息

function getlinklist()
{
	var datalist;
	$.ajax({		
		url:"getcmd.php?cmd=listlink",
		async:false,			 // get异步模式无法及时得到返回值
		type:"GET",
		success:function(data)        
			{
			//alert("数据：" + data);
		
			datalist=eval("("+data+")"); 
		
			}
		});
			
	return datalist;
			
}  


// 添加link
function addthelink(strs){

	var retstr;
	urls="getcmd.php?cmd=addlink&string="+strs;

	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{retstr=data;}
	});
	

	return retstr;

}


// 添加port
function addtheport(strs){

	var retstr;
	urls="getcmd.php?cmd=addport&string="+strs;

	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{retstr=data;}
	});
	

	return retstr;


}

// 删除link
function delthelink(strs){

	names=strs.split(" ");
	name1=names[0];
	name2=names[2];	

	var retstr;
	urls="getcmd.php?cmd=dellink&string="+name1 + " " +name2;

	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{retstr=data;}
	});
	

	return retstr;


}


// 删除port
function deltheport(strs){

	var retstr;
	urls="getcmd.php?cmd=delport&string="+strs;

	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{retstr=data;}
	});
	

	return retstr;


}

// 运行容器内命令

function execcommand(names,strs){

	var retstr;
	urls="getcmd.php?cmd=exec&string="+ names+ " "+ strs;

	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{retstr=data;}
	});
	

	return retstr;


}



// 直接运行命令 （正常状态，远程php未启用该接口）

function runcommand(cmd)
{

	var retstr;
	urls="getcmd.php?cmd=run&string="+cmd;

	/**
	$.get(urls , "" ,function(data){
			retstr=data;
		});
	**/
	
	$.ajax({		
	url:urls,
	async:false,			 // get异步模式无法及时得到返回值
	type:"GET",
	success:function(data)        
		{
		//alert("数据：" + data);
		retstr=data;
	
		}
	});
	

	return retstr;
}



/////////////////////////////  绘图设定


var graph = new Q.Graph('canvas');
var model = graph.graphModel;

var hello=[];
var temp=[];
var grouptemp=[];

var x,y,a,b;

x=document.documentElement.clientWidth/2;
y=document.documentElement.clientHeight/2;

a=document.documentElement.clientWidth/2-120;
b=document.documentElement.clientHeight/2-160;

w=0;    // y 轴微调


//////获得最初信息

var portlist=getportlist();
var linklist=getlinklist();	

var nums=portlist.length;   // 开机容器数量

if (nums>0){
	showCircle.draw(x, y, a,b, w, nums);   // 圆心,   椭圆半径ab ,   y轴矫正值,    数量

	//自动布局
	var layouter = new Q.SpringLayouter(graph);
	layouter.repulsion = 300;
	layouter.attractive = 5;
	layouter.elastic = 0.5;
	layouter.start();
}






