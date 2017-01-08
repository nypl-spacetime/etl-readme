const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const R = require('ramda')

const etlPrefix = 'etl-'

if (!argv._[0]) {
  console.error(`Usage: spacetime-generate-etl-readme [-o file] /path/to/etl-script-dir/\n` +
      `  -o    output file. if not given, spacetime-generate-etl-readme uses stdout`)
  process.exit(1)
}

const dir = path.resolve(argv._[0])
const etlId = path.basename(dir).replace(etlPrefix, '')

let dataset
let script
try {
  dataset = require(path.join(dir, `${etlId}.dataset.json`))
  script = require(path.join(dir, etlId))
} catch (err) {
  console.error('Could not load ETL script:\n', err.message)
  process.exit(1)
}

const steps = script.steps.map((step) => step.name)

let data = ''
if (steps.indexOf('transform') > -1) {
  data = `
# Data

The dataset created by this ETL script's \`transform\` step can be found in the [data section of the NYC Space/Time Directory website](http://spacetime.nypl.org/#data-${dataset.id}).`
}

const defined = (val, key) => val !== undefined
let table = R.pickBy(defined, R.pick([
  'id',
  'title',
  'description',
  'license',
  'author',
  'website',
  'editor'
], dataset))

if (table.website) {
  table.website = `<a href="${table.website}">${table.website}</a>`
}

if (table.id) {
  table.id = `<code>${table.id}</code>`
}

const titles = {
  'id': 'ID',
  'title': 'Title',
  'description': 'Description',
  'license': 'License',
  'author': 'Author',
  'website': 'Website',
  'editor': 'Editor'
}

const titleize = (pair) => ([
  titles[pair[0]],
  pair[1]
])

const rows = R.toPairs(table).map(titleize).map((row) => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
    </tr>`)

const readme = `
# Space/Time ETL script: ${dataset.title}

[ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) script for NYPL's [NYC Space/Time Direcory](http://spacetime.nypl.org/).

## Details

<table>
  <tbody>
${rows.join('\n')}
  </tbody>
</table>

## Available steps

${steps.map((step) => `  - \`${step}\``).join('\n')}

## Usage

\`\`\`
git clone https://github.com/nypl-spacetime/etl-${dataset.id}.git /path/to/etl-scripts
cd /path/to/etl-scripts/etl-${dataset.id}
npm install

spacetime-etl ${dataset.id} [<step>]
\`\`\`

See http://github.com/nypl-spacetime/spacetime-etl for information about Space/Time's ETL tool. More Space/Time ETL scripts [can be found on GitHub](https://github.com/search?utf8=%E2%9C%93&q=org%3Anypl-spacetime+etl-&type=Repositories&ref=advsearch&l=&l=).
${data}
`

const output = readme.trim() + '\n'
if (argv.o) {
  fs.writeFileSync(argv.o, output)
} else {
  console.log(output)
}
