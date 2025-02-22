import unittest
import queries
from database_manager import execute_query

class TestDatabase(unittest.TestCase):
    def setUp(self):
        #GUARANTEE CLEAN SLATE
        execute_query(query = queries.delete_all_toppings())
        execute_query(query = queries.delete_all_pizzas())
        execute_query(query = "SELECT setval('pizzas_id_seq', 1, false)") #RESET SEQUENCE

    def tearDown(self):
        #CLEAN UP
        execute_query(query = queries.delete_all_toppings())
        execute_query(query = queries.delete_all_pizzas())
        self.assertEqual(len(execute_query(query = queries.get_toppings())), 0)
        self.assertEqual(len(execute_query(query = queries.get_pizzas())), 0)

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
                "name": "Pepperoni",
                "price": 10.99,
                "toppings": [1]
            }
        ))
        #GET THE PIZZA
        pizzas = execute_query(query = queries.get_pizzas())
        self.assertEqual(len(pizzas), 1)

    def test_insert_multiple_topping_pizza(self):
        #INSERT MULTIPLE TOPPINGS
        execute_query(query = queries.create_topping(
            topping = {
                "name": "Pepperoni",
                "price": 1.99
            }
        ))
        execute_query(query = queries.create_topping(
            topping = {
                "name": "Sausage",
                "price": 0.99
            }
        ))
        #GET THE TOPPINGS
        toppings = execute_query(query = queries.get_toppings())
        self.assertEqual(len(toppings), 2)

        #INSERT A PIZZA USING THE ABOVE TOPPINGS
        execute_query(query = queries.create_pizza(
            pizza = {
                "name": "Meat Lovers",
                "price": 12.99,
                "toppings": [1, 2]
            }
        ))
        #GET THE PIZZA
        pizzas = execute_query(query = queries.get_pizzas())
        self.assertEqual(len(pizzas), 1)

    def test_update_pizza(self):
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

        #INSERT A PIZZA USING THE ABOVE TOPPINGS
        execute_query(query = queries.create_pizza(
            pizza = {
                "name": "Meat Lovers",
                "price": 12.99,
                "toppings": [1, 2]
            }
        ))
        #GET THE PIZZA
        pizzas = execute_query(query = queries.get_pizzas())
        self.assertEqual(len(pizzas), 1)

        #UPDATE THE PIZZA
        execute_query(query = queries.update_pizza(
            pizza_id = 1,
            pizza = {
                "name": "Meat Lovers",
                "price": 15.99,
                "toppings": [1]
            }
        ))
        #GET THE PIZZA
        pizzas = execute_query(query = queries.get_pizzas())
        self.assertEqual(len(pizzas), 1)
        self.assertEqual(float(pizzas[0]["price"]), 15.99)

if __name__ == '__main__':
    unittest.main()