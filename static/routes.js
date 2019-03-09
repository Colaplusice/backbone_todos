var app = app || {};
console.log("this is routes app");
console.log(app);
$(function () {
    app.ToDoRoutes = Backbone.Router.extend({
        // http://127.0.0.1:8080/#donesd   donesd
        routes: {
            "filter": "setFilter",
            "*what_fuck":"wtf",
        },
        wtf:function(param) {
        alert('you trigger the wtf!');
        },
        setFilter: function (param) {
            console.log(param);
            app.ToDoFilter = param || '';
            app.Todos.trigger('filter');
            //
            this.navigate('/what_fuck', {trigger: false, replace: true});
        }
    });
    app.todo_route = new app.ToDoRoutes;
    Backbone.history.start();
});