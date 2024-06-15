<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

### Prerequirements 

- Create `.env` file.
- Copy The Template below and paste to do `.env` file.
```.env
JWT_SECRET=testcase
DB_DATABASE=sqlite.db
```

### Starting the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
 

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## End Points

### Auth

#### Login 

End point:

```
/auth/login
```
Method: `POST`
Body:
```json
{
  "email": "johndoe1324567890@gmail.com",
  "password": "password123"
}
```
- `email`: Required, must be an email, string.
- `password`: Required, minimum 8 character, maximum 32 character, string.
Response: 
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZTEzMjQ1Njc4OTBAZ21haWwuY29tIiwiaWF0IjoxNzE4NDgwMTE0LCJleHAiOjE3MTg0ODM3MTR9.GVwQ8xvbWdu25GXXUyhpIPqKq7nLvmrrSeqS2s5i0Vk"
}

```

#### Register
End point
```
/auth/register
```


Method: `POST`
Body:
```json
{
  "name": "bahri23",
  "surname": "bas",
  "email": "johndoe123@gmail.com",
  "password": "password123"
}

```
- `name`: Required, string.
- `surname`: Required, string.
- `email`: Required, must be an email, string and must be unique.
- `password`: Required, minimum 8 character, maximum 32 character, string.
Response: 
```json
{
    "email": "johndoe13245678910@gmail.com",
    "name": "bahri23",
    "surname": "bas",
    "id": 2,
    "balance": 1000
}

```

#### Profile
End point:
```
/auth/profile
```


Method: `GET`
Request Headers :
- `Authorization`: `Bearer JWT token from login`

Response: 
```json
{
    "id": 1,
    "name": "bahri23",
    "surname": "bas",
    "email": "johndoe1324567890@gmail.com",
    "balance": 580
}

```

### Orders


#### Create 

End point:

```
/orders
```



Method: `POST`

Request Headers :
- `Authorization`: `Bearer JWT token from login`

Body:
```json
{
  "name": "test",
  "amount":15,
  "services":[1,3]
  
}

```
- `name`: Required, string.
- `amount`: Required, larger than 0, number.
- `services`: Required, must be ids of services, list of number.

Response: 
```json
{
    "amount": 15,
    "createdBy": {
        "id": 1,
        "name": "bahri23",
        "surname": "bas",
        "email": "johndoe1324567890@gmail.com",
        "balance": 580
    },
    "services": [
        {
            "id": 1,
            "name": "Standard Shipping",
            "price": 5,
            "description": "Basic shipping service with average delivery time."
        },
        {
            "id": 3,
            "name": "Gift Wrapping",
            "price": 2,
            "description": "Special gift wrapping service for special occasions."
        }
    ],
    "id": 11
}

```

#### Get all

End point:
```
/orders
```



Method: `GET`

Request Headers :
- `Authorization`: `Bearer JWT token from login`

Response: 
```json
[
    {
        "id": 1,
        "amount": 150,
        "services": [],
        "createdBy": {
            "id": 1,
            "name": "bahri23",
            "surname": "bas",
            "email": "johndoe1324567890@gmail.com",
            "balance": 580
        }
    },
    {
        "id": 2,
        "amount": 150,
        "services": [
            {
                "id": 1,
                "name": "Standard Shipping",
                "price": 5,
                "description": "Basic shipping service with average delivery time."
            }
        ],
        "createdBy": {
            "id": 1,
            "name": "bahri23",
            "surname": "bas",
            "email": "johndoe1324567890@gmail.com",
            "balance": 580
        }
    }
]

```


### Services

#### Create

End point:
```
/services
```



Method: `POST`

Request Headers :
- `Authorization`: `Bearer JWT token from login`

Body:
```json
{
   "name": "Installation Service",
   "description": "Professional installation service for electronic devices.",
   "price": 30.00
}

```
- `name`: Required, string.
- `description`: Required,  string.
- `price`: Required, larger than 0, number.

Response: 
```json
{
    "description": "Professional installation service for electronic devices.",
    "name": "Installation Service",
    "price": 30,
    "id": 8
}

```

#### Get all

End point:

```
/services
```

Method: `GET`

Request Headers :
- `Authorization`: `Bearer JWT token from login`

Response: 
```json

[
    {
        "id": 1,
        "name": "Standard Shipping",
        "price": 5,
        "description": "Basic shipping service with average delivery time."
    },
    {
        "id": 2,
        "name": "Installation Service",
        "price": 30,
        "description": "Professional installation service for electronic devices."
    },
    {
        "id": 3,
        "name": "Gift Wrapping",
        "price": 2,
        "description": "Special gift wrapping service for special occasions."
    },
]

```
