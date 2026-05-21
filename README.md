# InsideFactory

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

# API

This project uses Hono.js for the backend. 

## How to start the API

Before starting make sure to:
1. fill in the entries of .env.example and change the name to just .env
2. generate a prisma client by running:
```bash
npx prisma db push
npx prisma generate
```
After that open another terminal tab and run 
```bash
npx tsx server.ts
```

NOTE: on first startup, if insider trades are not showing go to following URL: [http](http://localhost:3000/insiderTrades)

Security metigations:
T5 (threat 5) -> Malicious Scraped Data Injection

The application gets data from external websites, this data can be manipulated or contain scripts (for XSS). As mitigation in scrapeDataValidatior.ts (currently for openInsider only since there is database storing present there) we added validation and sanization. Data gets validated before it gets saved in the database.

in scrapeDataValidator.ts:
isValidTransaction() validates the input
sanitizeString() removes potential dangerous characters.
As a result potentional dangerous data does not get saved in the database.
