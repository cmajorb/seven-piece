# Seven Piece

## Getting started:

To get started right away, download and use Docker to run all required components (https://docs.docker.com/get-docker).


Once Docker is up and running use the following command in the root directory:
```
docker compose up --build -d
```

Then, navigate to localhost to access the game.

## Django and Docker

In order to migrate, use the following command:
```
docker compose run web python sevenpiece/manage.py migrate
```

For a data dump, use the following:
```
docker exec seven-piece-db-1 /usr/bin/mysqldump -u root --password=sevenpiece123 sevenpiece > dump.sql
```

To reload the database run the following:
```
docker compose down
docker compose up --build -d
docker compose run web python sevenpiece/manage.py migrate
docker compose run web python sevenpiece/manage.py shell
exec(open('/sevenpiece/game/helpers.py').read())
```

## Testing

Use the following command to run tests:
```
docker compose run web python sevenpiece/manage.py test game
```

## Front End

Use the following to start the frontend:

```
npm run start
```

## Environment Variables

You need to have the following environment variables:

- ./.env
    - MYSQL_ROOT_PASSWORD=sevenpiece123
- ./django/sevenpiece/sevenpiece/.env
    - MYSQL_ROOT_PASSWORD=sevenpiece123
    - DATABASE_HOST=db
    - REDIS_HOST=redis
    - REDIS_PORT=6379
    - BASE_URL=http://localhost
- ./frontend/.env
    - REACT_APP_DJANGO_URL=localhost:8080

## Activate venv

source 7p/bin/activate