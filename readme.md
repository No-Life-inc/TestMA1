# REPO TEMPLATE

## Contributors

- Morten Bendeke
- Betül Iskender
- Yelong Hartl-He
- Zack Ottesen

## General Use

### What are the main use cases for the project? <br>
This code generates fake data of nonexisting Danish persons.

## Dependencies

- first name, last name and gender are extracted from the file `data/person-names.json`.
- postal code and town are extracted from the MySQL database `address`

## Environment Variables

Create a `.env` in the `root` folder, in the `db` folder and in the `backend` folder

For local development using Nodemon, DB_HOST must be `localhost`.<br>
For development in Docker, DB_HOST must be `mysql-db`
<br>
comment either out. 

- DB_PASSWORD=YourStrongPassword123
- DB_NAME=testMA1
- DB_USER=fakeUser
- BACKEND_PORT=5000
- DB_HOST=localhost
- #DB_HOST=mysql-db
- MYSQL_ROOT_PASSWORD=RootPassword123

## How To Run

Make sure the environment variables are set.<br>
After successful connection to DB, run the migration and seed files to create the tables and inserting data. <br>

Open a new terminal in the db folder. <br>

Lastly, use the following command:

```bash
run npx knex migrate:latest
run npx seed:run
```
## API Endpoints

| Method | Endpoint           | Description                                                    |
|--------|--------------------|----------------------------------------------------------------|
| GET    | /cpr               | Returns a random CPR number                                    |
| GET    | /person            | Returns a random person with first name and gender             |
| GET    | /person-dob        | Returns a random person with first name, gender, and birthdate |
| GET    | /person-cpr        | Returns a random person with first name, gender, and CPR       |
| GET    | /person-cpr-dob    | Returns a random person with first name, gender, CPR, and birthdate |
| GET    | /address           | Returns a random address                                       |
| GET    | /phone             | Returns a random phone number                                  |
| GET    | /person-full       | Returns all information for a random person                    |
| GET    | /bulk/:count       | Returns information for multiple people (2-100)                |


