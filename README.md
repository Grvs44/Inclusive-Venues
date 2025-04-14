# Part 3 Project

## Import data

You can import venue and rating data with the `addvenuedata` command
(`python -m manage addvenuedata` in the `django` directory).

Venue and rating data must be JSON files.
Below are the formats of the JSON files given as TypeScript types.

`venues.json`:

```typescript
{
  name: string;
  subcategories: {
    name: string;
    venues: {
      name: string;
      description: string;
      longitude: number;
      latitude: number;
      address: string;
      images: {
        order: number;
        alt: string;
        src: string;
      }
      [];
    }
    [];
  }
  [];
}
[];
```

`ratings.json`:

```typescript
{
  name: string;
  description: string;
}
[];
```

## Run

### Development

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

### Mock Production

#### Setup

1. Install `local-web-server`:
   ```sh
   npm install -g local-web-server
   ```
2. Build the React app:
   ```sh
   cd react
   npm run build
   ```

#### Run

1. Start the Django server (see above)
2. Run in the root of this repository with:
   ```sh
   ws --config-file lws.config.js
   ```
