# Dify Backend API

## Usage

1. Start the docker-compose stack

   The backend require some middleware, including PostgreSQL, Redis, and Weaviate, which can be started together using `docker-compose`.

   ```bash
   cd ../docker
   cp middleware.env.example middleware.env
   # change the profile to other vector database if you are not using weaviate
   docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify up -d
   cd ../api
   ```

2. Copy `.env.example` to `.env`
3. Generate a `SECRET_KEY` in the `.env` file.

   ```bash for Linux
   sed -i "/^SECRET_KEY=/c\SECRET_KEY=$(openssl rand -base64 42)" .env
   ```

   ```bash for Mac
   secret_key=$(openssl rand -base64 42)
   sed -i '' "/^SECRET_KEY=/c\\
   SECRET_KEY=${secret_key}" .env
   ```

4. Prepare Python environment

   Dify API services requires Python 3.11 or 3.12, and the [Poetry](https://python-poetry.org/docs/) for dependency management.
    - To install Poetry, please refer to
      the [Poetry's installation guide](https://python-poetry.org/docs/#installation). The simplest way is to run the `pip install poetry` command to install Poetry on pip.
    - Run `poetry env use 3.12` to switch to the Python version for Poetry, please refer the usage of `poetry env use`
      command in [Poetry docs](https://python-poetry.org/docs/managing-environments/#switching-between-environments).
    - Run `poetry shell` to activate the shell environment with Poetry support.

5. Install dependencies

   ```bash
   cd api
   poetry env use 3.12
   poetry install
   ```

6. Run db migration

   Before the first launch, migrate the database to the latest version.

   ```bash
   poetry run python -m flask db upgrade
   ```

7. Start api service

   ```bash
   poetry run python -m flask run --host 0.0.0.0 --port=5001 --debug
   ```

8. Start Dify [web](../web) service.

9. Setup your application by visiting `http://localhost:3000`...

10. Start the worker service, if you need to handle and debug the async tasks (e.g. dataset importing and documents
    indexing), please start the worker service.

   ```bash
   poetry run python -m celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail,ops_trace,app_deletion
   ```

## Testing

1. Install dependencies for both the backend and the test environment

   ```bash
   poetry install -C api --with dev
   ```

2. Run the tests locally with mocked system environment variables in `tool.pytest_env` section in `pyproject.toml`

   ```bash
   poetry run -C api bash dev/pytest/pytest_all_tests.sh
   ```


