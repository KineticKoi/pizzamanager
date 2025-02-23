
#POSTGRESQL DATABASE MANAGER
#This file contains the functions to manage the persistent database.
import psycopg2
import psycopg2.extras
from databasedefinition import get_database_definition

################################
#GLOBAL VARIABLES
################################
database_definition = get_database_definition()

################################
#DATABASE SCHEMA MANAGEMENT
################################
def get_database_connection(database_name: str):
	#USER CREDENTIALS (THESE WOULD NORMALLY BE IN A .ENV FILE)
	user = {
		"username": "postgres",
		"password": "password",
	}
	try:
		#CONNECT
		return psycopg2.connect(
            host = "localhost", 
            user = user["username"], 
            password = user["password"], 
            dbname = database_name
        )
	except psycopg2.Error as e:
		print(f"Error connecting to database - {str(e)}")
		return -1

def execute_query(query_and_values: tuple = (), database_name: str = "pizzamanager"):
	try:
		query, values = query_and_values
		conn = get_database_connection(database_name)
		if conn is None:
			return
		conn.autocommit = True
		cursor = conn.cursor(cursor_factory = psycopg2.extras.DictCursor)

		if query.strip().upper().startswith("SELECT") or "RETURNING" in query.strip().upper():
			cursor.execute(query, values)
			results = cursor.fetchall()
			cursor.close()
			conn.close()
			return results
		
		else:
			cursor.execute(query, values)
			cursor.close()
			conn.close()
			return None

	except psycopg2.Error as e:
		print(f"Error executing query: {str(e)}")
		conn.rollback()
		return None

#CREATE DATABASE
def create_database():
	try:
		conn = get_database_connection("postgres") #GET CONNECTION
		if conn is None:
			return
		conn.autocommit = True #SET AUTOCOMMIT
		cursor = conn.cursor() #GET CURSOR

		#CHECK IF DATABASE EXISTS
		cursor.execute(f"""
			SELECT 1 FROM pg_catalog.pg_database 
			WHERE datname = '{database_definition['database_name']}'
		""")
		exists = cursor.fetchone()

		if not exists: #IF DATABASE DOES NOT EXIST
			cursor.execute(f"CREATE DATABASE {database_definition['database_name']}") #CREATE DATABASE

		cursor.close() #CLOSE CURSOR
		conn.close() #CLOSE CONNECTION

	except psycopg2.Error as e:
		print(f"Error creating database - {str(e)}")

#CREATE TABLES
def create_tables(database_name: str):
	try:
		conn = get_database_connection(database_name)
		if conn is None:
			return
		conn.autocommit = True
		cursor = conn.cursor()

		for table_name, table_definition in database_definition["tables"].items():
			#CHECK IF TABLE EXISTS
			cursor.execute(f"""
				SELECT EXISTS (
					SELECT 1 FROM information_schema.tables
					WHERE table_name = '{table_name}'
				);
			""")
			table_exists = cursor.fetchone()[0]

			if not table_exists:
				column_definitions = ", ".join(
					[f"{col} {col_type}" for col, col_type in table_definition["columns"].items()]
				)
				cursor.execute(f"CREATE TABLE {table_name} ({column_definitions});")
			
			else:
				#IF THE TABLE EXISTS, CREATE COLUMNS
				create_columns(cursor, table_name, table_definition["columns"])

		cursor.close()
		conn.close()

	except psycopg2.Error as e:
		print(f"Error creating tables: {str(e)}")

#CREATE COLUMNS
def create_columns(cursor, table_name: str, columns: dict):
	try:
		for column, column_type in columns.items():
			cursor.execute(f"""
				SELECT 1 FROM information_schema.columns
				WHERE table_name = '{table_name}' AND column_name = '{column}';
			""")
			column_exists = cursor.fetchone()

			if not column_exists:
				cursor.execute(f"""
					ALTER TABLE {table_name} ADD COLUMN {column} {column_type};
				""")
	except psycopg2.Error as e:
		print(f"Error creating columns in table {table_name}: {str(e)}")

################################
#DATABASE SETUP
################################
def build_postgresql():
	create_database() #CREATE DATABASE
	create_tables(database_definition["database_name"]) #CREATE TABLES
	print("Database setup completed.")

if __name__ == "__main__":
	print("Do you want to:")
	print("1. Build PostgreSQL database")
	print("2. Delete PostgreSQL database")
	print("3. Exit")
	choice = None
	while choice not in ["1", "2"]:
		choice = input("Enter choice: ")
	if choice == "1":
		build_postgresql() #BUILD POSTGRESQL DATABASE
	elif choice == "2":
		choice = None
		while choice not in ["Y", "N", "y", "n"]:
			choice = input("Are you sure you want to delete the database? (Y/N): ")
			if choice == "Y" or choice == "y":
				execute_query("DROP DATABASE pizzamanager", "postgres")
				print("Database cleared.")
			else:
				print("Database not cleared.")
	else:
		print("Exiting.")
		