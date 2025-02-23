# pizzamanager

## TESTER NOTES:
- User username: storeOwner, password: storeOwner
- User username: chef, password: chef

## Description
This is a simple pizza manager application that allows users to create, read, update, and delete pizza orders. The application is built using the following stack:
- Frontend: React (Next.js)
- Backend: Flask (Python)
- Database: PostgreSQL

## Features
- Login as one of the following user types:
  - Store Owner: can create, read, update, and delete pizza toppings
  - Chef: can create, read, update, and delete pizzas

This application is deployed on AWS EC2 and can be accessed at the following user and URL: ec2-user@18.119.126.34 using the private key (not provided here).
The Flask API is running on port 5000 over https.
Deployment of the frontend is still in progress.

## Local Setup
1. Clone the repository:
2. Install Python (backend) dependencies:
```pip3 install flask flask-cors waitress psycopg2-binary```
3. Install Node.js (frontend) dependencies:
```sudo yum install -y nodejs``` and ```npm install``` and ```npm install next```
4. Install PostgreSQL:
```sudo dnf install postgresql15.x86_64 postgresql15-server -y```
5. Initializa the PostgreSQL database:
```sudo postgresql-setup --initdb```
5. Start the PostgreSQL service:
```sudo systemctl start postgresql-15``` and ```sudo systemctl enable postgresql-15```
6. Create a new database user:
```sudo -u postgres createuser -s your_username```
7. Create a new database:
```sudo -u postgres createdb your_database_name```
8. Update user credentials
```sudo -u postgres psql -c "ALTER USER your_username WITH PASSWORD 'password';"``` (!IMPORTANT: use password 'password' for user postgres or update the database_manager.py file)
9. Update the database connection string in the database_manager.py file (would be better to use environment variables)

## Generate the Database Schema
1. Run the following command to generate the database schema:
```python3 database_manager.py``` and follow the prompts.

## Test the Database (Unit Tests)
1. Run the following command to test database_manager functionality after generating the schema:
```python3 database_test_suite.py```

## Run the API
1. Run the following command to start the API:
```cd pizzamanager/Backend```
```nohup python3 api.py``` (this will run the API in the background. You will have to manually kill it if you want to stop it)

## Run the Frontend
NOTE: If you are running the API locally you may need to flip devMode flags to true in the frontend code. They are located at the top of page.js files for each page.

1. Run the following commands to start the frontend:
```cd pizzamanager/React_Frontend/pizza-manager```

2. Run screen (if application is not containerized):
```screen -S my-session```
```npm install```
```npm run build``` or ```npm run start``` or ```npm run dev```
```Ctrl + A + D``` to detach from the screen session

## Usage
1. Navigate to http://localhost:3000 in your browser to view the application.

More detailed instructions coming soon...