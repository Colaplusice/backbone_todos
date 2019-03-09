from flask import Flask, render_template, request, jsonify, abort, Response
from flask.views import MethodView
from peewee import (
    Model,
    CharField,
    IntegerField,
    BooleanField,
    SqliteDatabase,
    IntegrityError,
    DoesNotExist,
)
from playhouse.flask_utils import FlaskDB
from playhouse.shortcuts import model_to_dict, update_model_from_dict

app = Flask(__name__, template_folder="", static_folder="", static_url_path="")

db = SqliteDatabase("todo.db")

flask_db = FlaskDB(database=db)
flask_db.init_app(app)


class ToDo(Model):
    class Meta:
        database = db

    title = CharField(max_length=255)
    order = IntegerField()
    done = BooleanField(default=False)


if not db.table_exists("todo"):
    db.create_tables([ToDo])


@app.route("/")
def index():
    if request.json:
        return jsonify("success")
    # return render_template('collections.html')
    return render_template("index.html")


class ManView(MethodView):
    def get(self):
        pass

    def post(self):
        pass


class BookView(MethodView):
    def get(self):
        pass

    def post(self):
        pass


class ToDosView(MethodView):
    def get(self, id):
        todos = ToDo.select()
        if id:
            todo = todos.where(ToDo.id == id).first()
            return jsonify(model_to_dict(todo))
        return jsonify([model_to_dict(todo) for todo in todos])

    def post(self):
        if not request.json:
            abort(400)
        print(request.json)
        try:
            ToDo.create(**request.json)
            return Response(status=201)
        except IntegrityError:
            abort(400)

    def put(self, id):
        todos = ToDo.get_by_id(id)
        update_model_from_dict(todos, request.json)
        return Response(status=202)
        # return jsonify({"status_code": 204, "message": "update_success"})

    def delete(self, id):
        try:
            ToDo.delete_by_id(id)
        except DoesNotExist:
            return Response(status=200)
        return Response(status=204)
        # return jsonify({"status_code": 201, "message": "delete success"})


def register_api(view, endpoint, url, pk="id", pk_type="int"):
    view_func = view.as_view(endpoint)
    app.add_url_rule(url, defaults={pk: None}, view_func=view_func, methods=["GET"])
    app.add_url_rule(url, view_func=view_func, methods=["POST"])
    app.add_url_rule(
        "%s<%s:%s>" % (url, pk_type, pk),
        view_func=view_func,
        methods=["GET", "PUT", "DELETE"],
    )


register_api(ToDosView, "todos_view", "/todos/", pk="id")
register_api(ManView, "man_vew", "/man/")
register_api(BookView, "book_vew", "/book/")

if __name__ == "__main__":
    app.run(port=8080, debug=True)
