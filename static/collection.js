var app=app||{};
console.log("this is collection app");
console.log(app);


$(function () {
    app.TodoList = Backbone.Collection.extend({
        url: '/todos/',
        model: app.Todo,
        // localStorage: new Backbone.LocalStorage("todos-backbone"),
        //设置完成
        done: function () {
            return this.where({done: true})
        },
        remaining: function () {
            return this.where({done: false})
        },
        nextOrder: function () {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
        //指明排序规则
        comparator: 'order'
    });
    app.Todos=new app.TodoList();
});