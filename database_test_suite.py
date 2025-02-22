import unittest
import queries
from database_manager import execute_query

class TestDatabase(unittest.TestCase):
    def test_insert_single_topping_pizza(self):
        #INSERT A TOPPING
        execute_query(query = queries.create_topping(
            topping = {
                "name": "Pepperoni",
                "price": 1.99
            }
        ))
        #GET THE TOPPING
        toppings = execute_query(query = queries.get_toppings())
        self.assertEqual(len(toppings), 1)

        #INSERT A PIZZA USING THE ABOVE TOPPING
        execute_query(query = queries.create_pizza(
            pizza = {
                "name": "Hawaiian",
                "price": 10.99,
                "toppings": [1]
            }
        ))
        #GET THE PIZZA
        pizzas = execute_query(query = queries.get_pizzas())
        self.assertEqual(len(pizzas), 1)

        #CLEAN UP
        execute_query(query = queries.delete_topping(topping_id = 1))
        execute_query(query = queries.delete_pizza(pizza_id = 1)) 