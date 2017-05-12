// 1、首先定一个一个函数来执行所有的过程
function Table(obj){
    extend(this,tac,obj) // 最后一个是用户传的，来覆盖默认值
    this.load()
}
// 2、定义工厂函数
function table(obj){
    try {
        if(!obj||!obj.url) { // 假设只有这个是必须要传的
            throw new Error ("参数错误")
        } 
    } catch (error) {
        console.log(error)
        return null
    }
    return new Table(obj)  // 直接将该对象传进去
}
// 3、做extend函数
function extend(obj){
    for (var i = 1; i < arguments.length; i++) {
        for(var key in arguments[i]){
            obj[key] = arguments[i][key]
        }  
    }
    return obj
}
// 4、定义默认参数
var tac = {
    type:"get",
    url:window.location.href,
    contentType:"application/x-www-form-urlencoded;charst:utf-8",
    ele:null,
    data:null
}
// 5、原型替换
Table.prototype = {
    constructor:Table,
    load:function(){
        // console.log(111111) // 成功的，可以开始创建ajax
        var that = this
        var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest():new window.ActiveXObject("XMLHTTP")
        // console.log(this)
        xhr.open(this.type,this.url)
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if(xhr.status >=200 &&xhr.status<300||xhr.status==304){
                    that.data = JSON.parse(xhr.responseText)
                    console.log(that.data)
                    // 这个应该算是最后一步，当下面的全部拼接好之后，在这里调用 that.table() 方法
                    that.table() 
                }
            }
        }
        xhr.send()
    },
    thead:function(){
        var thead = document.createElement("thead")
        for(var key in this.data[0]){
            var th = document.createElement("th")
            th.innerHTML = key
            thead.appendChild(th)
        }
        return thead
    },
    tbody:function(){
        var tbody = document.createElement("tbody")
        for(var i = 0;i<this.data.length;i++){
            var tr = document.createElement("tr")
            for(var key in this.data[i]){
                var td = document.createElement("td")
                td.innerHTML = this.data[i][key]
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }
        return tbody
    },
    table:function(){
        var table = document.createElement("table")
        table.appendChild(this.thead())
        table.appendChild(this.tbody())
        document.querySelector(this.ele).appendChild(table)
    }
}
// 6、用户传入
table({
    url:"data.json",
    ele:"#list"
})