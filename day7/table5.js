(function (global) {
    var document = global.document
    function Table(obj) {
        extend(this,obj)
        // console.log(this) // 第一次测试
        this.load()
    }
    function extend(obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                obj[key] = arguments[i][key]
            }
        }
        return obj
    }
    // 工厂函数
    function table(obj) {
        try {
            if(!(obj&&obj.url)){
                throw new Error("参数错误")
            }
        }catch (err){
            console.log(err)
            return null
        }
        return new Table(obj)
    }
    Table.prototype = {
        constructor:Table,
        load:function(){
            var that = this
            var xhr = global.XMLHttpRequest?new global.XMLHttpRequest():new global.ActiveXObject("XMLHTTP")
            xhr.open(this.type,this.url)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
                        that.data = JSON.parse(xhr.responseText)
                        // console.table(that.data) //第二次测试
                        that.table() // 第三次测试
                    }
                }
            }
            xhr.send()
        },
        thead:function(){
            var thead = document.createElement("thead")
            var tr = document.createElement("tr")
            var th = document.createElement("th")
            th.innerHTML = "序号"
            tr.appendChild(th)
            for (var i = 0; i < this.userdata.length; i++) {
                var th = document.createElement("th")
                th.innerHTML = this.userdata[i].text
                th.setAttribute("data-name",this.userdata[i].name)
                th.setAttribute("data-flag",-1)
                tr.appendChild(th)
            }
            th = document.createElement("th")
            th.innerHTML = "编辑"
            tr.appendChild(th)
            thead.appendChild(tr)
            return thead
        },
        tbody:function(){
            var tbody = document.createElement("tbody")
            var tr = document.createElement("tr")
            var td
            for (var i = 0; i < this.data.length; i++) {
                tr = document.createElement("tr")
                tr.setAttribute("data-index",i)
                td = document.createElement("td")
                td.innerHTML = i+1
                tr.appendChild(td)
                for (var j = 0; j < this.userdata.length; j++) {
                    td = document.createElement("td")
                    td.innerHTML = this.data[i][this.userdata[j].name]
                    tr.appendChild(td)
                }
                td = document.createElement("td")
                td.innerHTML = '<a href="javascript:;" name="edit">编辑</a> <a href="javascript:;" name="del">删除</a>'
                tr.appendChild(td)
                tbody.appendChild(tr)
            }
            return tbody

        },
        table:function(){
            var table = this.table = document.createElement("table")
            table.appendChild(this.thead())
            table.appendChild(this.tbody())
            document.querySelector(this.ele).appendChild(table)
            this.del()
            this.sorter()
        },
        del:function () {
            var that = this
            this.table.addEventListener("click",function (e) {
                var tar = e.target
                if (tar.name) {
                    switch (tar.name){
                        case "del":
                            // console.log(4) // 第四次测试
                            var index = tar.parentNode.parentNode.getAttribute("data-index")
                            that.data.splice(index,1)
                            that.refresh()
                        break;
                    }
                }
            })
        },
        refresh:function () {
            this.table.removeChild(this.table.tBodies[0])
            this.table.appendChild(this.tbody()) // 第五次测试
        },
        sorter:function () { // 排序
            var that = this
            var thead = document.querySelector(this.ele + " thead")
            thead.addEventListener("click",function (e) {
                var tar = e.target
                // console.log(1) // 第六次测试
                var name = tar.getAttribute("data-name")
                var flag = tar.getAttribute("data-flag")
                that.data.sort(function (a,b) {
                    return a[name]<b[name]?flag:-flag
                })
                tar.setAttribute("data-flag",-flag)
                that.refresh()
            })

        }
    }
    window.table = table
})(window)
table({
    url:"data.json",
    type:"get",
    ele:"#list",
    userdata:[
        {text:"年龄",name:"age"},
        {text:"地址",name:"address"},
        {text:"爱好",name:"love"},
        {text:"姓名",name:"name"},
        {text:"邮箱",name:"email"}
    ]
})