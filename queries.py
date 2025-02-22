#Description: This file contains all the queries that are used in the application.

def get_pizzas():
    return "SELECT * FROM pizzas"

def get_pizza(pizza_id):
    return f"SELECT * FROM pizzas WHERE id = {pizza_id}"

def create_pizza(pizza):
    return f"INSERT INTO pizzas (name, price, toppings) VALUES ('{pizza['name']}', {pizza['price']}, ARRAY{pizza['toppings']}) RETURNING id"

def update_pizza(pizza_id, pizza):
    return f"UPDATE pizzas SET name = '{pizza['name']}', price = {pizza['price']}, toppings = ARRAY{pizza['toppings']} WHERE id = {pizza_id}"

def delete_pizza(pizza_id):
    return f"DELETE FROM pizzas WHERE id = {pizza_id}"

def get_toppings():
    return "SELECT * FROM toppings"

def get_topping(topping_id):
    return f"SELECT * FROM toppings WHERE id = {topping_id}"

def create_topping(topping):
    return f"INSERT INTO toppings (name, price) VALUES ('{topping['name']}', {topping['price']})"

def update_topping(topping_id, topping):
    return f"UPDATE toppings SET name = '{topping['name']}', price = {topping['price']} WHERE id = {topping_id}"

def delete_topping(topping_id):
    return f"DELETE FROM toppings WHERE id = {topping_id}"

def delete_all_pizzas():
    return "DELETE FROM pizzas"

def delete_all_toppings():
    return "DELETE FROM toppings"