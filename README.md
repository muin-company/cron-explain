# cron-explain

Convert cron expressions to natural language and vice versa. Works as a CLI tool and web interface.

## Features

- Bidirectional conversion (cron ↔ natural language)
- Auto-detects input type
- Handles complex patterns (ranges, steps, lists)
- Zero dependencies (CLI)
- Single-file web version

## CLI Usage

### Install

```bash
npm install -g cron-explain
```

Or run directly:

```bash
npx cron-explain "0 5 * * 1"
```

### Examples

```bash
# Cron to natural language
$ cron-explain "0 5 * * 1"
Input:  0 5 * * 1
Output: At 05:00 on Monday

$ cron-explain "*/15 * * * *"
Input:  */15 * * * *
Output: At every 15 minutes past every hour

# Natural language to cron
$ cron-explain "every Monday at 5am"
Input:  every Monday at 5am
Cron:   0 5 * * 1
Means:  At 05:00 on Monday

$ cron-explain "every 15 minutes"
Input:  every 15 minutes
Cron:   */15 * * * *
Means:  At every 15 minutes past every hour

# Presets
$ cron-explain "@daily"
Input:  @daily
Output: At 00:00
```

### Show examples

```bash
cron-explain --examples
```

## Web Interface

Open `index.html` in your browser or visit the hosted version.

Single HTML file - no build step, no dependencies. Just works.

## Common Patterns

| Cron Expression | Meaning |
|----------------|---------|
| `* * * * *` | Every minute |
| `*/15 * * * *` | Every 15 minutes |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * 1-5` | Every weekday at 9am |
| `0 5 * * 1` | Every Monday at 5am |
| `0 0 1 * *` | First day of every month |
| `0 0 1 1 *` | Every January 1st |
| `@hourly` | Every hour (preset) |
| `@daily` | Every day at midnight (preset) |

## Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, Sunday=0 or 7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

### Special Characters

- `*` - Any value
- `,` - List (1,3,5)
- `-` - Range (1-5)
- `/` - Step values (*/15)

### Presets

- `@yearly` or `@annually` - Once a year (0 0 1 1 *)
- `@monthly` - Once a month (0 0 1 * *)
- `@weekly` - Once a week (0 0 * * 0)
- `@daily` or `@midnight` - Once a day (0 0 * * *)
- `@hourly` - Once an hour (0 * * * *)

## API

```javascript
const { convert, parseCronExpression, naturalLanguageToCron } = require('cron-explain');

// Auto-detect and convert
const result = convert('0 5 * * 1');
console.log(result);
// {
//   type: 'cron-to-natural',
//   input: '0 5 * * 1',
//   output: 'At 05:00 on Monday'
// }

// Explicit conversion
const explanation = parseCronExpression('*/15 * * * *');
console.log(explanation); // "At every 15 minutes past every hour"

const cron = naturalLanguageToCron('every Monday at 5am');
console.log(cron); // "0 5 * * 1"
```

## Development

```bash
# Clone repo
git clone https://github.com/muinmomin/cron-explain
cd cron-explain

# Test CLI
node cli.js "0 5 * * 1"

# Open web interface
open index.html
```

## License

MIT

## Author

Muin Momin - https://muin.me
