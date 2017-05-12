function Datas(ele,url,type) {
	this.ele = document.querySelector(ele)
	this.url = url
	type = type=="post"?"post":"get"
	this.type = type
	this.data = null  // 存储从服务器获取到的数据
	this.load = function () {
		var that = this
		var xhr = new XMLHttpRequest()
		xhr.open(this.type,this.url)
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status >=200&&xhr.status<300||xhr.status==304) {
					// 说明成功了
					that.data = JSON.parse(xhr.responseText)
					// console.log(that.data)
					that.ele.appendChild(that.wtable())  // 在这里组装，将table 加到该元素中
				}
			}
		}
		xhr.send()
	}
	this.wthead = function () {
		var thead = document.createElement('thead');
		for(var key in this.data[0]){
			var th = document.createElement('th')
			th.innerHTML = key
			thead.appendChild(th)   // 记得每次都要把这个加到里面去
		}
		return thead // 最后返回这个 thead
	}
	this.wtbody = function () {
		var tbody = document.createElement('tbody');
		for(var i = 0 ; i<this.data.length;i++){
			var tr = document.createElement('tr')
			for(var key in this.data[i]){
				var td = document.createElement('td')
				td.innerHTML = this.data[i][key]
				tr.appendChild(td)
			}
			tbody.appendChild(tr)
		}
		return tbody // 最后返回这个 tbody
	}
	this.wtable = function () {
		var table = document.createElement('table')
		table.appendChild(this.wthead())
		table.appendChild(this.wtbody())
		return table
	}
	this.load()
}

new Datas('#list','data.json','get')









