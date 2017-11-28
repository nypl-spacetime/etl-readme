# generate-etl-readme

Node.js module to generate Markdown README files for [NYC Space/Time Directory](http://spacetime.nypl.org/)’s ETL modules.

## Examples

- https://github.com/nypl-spacetime/etl-mapwarper
- https://github.com/nypl-spacetime/etl-building-inspector
- https://github.com/nypl-spacetime/etl-spacetime-graph
- https://github.com/nypl-spacetime/etl-group-maps

## Usage

First, install `generate-etl-readme` as dependency:

    npm install --save-dev spacetime-generate-etl-readme

Then, the following line to the `scripts` section of the ETL script’s `package.json`:

```js
"scripts": {
  ...
  "readme": "spacetime-generate-etl-readme -o README.md ./"
}
```

Generate a new `README.md` by running:

    npm run readme

## Including extra, module-specific content to a README file

To include extra content in the generated `README.md` file, add this content to `<datasetId>.md` in the module's directory.

## See also

- [NYC Space/Time Directory ETL tool](https://github.com/nypl-spacetime/spacetime-etl)
