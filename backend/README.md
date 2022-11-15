## Installation

```bash
$ yarn install
```
```
$ docker compose up -d --build
```
```
$ yarn prisma:migrate
$ yarn prisma:generate
$ yarn prisma:db:seed
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```