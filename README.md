# Inclusive Venues

Inclusive Venues is a Progressive Web App I made as part of my third-year dissertation which lets users leave reviews for places they've been based on inclusivity and safety.

The ratings for each venue are combined into a score which shows how inclusive each venue is and helps other people decide on which venues to visit.

The two main perspectives I explored in my dissertation were: for people, helping others find places to go; for venue stakeholders/organisations, improving their inclusivity in order to encourage more people to visit them.

As well as leaving reviews, anyone can add venues, so there is no limit to which venues can be reviewed.

User-centred design was an important part of this project, with the rating criteria and usability feedback gathered from a survey and focus group to help create an application that works for everyone.

[View the version submitted for my dissertation here](https://github.com/Grvs44/Inclusive-Venues/tree/v1.0.0)

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

## Test

In the `django` directory, run:

```sh
python -m manage test --settings tests.settings
```
