import random
import os
import json
import flask
from flask_login import login_user, current_user, LoginManager, logout_user, UserMixin
from flask_login.utils import login_required
from flask_sqlalchemy import SQLAlchemy
from dotenv import find_dotenv, load_dotenv
from wikipedia import get_wiki_link
from tmdb import get_movie_data


load_dotenv(find_dotenv())

app = flask.Flask(__name__)
# Point SQLAlchemy to your Heroku database
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = b"I am a secret key!"  # don't defraud my app ok?

db = SQLAlchemy(app)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(200))
    username = db.Column(db.String(80))
    movie_id = db.Column(db.Integer)


db.create_all()
login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(username):
    return User.query.get(username)


bp = flask.Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)
MOVIE_IDS = [
    634649,
    157336,
    923632,
]

# route for serving React page
@bp.route("/index")
@login_required
def index():
    movie_id = random.choice(MOVIE_IDS)
    # API calls
    (title, tagline, genre, poster_image) = get_movie_data(movie_id)
    wiki_url = get_wiki_link(title)
    ratings = Rating.query.filter_by(movie_id=movie_id).all()
    ratings_ids = [t.id for t in ratings]
    data = json.dumps(
        {
            "username": current_user.username,
            "tagline": tagline,
            "genre": genre,
            "wiki_url": wiki_url,
            "ratings_ids": ratings_ids,
            "movie_id": movie_id,
            "poster_image": poster_image,
        }
    )
    print(data)
    return flask.render_template("index.html", data=data)


app.register_blueprint(bp)


@app.route("/signup")
def signup():
    return flask.render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    username = flask.request.form.get("username")
    user = User.query.filter_by(username=username).first()
    if user:
        pass
    else:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()

    return flask.redirect(flask.url_for("login"))


@app.route("/login")
def login():
    return flask.render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    username = flask.request.form.get("username")
    user = User.query.filter_by(username=username).first()
    if user:
        login_user(user)
        return flask.redirect(flask.url_for("bp.index"))

    else:
        return flask.jsonify({"status": 401, "reason": "Username or Password Error"})


@app.route("/rate", methods=["POST"])
def rate():
    data = flask.request.form
    rating = data.get("rating")
    comment = data.get("comment")
    movie_id = data.get("movie_id")

    new_rating = Rating(
        username=current_user.username,
        rating=rating,
        comment=comment,
        movie_id=movie_id,
    )

    db.session.add(new_rating)
    db.session.commit()
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/")
def landing():
    if current_user.is_authenticated:
        return flask.redirect(flask.url_for("bp.index"))
    return flask.redirect("login")


@app.route("/logout")
def logout():
    logout_user()
    return flask.redirect("login")


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
