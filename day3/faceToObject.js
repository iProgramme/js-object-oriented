// 1、
function Table(obj){
	// 6、继承 : 
	// this 是没有任何属性和方法的 指向自己
	// tac 是存储的默认的属性
	// obj 是用户传入的值
	extend(this,tac,obj)
	// 调用自身的load方法
	this.load()
}
// 2、创建工厂函数
function table( obj ){
	try{
		if (!obj||!obj.url) {
			throw new Error ("参数错误")
		}
	} catch(err){
		console.log(err)
		return null
	}
	return new Table(obj) // 构造函数
}
// 3、混入继承
function extend(obj){
	for (var i = 1; i < arguments.length; i++) {
		for (var key in arguments[i]) {
			obj[key] = arguments[i][key]
		}
	}
	return obj // 将已经混入继承的元素 return 出去
}
// 4、定义需要继承的项
var tac = {
	type:"get",
	url:window.location.href,
	contentType:"application/x-www-form-urlencoded;charst:utf-8",
	Data:null,
	ele:null
}
// 5、定义方法
Table.prototype = {
	constructor:Table,
	// ajax
	load:function(){
		var that = this
		var xhr = window.XMLHttpRequest? new window.XMLHttpRequest():new window.ActiveXObject("XMLHTTP")  // 注意 前面的那个不需要加括号的
		xhr.open(this.type,this.url)
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status >=200&&xhr.status<300||xhr.status==304) {
					// 说明成功了
					that.Data = JSON.parse(xhr.responseText)
					console.log(that.Data)
					that.table()
				}
			}
		}
		xhr.send()
	},
	thead:function(){
		var thead = document.createElement("thead")
		for (var key in this.Data[0]) {
			var th = document.createElement("th")
			th.innerHTML = key   // 第一行，只需要拿到名称就好了
			thead.appendChild(th)
		}
		// 别忘了返回
		return thead
	},
	tbody:function(){
		var tbody = document.createElement("tbody")
		for (var i = 0; i < this.Data.length; i++) {
			var tr = document.createElement("tr")
			for (var key in this.Data[i]) {
				var td = document.createElement("td")
				td.innerHTML = this.Data[i][key]
				tr.appendChild(td)
			}
			tbody.appendChild(tr)
		}
		return tbody
	},
	// 合成表格的其他部分
	table:function(){
		var table = document.createElement("table")
		table.appendChild(this.thead())
		table.appendChild(this.tbody())
		document.querySelector(this.ele).appendChild(table)
	}
}
// 7、用户传值
table({
	url:"data.json",
	ele:"#list"
})