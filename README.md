# pizzamanager

## TESTER NOTES:
- User username: storeOwner, password: storeOwner
- User username: chef, password: chef

This application is deployed on AWS EC2 and can be accessed at the following URL: http://3.149.249.254:3000
The Flask API is running on port 5000 over http.
Deployment of the frontend is still in progress.

## Description
This is a simple pizza manager application that allows users to create, read, update, and delete pizza orders. The application is built using the following stack:
- Frontend: React (Next.js)
- Backend: Flask (Python)
- Database: PostgreSQL

## Features
- Login as one of the following user types:
  - Store Owner: can create, read, update, and delete pizza toppings
  - Chef: can create, read, update, and delete pizzas 

- Duplicate entries are not allowed for toppings and pizzas. User feedback for this case is implemented.
- The application is responsive and can be used on many devices.

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
1. Navigate to http://localhost:3000 in your browser to view the application locally.

## Thought Process and Improvements
For this app I thought it would be best to use technology that is "mainstream" and also tailored to what StrongMind looked for in their requirements. A typical full-stack would use a modern framework for the frontend (React, Angular, Vue), a backend that can handle requests and serve data (Flask, Django, Express), and a database to store data (PostgreSQL, MySQL, MongoDB). 

I chose to use React for the frontend because it is the most popular framework that is easy to use and has a large community with resources. It is also simple to create mobile-friendly applications with React as well quickly test and deploy.

I chose Flask for the backend because it is a lightweight framework that is easy to use and has a lot of built-in functionality. This also fits the "Python preferred" experience that StrongMind is seeking. I have a few years of experience in Flask and have used it in many projects so that helped save time.

For the database, I chose PostgreSQL. It is a popular relational database that is easy to use and has a lot of built-in functionality. It also has an easy-to-use Python library for interactions that I have a lot of experience with. 

As for deployment, I chose AWS (EC2 for persistence) since I have significant experience using it at Fox Corporation.

My thought process and workflow started with designing the database schema and automating its creation in Python (this makes deployment easy later). I then created a simple SQL controller (wrapper for psycopg2) to interact with the database alongside a query wrapper library for CRUD functions. Next, I created a small test suite to test the database functionality. This marked the end of database development.

Second, I created the API using Flask (this interacts with the SQL controller created previously).

I then created the frontend using React and tested it using the browser and browser tools. Testing was very short since the backend was verified to be working (unit testing). I skipped creating a selenium test suite since the application is simple and I had limited time.

I then deployed the application on AWS EC2 and tested it using the browser and browser tools.

Documentation was created as I went along to make it easier for others to understand the code and how to run the application. Comments were also added throughout the code and the actual code was written in a way that is easy to read and understand.

Some improvements that could be made to the application (if I continued developing) are:
- Implementing a more secure login system (JWT, OAuth)
- Environment variables for sensitive information
- A more robust error handling system
- A more robust testing suite
- A more robust logging system
- Data encryption for API requests
- Coloring the UI to make it more visually appealing and accessible...