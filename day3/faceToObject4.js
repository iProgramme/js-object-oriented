// 1、需要构造的函数
function Table(obj){
    extend(this,tac,obj)
    this.load()
}
// 2、工厂函数
function table(obj){
    try {
        if(!obj||!obj.url){
            throw new Error("参数错误")
        }
    } catch (error) {
        console.log(error)
        return null
    }
    return new Table(obj)
}
// 3、extend函数
function extend(child){
    for(var i = 1;i<arguments.length;i++){
        for(var key in arguments[i]){
            child[key] = arguments[i][key]
        }
    }
    return child
}
// 4、给默认值
var tac = {
    url:window.location.href,
    type:"get",
    data:null,
    ele:null
}
// 5、原型替换
Table.prototype = {
    constructor:Table,
    load:function(){
        // console.log(111)
        var that = this
        var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() :  new window.ActiveXObject("XMLHTTP")
        xhr.open(this.type,this.url)
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status>=200&&xhr.status<300||xhr.status==304){
                    that.data = JSON.parse(xhr.responseText)
                    console.log(that.data)
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
table({
    url:"data.json",
    ele:"#list"
})