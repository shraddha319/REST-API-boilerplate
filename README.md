# REST API Boilerplate

A boilerplate for building RESTful APIs using Node.js, Express and Mongoose.

## Features

- **Error Handling**: centralized error handling mechanism
- **Authentication and Authorization**: using [JWT](https://jwt.io)
- **NoSQL database**: uses [MongoDB](https://www.mongodb.com). Object Data Modeling and request data validation using [Mongoose](https://mongoosejs.com)
- **Testing**: unit tests using [Jest](https://jestjs.io)
- **CORS**: Cross-Origin Resource Sharing enabled using [cors](https://github.com/expressjs/cors)
- **API Documentation**: using [Swagger UI express](https://github.com/scottie1984/swagger-ui-express)
- **Environment Variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Dependency Management**: using [npm](https://www.npmjs.com)
- **Linting**: using [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Quick Start

Get started with the below steps:

1. Clone the repo:

```bash
git clone https://github.com/shraddha319/REST-API-boilerplate.git
cd REST-API-boilerplate
```

2. Install the dependencies

```bash
npm install
```

3. Set the environment variables

```bash
cp .env.example .env

# modify the environment variables in .env if required
```

## Environment Varibles

The environment variables can be found and modified in the .env file.

## Commands

The following commands can be found under `scripts` in `package.json`.

Run locally:

```bash
npm run dev
```

Run in production:

```bash
npm run start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run test:coverage
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix
```

## API Documentation

API documentation is done with the help of Swagger UI express package. Run the server and go to the `/docs` route on your browser. The `src/docs` folder contains swagger config and all the schema and route specifications.

### API Endpoints

List of available endpoints:

#### Auth routes:

#### User routes:

`POST /users` - create a user

## License

[MIT](LICENSE)
