# Environment variables

## Setup

Create a .env file (no characters before the **.**) in the **root** folder of the API.

The syntax in .env files is easy.

```env

    # This is a comment that describes the below variable.

    foo = bar

    # All variables are stored/sent as strings
```

## Required environment variables

- SECRET_KEY
  - The secret key that the API users to hash passwords
- MONGO_URI
  - The MongoDB URI/URL that's nececary to connect to the database
- DB_NAME
  - The name of the database (The name in the end string of the MongoDB URI, can look like mongodb://localhost:27017/**GROCERY-TEST**)

## Optional variables

- PORT
  - Set's the port that the API uses. Will default to 3000
- SALT_ROUNDS
  - How many salt rounds to use when hashing passwords

Last updated: 19/08/2020
