var app=app||{};
console.log("this is model app");
console.log(app);

$(function () {
    app.Todo = Backbone.Model.extend({
        urlRoot: '/todos/',
        defaults: function () {
            return {
                title: "empty todo",
                order: app.Todos.nextOrder(),
                done: false
            }
        },
        toggle: function () {
            this.save({done: !this.get('done')});
        }
    });
});