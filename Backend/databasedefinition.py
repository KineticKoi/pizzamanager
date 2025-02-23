#POSTGRESQL DATABASE DEFINITION
#This file contains the definition of the database that will be used in the application.
__database_definition = {
    "database_name": "pizzamanager",
    "tables": {
        "toppings": {
            "columns": {
                "id": "SERIAL PRIMARY KEY",
                "name": "VARCHAR(50) UNIQUE NOT NULL",
                "price": "DECIMAL(10,2)"
            }
        },
        "pizzas": {
            "columns": {
                "id": "SERIAL PRIMARY KEY",
                "name": "VARCHAR(50) UNIQUE NOT NULL",
                "price": "DECIMAL(10,2)",
                "toppings": "INTEGER[]"
            }
        },
    }
}

def get_database_definition():
    return __database_definition #RETURN DATABASE DEFINITION