from flask import Flask, request, jsonify
from flask_cors import CORS
from database_manager import execute_query
import queries

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

################
# CONSTANTS
################
APP_NAME = "PIZZA MANAGER API"
APP_VERSION = "1.0.0"

################
# API ENDPOINTS
################
@app.route("/login", methods=["POST"])
def login():
    try:
        username = request.json["username"]
        password = request.json["password"]
        if username == "admin" and password == "admin":
            return jsonify({"success": True, "userType": "storeOwner"})
        elif username == "user" and password == "user":
            return jsonify({"success": True, "userType": "chef"})
        return jsonify({"success": False, "error": "Invalid credentials"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#GET TOPPINGS
@app.route("/get_toppings", methods=["GET"])
def get_toppings():
    try:
        toppings = execute_query(queries.get_toppings())
        if toppings is None:
            return jsonify({"success": False, "error": "Error getting toppings"})
        toppings_list = [
            {"id": topping[0], "name": topping[1], "price": topping[2]} for topping in toppings
        ]
        return jsonify({"success": True, "toppings": toppings_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#GET TOPPING
@app.route("/get_topping", methods=["GET"])
def get_topping():
    try:
        topping_id = request.json["id"]
        if topping_id is None:
            return jsonify({"success": False, "error": "No topping id provided"})
        topping = execute_query(queries.get_topping(topping_id = topping_id))
        return jsonify({"success": True, "topping": {"id": topping[0], "name": topping[1], "price": topping[2]}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#CREATE TOPPING
@app.route("/create_topping", methods=["POST"])
def create_topping():
    try:
        topping = request.json["topping"]
        if topping is None:
            return jsonify({"success": False, "error": "No topping provided"})
        topping_id = execute_query(queries.create_topping(topping = topping))
        if topping_id:
            topping_id = topping_id[0][0]
            return jsonify({"success": True, "id": topping_id})
        return jsonify({"success": False, "error": "Error creating topping"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#UPDATE TOPPING
@app.route("/update_topping", methods=["PUT"])
def update_topping():
    try:
        topping_id = request.json["id"]
        topping = request.json["topping"]
        if topping_id is None or topping is None:
            return jsonify({"success": False, "error": "No topping id or topping provided"})
        execute_query(queries.update_topping(topping_id = topping_id, topping = topping))
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#DELETE TOPPING
@app.route("/delete_topping", methods=["DELETE"])
def delete_topping():
    try:
        topping_id = request.json["id"]
        if topping_id is None:
            return jsonify({"success": False, "error": "No topping id provided"})
        execute_query(queries.delete_topping(topping_id = topping_id))
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#GET PIZZAS
@app.route("/get_pizzas", methods=["GET"])
def get_pizzas():
    try:
        pizzas = execute_query(queries.get_pizzas())
        if pizzas is None:
            return jsonify({"success": False, "error": "Error getting pizzas"})
        pizzas_list = [
            {"id": pizza[0], "name": pizza[1], "price": pizza[2], "toppings": pizza[3]} for pizza in pizzas
        ]
        return jsonify({"success": True, "pizzas": pizzas_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#GET PIZZA
@app.route("/get_pizza", methods=["GET"])
def get_pizza():
    try:
        pizza_id = request.json["id"]
        if pizza_id is None:
            return jsonify({"success": False, "error": "No pizza id provided"})
        pizza = execute_query(queries.get_pizza(pizza_id = pizza_id))
        return jsonify({"success": True, "pizza": {"id": pizza[0], "name": pizza[1], "price": pizza[2], "toppings": pizza[3]}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#CREATE PIZZA
@app.route("/create_pizza", methods=["POST"])
def create_pizza():
    try:
        pizza = request.json["pizza"]
        if pizza is None:
            return jsonify({"success": False, "error": "No pizza provided"})
        pizza_id = execute_query(queries.create_pizza(pizza = pizza)) #GET NEWLY ASSIGNED ID
        if pizza_id:
            pizza_id = pizza_id[0][0]
            return jsonify({"success": True, "id": pizza_id}) #RETURN NEWLY ASSIGNED ID
        return jsonify({"success": False, "error": "Error creating pizza"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#UPDATE PIZZA
@app.route("/update_pizza", methods=["PUT"])
def update_pizza():
    try:
        pizza_id = request.json["id"]
        pizza = request.json["pizza"]
        if pizza_id is None or pizza is None:
            return jsonify({"success": False, "error": "No pizza id or pizza provided"})
        execute_query(queries.update_pizza(pizza_id = pizza_id, pizza = pizza))
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#DELETE PIZZA
@app.route("/delete_pizza", methods=["DELETE"])
def delete_pizza():
    try:
        pizza_id = request.json["id"]
        if pizza_id is None:
            return jsonify({"success": False, "error": "No pizza id provided"})
        execute_query(queries.delete_pizza(pizza_id = pizza_id))
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port = 5000, url_scheme = "https") #SERVE THE APP USING WAITRESS