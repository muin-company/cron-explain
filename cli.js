#!/usr/bin/env node

const { convert, parseCronExpression, naturalLanguageToCron, PRESETS } = require('./cron-parser.js');

const args = process.argv.slice(2);

// Help text
const HELP = `cron-explain - Convert between cron expressions and natural language

Usage:
  cron-explain "0 5 * * 1"              Convert cron to natural language
  cron-explain "every Monday at 5am"    Convert natural language to cron
  cron-explain --examples               Show common examples
  cron-explain --help                   Show this help

Examples:
  cron-explain "*/15 * * * *"
  cron-explain "every 15 minutes"
  cron-explain "0 0 * * 0"
  cron-explain "@daily"
`;

const EXAMPLES = `Common Cron Patterns:

Every minute:        * * * * *
Every 15 minutes:    */15 * * * *
Every hour:          0 * * * *
Every day at noon:   0 12 * * *
Every Monday at 5am: 0 5 * * 1
Every weekday:       0 9 * * 1-5
First of month:      0 0 1 * *

Presets:
@hourly    ->  ${PRESETS['@hourly']}
@daily     ->  ${PRESETS['@daily']}
@weekly    ->  ${PRESETS['@weekly']}
@monthly   ->  ${PRESETS['@monthly']}
@yearly    ->  ${PRESETS['@yearly']}
`;

// Main
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}

if (args.includes('--examples') || args.includes('-e')) {
  console.log(EXAMPLES);
  process.exit(0);
}

const input = args.join(' ');

try {
  const result = convert(input);
  
  if (result.type === 'cron-to-natural') {
    console.log(`Input:  ${result.input}`);
    console.log(`Output: ${result.output}`);
  } else {
    console.log(`Input:  ${result.input}`);
    console.log(`Cron:   ${result.output}`);
    // Also show what it means
    const explanation = parseCronExpression(result.output);
    console.log(`Means:  ${explanation}`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
