# cron-explain

Convert cron expressions to natural language and vice versa.

[![npm version](https://badge.fury.io/js/cron-explain.svg)](https://www.npmjs.com/package/cron-explain)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/muinmomin/cron-explain.svg?style=social)](https://github.com/muinmomin/cron-explain)

Works as a CLI tool and web interface. No dependencies, bidirectional conversion.

## Why use this?

**Before:**
```bash
# Setting up a cron job
You: "I need this to run every Monday at 5am"
Brain: "Uh... is that 0 5 * * 1 or 5 0 * * 1?"
*googles "cron syntax"*
*reads confusing docs*
*tries 5 0 * * 1*
*nothing runs*
*tries 0 5 * * 1*
*works!*
*3 hours wasted*
```

**After:**
```bash
$ cron-explain "every Monday at 5am"
Cron:   0 5 * * 1
Means:  At 05:00 on Monday
```

or

```bash
$ cron-explain "0 5 * * 1"
Output: At 05:00 on Monday
```

**Real problems:**
- Cron syntax is impossible to remember
- Reading cron expressions feels like decoding hieroglyphics
- One wrong number and your job runs 720 times instead of once
- Documentation is either too simple or too complex
- No way to verify "is this what I meant?"

`cron-explain` converts both ways instantly. Write what you mean in plain English, or decode what's already there.

## Installation

### CLI

```bash
npm install -g cron-explain
```

Or run directly:
```bash
npx cron-explain "0 5 * * 1"
```

### Web Interface

Open `index.html` in your browser. No build step, no dependencies. Or visit the hosted version at [cron-explain.com](#) (if deployed).

## CLI Usage

### Cron to English

```bash
$ cron-explain "0 5 * * 1"
Input:  0 5 * * 1
Output: At 05:00 on Monday
```

```bash
$ cron-explain "*/15 * * * *"
Input:  */15 * * * *
Output: At every 15 minutes past every hour
```

```bash
$ cron-explain "@daily"
Input:  @daily
Output: At 00:00
```

### English to Cron

```bash
$ cron-explain "every Monday at 5am"
Input:  every Monday at 5am
Cron:   0 5 * * 1
Means:  At 05:00 on Monday
```

```bash
$ cron-explain "every 15 minutes"
Input:  every 15 minutes
Cron:   */15 * * * *
Means:  At every 15 minutes past every hour
```

### Show Examples

```bash
$ cron-explain --examples
```

Shows common patterns with explanations.

## Web Interface

The web version includes:
- Live bidirectional conversion
- Visual cron format breakdown
- Common patterns quick-select
- Validation with error messages
- Mobile responsive

Just open `index.html` - no build step, no npm install. It's a single self-contained HTML file.

## Common Patterns

| Cron Expression | Meaning |
|----------------|---------|
| `* * * * *` | Every minute |
| `*/15 * * * *` | Every 15 minutes |
| `0 * * * *` | Every hour (at :00) |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * 1-5` | Every weekday at 9am |
| `0 5 * * 1` | Every Monday at 5am |
| `0 0 1 * *` | First day of every month |
| `0 0 1 1 *` | Every January 1st at midnight |
| `@hourly` | Every hour |
| `@daily` | Every day at midnight |
| `@weekly` | Every Sunday at midnight |
| `@monthly` | First day of month at midnight |

## Cron Format Reference

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

- `*` - Any value (every)
- `,` - List of values (1,3,5)
- `-` - Range (1-5 means 1,2,3,4,5)
- `/` - Step values (*/15 means every 15)

### Presets

- `@yearly` or `@annually` - `0 0 1 1 *` (once a year)
- `@monthly` - `0 0 1 * *` (once a month)
- `@weekly` - `0 0 * * 0` (once a week)
- `@daily` or `@midnight` - `0 0 * * *` (once a day)
- `@hourly` - `0 * * * *` (once an hour)

## API Usage

If you're using it programmatically:

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

// Explicit cron to English
const explanation = parseCronExpression('*/15 * * * *');
console.log(explanation); 
// "At every 15 minutes past every hour"

// English to cron
const cron = naturalLanguageToCron('every Monday at 5am');
console.log(cron); 
// "0 5 * * 1"
```

## Examples Breakdown

### Complex Patterns

**Every 30 minutes during work hours on weekdays:**
```bash
$ cron-explain "*/30 9-17 * * 1-5"
Output: At every 30 minutes past every hour from 9 through 17 on Monday through Friday
```

**First Monday of every month:**
```bash
$ cron-explain "0 0 1-7 * 1"
Output: At 00:00 on every day-of-month from 1 through 7 and on Monday
```

**Twice a day:**
```bash
$ cron-explain "0 9,17 * * *"
Output: At 09:00 and 17:00
```

## Development

```bash
# Clone repo
git clone https://github.com/muinmomin/cron-explain
cd cron-explain

# Install dependencies (for CLI)
npm install

# Test CLI locally
node cli.js "0 5 * * 1"

# Open web interface
open index.html

# Run tests
npm test
```

## Contributing

Want to improve cron-explain? Here's how:

**Ideas:**
- Support for more natural language patterns
- Better handling of complex cron expressions
- Add support for seconds (extended cron format)
- Improve validation and error messages
- Add timezone support

**How to contribute:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

Please include examples of the patterns you're adding support for.

## Limitations

- Basic natural language parsing (not full NLP)
- Some complex combinations might not convert perfectly
- Seconds not supported (standard cron is minute-level)
- No timezone awareness

## Use Cases

- Writing cron jobs for CI/CD
- Setting up scheduled tasks
- Understanding inherited cron jobs
- Teaching/learning cron syntax
- Documenting scheduled operations
- Validating cron expressions before deployment

## License

MIT

## Author

Muin Momin - [muin.me](https://muin.me)

---

*Stop memorizing cron syntax. Just describe what you want.*
