# Part 3 Project

## Run development

1. Start the Django development server (in Pipenv):
   ```sh
   cd django
   python -m manage runserver
   ```
2. Start the Vite development server:
   ```sh
   cd react
   npm start
   ```

## Run `local-web-server`

### Setup

1. Install `local-web-server`:
   ```sh
   npm install -g local-web-server
   ```
2. Build the React app:
   ```sh
   cd react
   npm run build
   ```

### Run

1. Start the Django server (see above)
2. Run in the root of this repository with:
   ```sh
   ws --config-file lws.config.js
   ```
