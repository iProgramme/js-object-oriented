(function(global){
    var document = global.document;
    // 构造函数
    function Table(obj){
        extend(this,moren,obj)
        this.load()
    }
    // 工厂函数
    function table(obj){
        try {
            if(!(obj&&obj.url)){
                throw new Error("错误")
            }
        } catch (error) {
            console.log(error)
        }
        return new Table(obj)
    }
    // extend实现继承
    function extend(obj){
        for(var i =1;i<arguments.length;i++){
            for(var key in arguments[i]){
                obj[key] = arguments[i][key]
            }
        }
        return obj
    }
    // 给Table加方法
    Table.prototype = {
        constructor:Table,
        load:function(){
            var that = this
            var xhr = global.XMLHttpRequest ? new global.XMLHttpRequest() : new global.ActiveXObject("XMLHTTP");
            that.type = that.type=="post"?"post":"get"
            xhr.open(this.type,this.url)
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
                    if(xhr.status >= 200&&xhr.status<300||xhr.status==304){
                        // console.log(11111)
                        that.data = global.JSON.parse(xhr.responseText)
                        // console.log(that.data)
                        that.table()
                        that.del()
                    }
                }
                
            }
            xhr.send()
        },
        thead:function(){
            var thead = document.createElement("thead")
            var tr = document.createElement("tr")
            // 添加序列号
            var th = document.createElement("th")
            th.innerHTML = "序号"
            th.setAttribute("data-tab",-1)
            th.setAttribute("data-index",0)
            tr.appendChild(th)
            for(var i = 0;i<this.datain.length;i++){
                th = document.createElement("th")
                th.innerHTML = this.datain[i].name
                th.setAttribute("data-tab",-1)
                th.setAttribute("data-index",i+1)
                tr.appendChild(th)
            }
            // 添加序列号
            var th = document.createElement("th")
            th.innerHTML = "编辑"
            th.setAttribute("data-tab",-1)
            th.setAttribute("data-index",i+1)
            tr.appendChild(th)
            thead.appendChild(tr)
            this.sorter()
            return thead
        },
        tbody:function(){
            var tbody = document.createElement("tbody")
            for(var i = 0;i<this.data.length;i++){
                var tr = document.createElement("tr")
                tr.setAttribute("date-index",i)
                // 添加序列号
                var td = document.createElement("td")
                td.innerHTML = i+1
                tr.appendChild(td)
                for(var j = 0;j<this.datain.length;j++){
                    td = document.createElement("td")
                    td.innerHTML = this.data[i][this.datain[j].name]
                    tr.appendChild(td)
                }
                // 添加编辑
                var td = document.createElement("td")
                td.innerHTML = "<a data-name='edit' href='javascript:;'>编辑</a> <a data-name='del' href='javascript:;'>删除</a>"
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
        },
        del:function(){
            var that = this
            var table = document.querySelector(this.ele+" table") // 注意有个空格才是选择器。。
            table.addEventListener("click",function(e){
                // console.log(1)
                var target = e.target,
                    name = target.getAttribute("data-name")
                if(name){
                    var par = target.parentNode.parentNode
                    switch(name){
                        case 'del':
                        // console.log(111)
                        var index = par.getAttribute('date-index')
                        that.data.splice(index,1)
                        console.table(that.data) // 删除完成，重新渲染 tbody
                        that.refresh()
                        break;
                        case 'edit':
                        break
                    }
                }
            })
        },
        refresh:function(){
            // 注意，在 this.table() 这个方法里面，给 this 添加了属性 table ，指向所创建的那个表格
            console.log(this.table)
            this.table.removeChild(this.table.tBodies[0])  
            this.table.appendChild(this.tbody()) // 由于在 this.table() 里面有给添加删除事件，所以这里不需要再次调用 this.del()
        },
        // 排序事件
        sorter:function(){
            var that = this
            var flag = -1
            this.table.addEventListener('click',function(e){
                var target = e.target;
                // 点击时，获取当前排序的方式
                flag = target.getAttribute("data-tab")>0?-1:1;
                console.log(flag)
                var _top = target.getAttribute("data-index")-1
                if(_top<1||_top>that.datain.length-1){ // 若点的是 序号，则返回
                    return false
                }
                var prop = that.datain[_top].name
                    // console.log(index)
                that.data.sort(function(a,b){
                    return a[prop]>b[prop]?flag:-flag
                })
                target.setAttribute("data-tab",flag)
                that.refresh()  // 记得要刷新页面。。。。
            })
        }
    }
    var moren = {
        url:"./data.json",
        ele:"#list",
        data:null,
        datain:[
            {name:"name"},
            {name:"age"},
            {name:"love"},
            {name:"email"},
            {name:"address"}
        ]
    }
    // table(moren)
    global.table = table   // 对外只暴露一个 table 的window属性，一切效果都由此属性传入
})(window)

table({
    url:'data.json',
    datain:[
        {name:"age"},
        {name:"address"},
        {name:"email"},
        {name:"love"},
        {name:"name"}
    ],
    ele:"#list"
})