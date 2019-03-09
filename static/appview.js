var app = app || {};
console.log("this is appview");
console.log(app);

$(function () {
     var AppView = Backbone.View.extend({
        el: $("#todoapp"),
        //统计数据的模板
        statsTemplate: _.template($('#stats-template').html()),
        events: {
            //有按键盘的时候 运行方法
            "keypress #new-todo": "createOnEnter",
            //清除完成的按键 绑定方法
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },
        initialize: function () {
            //根据id绑定 dom
            this.input = this.$("#new-todo");
            this.allCheckBox = this.$("#toggle-all")[0];

            //监听Todos collection对象的事件触发
            this.listenTo(app.Todos, 'add', this.addOne);
            this.listenTo(app.Todos, 'reset', this.addAll);
            this.listenTo(app.Todos, 'all', this.render);

            this.footer = this.$('footer');
            //id为main的dom
            this.main = $('#main');
            app.Todos.fetch();
        },
        render: function () {
            var done = app.Todos.done().length;
            var remaining = app.Todos.remaining().length;

            //如果有任务列表
            if (app.Todos.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}))
            } else {
                this.main.hide();
                this.footer.hide();
            }
            this.allCheckBox.checked = !remaining;
        },
        //添加一个任务到id为todo-list的dom上
        addOne: function (todo) {
            //创建todo_view同时声明model
            var view = new app.ToDOView({model: todo});
            this.$('#todo-list').append(view.render().el);
        },
        addAll: function () {
            /*传递每个todo对象*/
            app.Todos.each(this.addOne, this);
        },
        //
        // newAttributes: function () {
        //     return {
        //         title: this.input.val(),
        //         order: app.Todos.nextOrder(),
        //         done: false
        //     }
        // },
        createOnEnter: function (e) {
            if (e.keyCode != 13)
                return;

            if (!this.input.val()) return;
            //拿到title 的内容 创建model
            app.Todos.create({title: this.input.val()});
            this.input.val("");
        },

        //对已完成的任务触发destroy
        clearCompleted: function () {
            _.invoke(app.Todos.done(), "destroy");
            return false;
        },
        // 触发后将所有的todo_list标记位已完成
        toggleAllComplete: function () {
            var done = this.allCheckBox.checked;
            app.Todos.each(function (todo) {
                todo.save({"done": done}
                )
            });
        }
    });
     app.AppView=AppView;
    app.app_view = new AppView();
});