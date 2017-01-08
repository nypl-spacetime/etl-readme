# generate-etl-readme

Generates README markdown files for Space/Time ETL scripts.

## Usage

First, install `generate-etl-readme` as dependency:

    npm install --save-dev spacetime-generate-etl-readme

Then, the following line to the `scripts` section of the ETL script's `package.json:

```js
  "scripts": {
    ...
    "readme": "spacetime-generate-etl-readme ./ -o README.md"
  }
```

Generate a new `README.md` by running:

    npm run readme
