#Description: This file contains all the queries that are used in the application.

#INSERT INTO toppings (name, price) VALUES ('Pepperoni', 1.99) #DUMMY DATA
#INSERT INTO pizzas (name, price, toppings) VALUES ('Meat Lovers', 12.99, ARRAY[1]) #DUMMY DATA

def get_pizzas():
    return "SELECT * FROM pizzas", ()

def get_pizza(pizza_id):
    return "SELECT * FROM pizzas WHERE id = %s", (pizza_id,)

def create_pizza(pizza):
    return "INSERT INTO pizzas (name, price, toppings) VALUES (%s, %s, %s) RETURNING id", (pizza['name'], pizza['price'], pizza['toppings'])

def update_pizza(pizza_id, pizza):
    return "UPDATE pizzas SET name = %s, price = %s, toppings = %sWHERE id = %s", (pizza['name'], pizza['price'], pizza['toppings'], pizza_id)

def delete_pizza(pizza_id):
    return "DELETE FROM pizzas WHERE id = %s", (pizza_id,)

def get_toppings():
    return "SELECT * FROM toppings", ()

def get_topping(topping_id):
    return "SELECT * FROM toppings WHERE id = %s", (topping_id,)

def create_topping(topping):
    return "INSERT INTO toppings (name, price) VALUES (%s, %s)", (topping['name'], topping['price'])

def update_topping(topping_id, topping):
    return "UPDATE toppings SET name = %s, price = %s WHERE id = %s", (topping['name'], topping['price'], topping_id)

def delete_topping(topping_id):
    return "DELETE FROM toppings WHERE id = %s", (topping_id,)

def delete_all_pizzas():
    return "DELETE FROM pizzas", ()

def delete_all_toppings():
    return "DELETE FROM toppings", ()
