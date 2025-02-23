# pizzamanager

## Description
This is a simple pizza manager application that allows users to create, read, update, and delete pizza orders. The application is built using the following stack:
- Frontend: React (Next.js)
- Backend: Flask (Python)
- Database: PostgreSQL

This application is deployed on AWS EC2 and can be accessed at the following user and URL: ec2-user@18.119.126.34 using the private key (not provided here).
The Flask API is running on port 5000 over https.
Deployment of the frontend is still in progress.

## Local Setup
1. Clone the repository:
2. Install Python (backend) dependencies:
```pip3 install flask flask-cors waitress psycopg2-binary```
3. Install Node.js (frontend) dependencies:
```sudo yum install -y nodejs``` and ```npm install```
4. Install PostgreSQL:
```sudo dnf install postgresql15.x86_64 postgresql15-server -y```
5. Start the PostgreSQL service:
```sudo systemctl start postgresql-15``` and ```sudo systemctl enable postgresql-15```
6. Create a new database user:
```sudo -u postgres createuser -s your_username```
7. Create a new database:
```sudo -u postgres createdb your_database_name```
8. Update user credentials
```sudo -u postgres psql -c "ALTER USER your_username WITH PASSWORD 'your_password';"```
9. Update the database connection string in the database_manager.py file (would be better to use environment variables)

## Generate the Database Schema
1. Run the following command to generate the database schema:
```python3 database_manager.py``` and follow the prompts.

## Test the Database
1. Run the following command to test the database:
```python3 database_test_suite.py```

## Run the API
1. Run the following command to start the API:
```python3 api.py```

## Run the Frontend
1. Run the following command to start the frontend:
```npm run dev```

## Usage
1. Navigate to http://localhost:3000 in your browser to view the application.

More detailed instructions coming soon...