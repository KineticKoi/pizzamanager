from flask import Flask, request, jsonify
from flask_cors import CORS
from database_manager import execute_query
import queries

app = Flask(__name__)
CORS(app)

################
# CONSTANTS
################
APP_NAME = "PIZZA MANAGER API"
APP_VERSION = "1.0.0"

################
# API ENDPOINTS
################
#GET TOPPINGS
@app.route("/get_toppings", methods=["POST"])
def get_toppings():
    toppings = execute_query(query = queries.get_toppings())
    if toppings is None:
        return jsonify({"success": False, "error": "Error getting toppings"})
    return jsonify({"success": True, "toppings": toppings})

#GET TOPPING
@app.route("/get_topping", methods=["POST"])
def get_topping():
    topping_id = request.json["id"]
    if topping_id is None:
        return jsonify({"success": False, "error": "No topping id provided"})
    topping = execute_query(query = queries.get_topping(topping_id = topping_id))
    return jsonify({"success": True, "topping": topping})

#CREATE TOPPING
@app.route("/create_topping", methods=["POST"])
def create_topping():
    topping = request.json["topping"]
    if topping is None:
        return jsonify({"success": False, "error": "No topping provided"})
    execute_query(query = queries.create_topping(topping = topping))
    return jsonify({"success": True})

#UPDATE TOPPING
@app.route("/update_topping", methods=["POST"])
def update_topping():
    topping_id = request.json["id"]
    topping = request.json["topping"]
    if topping_id is None or topping is None:
        return jsonify({"success": False, "error": "No topping id or topping provided"})
    execute_query(query = queries.update_topping(topping_id = topping_id, topping = topping))
    return jsonify({"success": True})

#DELETE TOPPING
@app.route("/delete_topping", methods=["POST"])
def delete_topping():
    topping_id = request.json["id"]
    if topping_id is None:
        return jsonify({"success": False, "error": "No topping id provided"})
    execute_query(query = queries.delete_topping(topping_id = topping_id))
    return jsonify({"success": True})

#GET PIZZAS
@app.route("/get_pizzas", methods=["POST"])
def get_pizzas():
    pizzas = execute_query(query = queries.get_pizzas())
    if pizzas is None:
        return jsonify({"success": False, "error": "Error getting pizzas"})
    return jsonify({"success": True, "pizzas": pizzas})

#GET PIZZA
@app.route("/get_pizza", methods=["POST"])
def get_pizza():
    pizza_id = request.json["id"]
    if pizza_id is None:
        return jsonify({"success": False, "error": "No pizza id provided"})
    pizza = execute_query(query = queries.get_pizza(pizza_id = pizza_id))
    return jsonify({"success": True, "pizza": pizza})

#CREATE PIZZA
@app.route("/create_pizza", methods=["POST"])
def create_pizza():
    pizza = request.json["pizza"]
    if pizza is None:
        return jsonify({"success": False, "error": "No pizza provided"})
    execute_query(query = queries.create_pizza(pizza = pizza))
    return jsonify({"success": True})

#UPDATE PIZZA
@app.route("/update_pizza", methods=["POST"])
def update_pizza():
    pizza_id = request.json["id"]
    pizza = request.json["pizza"]
    if pizza_id is None or pizza is None:
        return jsonify({"success": False, "error": "No pizza id or pizza provided"})
    execute_query(query = queries.update_pizza(pizza_id = pizza_id, pizza = pizza))
    return jsonify({"success": True})

#DELETE PIZZA
@app.route("/delete_pizza", methods=["POST"])
def delete_pizza():
    pizza_id = request.json["id"]
    if pizza_id is None:
        return jsonify({"success": False, "error": "No pizza id provided"})
    execute_query(query = queries.delete_pizza(pizza_id = pizza_id))
    return jsonify({"success": True})

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port = 5001, url_scheme = "https")