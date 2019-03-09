var app = app || {};
console.log("this is todoview");
console.log(app);


$(function () {
    //    view 层 将html中的事件和自定义的函数进行绑定
    app.ToDOView = Backbone.View.extend({
        //将template中的html模板放在li中
        tagName: "li",
        // template 为item-template id的dom
        template: _.template($('#item-template').html()),
        //每个任务条目绑定一个事件
        events: {
            'click .toggle': "toggleDone",
            "dblclick .view": "edit",
            "click a.destroy": "clear",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "close",
        },
        initialize: function () {
            //对model的change 一旦有修改 重新刷新html
            this.listenTo(this.model, 'change', this.render);
            // 监听model的事件
            this.listenTo(this.model, 'destroy', this.remove);
        },
        //渲染model中的元素到html
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            //绑定input
            this.input = this.$('.edit');
            return this;
        },
        // 控制任务完成或者未完成
        toggleDone: function () {
            this.model.toggle();
        },
        edit: function () {
            this.$el.addClass("editing");
            this.input.focus();
        },
        //close 的时候保存edit value
        close: function () {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({'title': value});
                this.$el.removeClass('editing');
            }
        },
        //按下回车键 关闭模式
        updateOnEnter: function (e) {
            if (e.keyCode === 13) {
                this.close();
            }
        },
        clear: function () {
            this.model.destroy()
        }
    });
    app.todo_view = new app.ToDOView();
});