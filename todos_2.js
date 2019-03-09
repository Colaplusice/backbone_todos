$(function () {

    //model
    var ToDo = Backbone.Model.extend({
        defaults: function () {
            return {
                title: "default title",
                order: "",
                done: false
            }
        },
        //触发 更改完成状态
        toggle: function () {
            this.save({done: !this.get('done')});
        }
    });

    //collection
    var ToDoList = Backbone.Collection.extend({
        model: ToDo,
        localStorage: new Backbone.LocalStorage("todos-backbone"),
        done: function () {
            return this.where({done: true})
        },
        //未完成
        remain: function () {
            return this.where({done: false})
        },
        nextOrder: function () {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
        comparator: 'order'
    });
    var Todos = new ToDoList;


    var ToDoView = Backbone.View.extend({
        initialize: function () {
            //对model的destroy事件的监听
            this.listenTo(this.model, 'change', this.render);
            //    remove是自带的方法，用来清除元素
            this.listenTo(this.model, 'destroy', this.remove);
        },
        tagName: "li",
        template: _.template($('#item-template').html()),
        events: {
            'click .toggle': "toggleDone",
            "dblclick .view": "edit",
            "click a.destroy": "clear",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "close",
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        }

    });

    var AppView = Backbone.View.extend({

                el: $("#todoapp"),
        //统计数据的模板
        statsTemplate: _.template($('#stats-template').html()),

        //监听按键
        events: {
            //有按键盘的时候 运行方法
            "keypress #new-todo": "createOnEnter",
            //清除完成的按键 绑定方法
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        initialize: function () {
         //根据id绑定 dom
            this.input = this.$('#new-todo');
            this.allCheckBox = this.$('#toggle-all')[0];

            //监听Todos collection对象的事件触发
            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'all', this.render);

            this.footer = this.$('footer');
            //id为main的dom
            this.main = $('#main');
            Todos.fetch();
        },
                        //添加一个任务到id为todo-list的dom上
        addOne: function (todo) {
            //创建todo_view同时声明model
            var view = new ToDOView({model: todo});
            this.$('#todo-list').append(view.render().el);
        },
        addAll: function () {
            //传递每个todo对象
            Todos.each(this.addOne, this);
        },
        createOnEnter: function (e) {
            if (e.keyCode != 13)
                return;

            if (!this.input.val()) return;
            //拿到title 的内容 创建model
            Todos.create({title: this.input.val()});
            this.input.val('');
        },
                render: function () {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;

            //如果有任务列表
            if (Todos.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}))
            } else {
                this.main.hide();
                this.footer.hide();
            }
            this.allCheckBox.checked = !remaining;
        },
             //对已完成的任务触发destroy
        clearCompleted: function () {
            _.invoke(Todos.done(), 'destroy');
            return false;
        },
        // 触发后将所有的todo_list标记位已完成
        toggleAllComplete: function () {
            var done = this.allCheckBox.checked;
            Todos.each(function (todo) {
                todo.save({'done': done}
                )
            });
        }
    });
    var App = new AppView;


});