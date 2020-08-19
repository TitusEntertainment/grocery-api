# Diffrent routes and endpoints

All the endpoints are set to got to https://domain.com/api/

`Please, note that we do not accept any HTTP traffic. Must be HTTPS`

And follow the strucutre /api/{category}/{operation}

So for an example to register a user you would send a POST request to /api/users/register

## Users

Endpoint: /api/users/

### Register

Request type: POST

Endpoint: /api/users/register

Required variables:

- name
  - STRING: This is the full name. Accepts any valid string.
- email
  - STRING: Accepts any vaild email address
- password
  - STRING: Accept any valid string with the length of at least 6 characters

JSON example:

```json
{
  "name": "John Doe",
  "email": "jdoe@example.com",
  "password": "MySecurePassword123"
}
```

### Login

Request type: POST

Endpoint: /api/users/login

Required variables:

- email
  - STRING: User's email address
- password
  - STRING: User's password

JSON example:

```json
{
  "email": "jdoe@example.com",
  "password": "MySecurePassword123"
}
```

## Lists

Endpoint: /api/lists/

### New

Request type: POST

Endpoint: /api/lists/new

Requierment: Must be logged in/have a valid session token

Required variables:

- listName
  - STRING: name of the list.

Optional variables:

- items
  - ARRAY of Objects: A list of grocery items
- invites
  - ARRAY of Strings: an array of strings of users to invite

JSON example:

```json
{
  "listName": "Test",
  "items": [
    {
      "name": "Garlic bread",
      "amount": 1
    },
    {
      "name": "Mustard",
      "amount": 3
    }
  ]
}
```
