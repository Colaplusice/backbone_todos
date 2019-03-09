// $(function () {
//     //创建一个collection对象
//     var Todos = new TodoList;
//     var App = new AppView;
//
//     var ToDoRouter = Backbone.Router.extend({
//         routes: {
//             "about": "showAbout",
//             "todo/:id": "getTodo",
//             //query为可以匹配的参数，可以任意传递
//             "search/:query": "searchTodos",
//             //http://example.com/#search/job/p1
//             "search/:query/:p:page": "searchTodos",
//             "*other": "defaultRoute",
//             "*filter": "setFilter",
//         },
//         setFilter: function (params) {
//             console.log("thi sis params",params);
//             window.app.Todos.trigger('filter');
//         },
//         showAbout: function () {
//             // document.write(document.cookie);
//             // console.log("this is about page");
//         },
//         getTodo: function () {
//         },
//         searchTodos: function (query) {
//             console.log("this is the search query" + query);
//         },
//         defaultRoute: function () {
//         },
//     });
//     // var workSpace = Backbone.Router.extend({
//     //     routes: {
//     //         '*filter': 'setFilter'
//     //     },
//     //     setFilter: function (param) {
//     //         alert('here');
//     //         window.AppView.Todos.trigger('filter');
//     //     }
//     // });
//     // App.TodoRouter = new ToDoRouter();
//     var MyToDoRouter = new ToDoRouter();
//     // Backbone.history.start();
//
//
// });