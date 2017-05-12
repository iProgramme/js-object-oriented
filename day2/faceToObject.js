function Datas(dom,url,type) {
	this.dom = document.querySelector(dom);
	this.url = url;
	type = type=='post'?'post':'get';
	this.type = type
	this.data = null;
	this.load = function () {
		var that = this;
		var xhr = new XMLHttpRequest()
		xhr.open(this.type,this.url)
		// 这里的this 指的是调用该函数的对象

		xhr.onreadystatechange = function(){
			// 这里面的this指的是 xhr
			if (xhr.readyState == 4) {
				if (xhr.status >=200&&xhr.status <300 ||xhr.status ==304) {
					that.data = JSON.parse(xhr.responseText)
					// console.log(that.data)
					that.dom.appendChild(that.btable())
				}else{
					// fail
					console.log("请求失败了")
				}
			}
		}
		xhr.send()  // 千万别忘了这个 send
		
	}
	this.bthead = function () {
		var thead = document.createElement('thead')
		for(var key in this.data[0]){
			var th = document.createElement('th')
			th.innerHTML = key
			thead.appendChild(th)
		}
		// console.log(thead)
		return thead
	}
	this.btbody = function () {
		var tbody = document.createElement('tbody')
		for (var i = 0; i < this.data.length; i++) {
			var tr = document.createElement('tr');
			for( var k in this.data[i]){
				var td = document.createElement('td')
				td.innerHTML = this.data[i][k]
				tr.appendChild(td)
			}
			tbody.appendChild(tr)
		}
		return tbody
	}
	this.btable = function () {
		var table = document.createElement('table')
		table.appendChild(this.bthead())
		table.appendChild(this.btbody())
		return table
	}
	this.load()
}

new Datas("#list","data.json","get")
