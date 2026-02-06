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

### JSON Output

For programmatic parsing and integration with other tools:

```bash
$ cron-explain --json "0 5 * * 1"
{
  "input": "0 5 * * 1",
  "type": "cron-to-natural",
  "success": true,
  "cron": "0 5 * * 1",
  "natural": "At 05:00 on Monday",
  "description": "At 05:00 on Monday"
}
```

```bash
$ cron-explain --json "every Monday at 5am"
{
  "input": "every Monday at 5am",
  "type": "natural-to-cron",
  "success": true,
  "natural": "every Monday at 5am",
  "cron": "0 5 * * 1",
  "description": "At 05:00 on Monday"
}
```

Error handling in JSON mode:

```bash
$ cron-explain --json "invalid expression"
{
  "success": false,
  "error": "Invalid cron expression",
  "input": "invalid expression"
}
```

Perfect for scripts, CI/CD pipelines, or building tools on top of cron-explain.

## Examples

### Example 1: Standard cron to English

```bash
$ cron-explain "0 5 * * 1"
Input:  0 5 * * 1
Output: At 05:00 on Monday

$ cron-explain "*/15 * * * *"
Input:  */15 * * * *
Output: At every 15 minutes past every hour

$ cron-explain "0 0 1 * *"
Input:  0 0 1 * *
Output: At 00:00 on day-of-month 1
```

### Example 2: Natural language to cron

```bash
$ cron-explain "every Monday at 5am"
Input:  every Monday at 5am
Cron:   0 5 * * 1
Means:  At 05:00 on Monday

$ cron-explain "every 30 minutes"
Input:  every 30 minutes
Cron:   */30 * * * *
Means:  At every 30 minutes

$ cron-explain "first day of month at midnight"
Input:  first day of month at midnight
Cron:   0 0 1 * *
Means:  At 00:00 on day-of-month 1
```

### Example 3: Cron presets/shortcuts

```bash
$ cron-explain "@daily"
Input:  @daily
Output: At 00:00

$ cron-explain "@hourly"
Input:  @hourly
Output: At minute 0

$ cron-explain "@weekly"
Input:  @weekly
Output: At 00:00 on Sunday
```

### Example 4: Complex patterns with ranges

```bash
$ cron-explain "*/30 9-17 * * 1-5"
Input:  */30 9-17 * * 1-5
Output: At every 30 minutes past every hour from 9 through 17 on Monday through Friday

$ cron-explain "0 9,12,15,18 * * *"
Input:  0 9,12,15,18 * * *
Output: At 09:00, 12:00, 15:00, and 18:00

$ cron-explain "0 2 * * 0,6"
Input:  0 2 * * 0,6
Output: At 02:00 on Saturday and Sunday
```

### Example 5: Invalid/error cases

```bash
$ cron-explain "99 5 * * *"
Error: Invalid cron expression
  • Minute must be between 0-59 (got: 99)

$ cron-explain "0 25 * * *"
Error: Invalid cron expression
  • Hour must be between 0-23 (got: 25)

$ cron-explain "* * * * 8"
Error: Invalid cron expression
  • Day of week must be between 0-7 (got: 8)

$ cron-explain "tomorrow at 3pm"
Error: Cannot convert to cron
  • Cron doesn't support specific dates, only recurring schedules
  • Use the 'at' command for one-time scheduled tasks
```

### Example 6: Edge cases and tricky patterns

```bash
$ cron-explain "0 0 29-31 * *"
Input:  0 0 29-31 * *
Output: At 00:00 on every day-of-month from 29 through 31
Note:   Will skip months with fewer than 29 days

$ cron-explain "0 0 31 2 *"
Input:  0 0 31 2 *
Output: At 00:00 on day-of-month 31 in February
Warning: This will never run (February has max 29 days)

$ cron-explain "* * * * * *"
Error: Invalid cron expression
  • Standard cron uses 5 fields (minute hour day month weekday)
  • Seconds are not supported in standard cron
```

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

## Real-World Scenarios

### Setting up database backups
```bash
# Need: Daily backups at 2am
$ cron-explain "every day at 2am"
Input:  every day at 2am
Cron:   0 2 * * *
Means:  At 02:00

# Add to crontab
$ crontab -e
0 2 * * * /home/user/backup-db.sh
```

### Monitoring disk space during business hours
```bash
# Need: Check disk every 30 min, but only 9am-6pm on weekdays
$ cron-explain "every 30 minutes between 9am and 6pm on weekdays"
Input:  every 30 minutes between 9am and 6pm on weekdays
Cron:   */30 9-18 * * 1-5
Means:  At every 30 minutes past every hour from 9 through 18 on Monday through Friday

# Add to crontab
$ crontab -e
*/30 9-18 * * 1-5 df -h | mail -s "Disk Usage" admin@company.com
```

### Inherited crontab archaeology
```bash
# Found this in production crontab, no idea what it means
$ crontab -l | grep "23 5"
23 5 */2 * *  /opt/scripts/mystery-job.sh

$ cron-explain "23 5 */2 * *"
Input:  23 5 */2 * *
Output: At 05:23 on every 2nd day-of-month

# Oh, it runs every other day at 5:23am. Still don't know why 5:23 specifically.
# Probably someone's birthday or they mashed the keyboard.
```

### SSL certificate renewal
```bash
# Certbot renewal: once a week should be enough
$ cron-explain "every Sunday at 3am"
Input:  every Sunday at 3am
Cron:   0 3 * * 0
Means:  At 03:00 on Sunday

# Add to crontab
$ crontab -e
0 3 * * 0 certbot renew --quiet && systemctl reload nginx
```

### Log rotation nightmare
```bash
# Boss: "Why are our logs 500GB?"
# You: *checks crontab*
$ crontab -l
0 0 * * * /usr/bin/rotate-logs.sh

$ cron-explain "0 0 * * *"
Input:  0 0 * * *
Output: At 00:00

# Ah, it runs daily. Should be more frequent.
$ cron-explain "every 6 hours"
Input:  every 6 hours
Cron:   0 */6 * * *
Means:  At minute 0 past every 6th hour

# Update crontab
$ crontab -e
0 */6 * * * /usr/bin/rotate-logs.sh
```

### Microservice health checks
```bash
# Check if services are alive every 5 minutes
$ cron-explain "every 5 minutes"
Input:  every 5 minutes
Cron:   */5 * * * *
Means:  At every 5 minutes

$ crontab -e
*/5 * * * * curl -f http://localhost:3000/health || systemctl restart myapp
```

### Monthly billing reports
```bash
# Finance wants reports on first of month, 9am sharp
$ cron-explain "first day of every month at 9am"
Input:  first day of every month at 9am
Cron:   0 9 1 * *
Means:  At 09:00 on day-of-month 1

$ crontab -e
0 9 1 * * /opt/billing/generate-report.sh | mail -s "Monthly Report" finance@company.com
```

### Dev environment cleanup
```bash
# Clean up old docker containers every Friday evening
$ cron-explain "every Friday at 6pm"
Input:  every Friday at 6pm
Cron:   0 18 * * 5
Means:  At 18:00 on Friday

$ crontab -e
0 18 * * 5 docker system prune -af --volumes
```

### Cache warming before traffic spike
```bash
# E-commerce site: warm cache before morning rush (8am) and lunch (noon)
$ cron-explain "0 8,12 * * *"
Input:  0 8,12 * * *
Output: At 08:00 and 12:00

# Perfect, that's what we want
$ crontab -e
0 8,12 * * * curl -X POST https://api.shop.com/cache/warm
```

### Debugging why job didn't run
```bash
# Job was supposed to run yesterday at 2pm but didn't
$ crontab -l | grep report
0 14 * * 1-5 /home/user/daily-report.sh

$ cron-explain "0 14 * * 1-5"
Input:  0 14 * * 1-5
Output: At 14:00 on Monday through Friday

# OH. Yesterday was Saturday. Weekdays only. That explains it.
```

### One-time reminder (cron isn't the right tool but...)
```bash
# Wrong approach - don't actually do this
$ cron-explain "at 3pm today"
Error: Cron doesn't support one-time jobs or specific dates

# Use 'at' command instead:
$ echo "/home/user/reminder.sh" | at 3pm today

# Or for actual recurring schedule:
$ cron-explain "every weekday at 3pm"
Input:  every weekday at 3pm
Cron:   0 15 * * 1-5
Means:  At 15:00 on Monday through Friday
```

### Testing your cron schedule
```bash
# Want to make sure this runs right
$ cron-explain "0 2 15 * *"
Input:  0 2 15 * *
Output: At 02:00 on day-of-month 15

# Verify: 2am on the 15th of every month? Yes!
# Add it
$ crontab -e
0 2 15 * * /opt/monthly-cleanup.sh

# Check cron will actually run it
$ crontab -l
0 2 15 * * /opt/monthly-cleanup.sh

# Force a test run (don't wait for the 15th)
$ /opt/monthly-cleanup.sh
```

---

### Example 11: Multi-environment deployment schedule

**Scenario:** Different deployment schedules for staging vs production.

```bash
# Staging: Deploy automatically every night
$ cron-explain "0 2 * * *"
Input:  0 2 * * *
Output: At 02:00

# Add to staging crontab
$ crontab -e
0 2 * * * cd /app && git pull && npm install && pm2 restart all

# Production: Only deploy on Sundays during maintenance window
$ cron-explain "0 3 * * 0"
Input:  0 3 * * 0
Output: At 03:00 on Sunday

# Add to production crontab (with notification)
0 3 * * 0 /opt/deploy.sh && curl -X POST https://slack.com/webhook -d '{"text":"Production deployed"}'

# Pre-deployment checks run 30 minutes before
$ cron-explain "30 2 * * 0"
Input:  30 2 * * 0
Output: At 02:30 on Sunday

30 2 * * 0 /opt/pre-deploy-checks.sh || echo "Pre-checks failed" | mail -s "Deploy Alert" ops@company.com
```

---

### Example 12: Rate limit / throttling pattern

**Scenario:** API has rate limits. Space out jobs to avoid hitting limits.

```bash
# Bad: All jobs fire at midnight (stampede!)
$ crontab -l
0 0 * * * /opt/sync-users.sh
0 0 * * * /opt/sync-orders.sh
0 0 * * * /opt/sync-products.sh
0 0 * * * /opt/sync-reviews.sh

# Good: Stagger jobs every 15 minutes
$ cron-explain "0,15,30,45 0 * * *"
Input:  0,15,30,45 0 * * *
Output: At minute 0, 15, 30, and 45 past hour 0

# Better crontab:
0  0 * * * /opt/sync-users.sh      # 00:00
15 0 * * * /opt/sync-orders.sh     # 00:15
30 0 * * * /opt/sync-products.sh   # 00:30
45 0 * * * /opt/sync-reviews.sh    # 00:45

# Alternative: Use systemd timers with RandomizedDelaySec
# Or add sleep with random jitter in the script:
0 0 * * * sleep $((RANDOM \% 300)) && /opt/sync-users.sh
```

---

### Example 13: Conditional execution based on day of month

**Scenario:** First workday of month vs. all other workdays.

```bash
# Every weekday at 9am
$ cron-explain "0 9 * * 1-5"
Input:  0 9 * * 1-5
Output: At 09:00 on Monday through Friday

# First 7 days of month (catches first weekday)
$ cron-explain "0 9 1-7 * 1-5"
Input:  0 9 1-7 * 1-5
Output: At 09:00 on every day-of-month from 1 through 7 and on Monday through Friday

# But this runs multiple times if 1st-7th has multiple weekdays!
# Better: Use a script with logic

# monthly-report-cron.sh:
#!/bin/bash
DAY=$(date +\%d)
DOW=$(date +\%u)  # 1=Monday, 7=Sunday

# First weekday of month
if [ $DAY -le 3 ] && [ $DOW -eq 1 ]; then
    /opt/generate-monthly-report.sh
# Or if today is the 1st and it's a weekday
elif [ $DAY -eq 1 ] && [ $DOW -le 5 ]; then
    /opt/generate-monthly-report.sh
fi

# Then just run daily:
0 9 * * 1-5 /opt/monthly-report-cron.sh

# Alternative: Use 'at' command for next first weekday
# In Dec 31st cron:
0 23 31 12 * echo "/opt/monthly-report.sh" | at 9am "next monday"
```

---

### Example 14: Debugging cron with logging

**Scenario:** Cron job isn't running, or it's running but failing silently.

```bash
# Bad: No output, no logs
0 2 * * * /opt/backup.sh

# Better: Redirect to log file
0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1

# Best: Timestamps + exit codes + notifications
0 2 * * * (date; /opt/backup.sh; echo "Exit code: $?"; date) >> /var/log/backup.log 2>&1 || echo "Backup failed" | mail -s "BACKUP ALERT" admin@company.com

# Check if cron daemon is running
$ systemctl status cron     # Ubuntu/Debian
$ systemctl status crond    # CentOS/RHEL

# Check cron logs
$ grep CRON /var/log/syslog  # Ubuntu/Debian
$ grep CRON /var/log/cron    # CentOS/RHEL

# Test cron expression is valid
$ cron-explain "0 2 * * *"
Input:  0 2 * * *
Output: At 02:00

# Manually trigger job to test
$ /opt/backup.sh

# Check crontab syntax
$ crontab -l

# Common gotchas:
# 1. PATH is different in cron (use absolute paths)
# 2. Environment variables aren't loaded (~/.bashrc doesn't run)
# 3. Working directory is usually $HOME

# Debug crontab with verbose PATH and env vars:
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
MAILTO=admin@company.com

0 2 * * * cd /opt && ./backup.sh >> /var/log/backup.log 2>&1

# Test what environment cron sees:
* * * * * env > /tmp/cron-env.txt
# Wait a minute, then:
$ cat /tmp/cron-env.txt
```

---

### Example 15: Complex business logic schedules

**Scenario:** "Run every quarter, on the 15th, unless it's a weekend, then run Monday."

```bash
# Cron can't do "unless it's a weekend, then Monday"
# Closest approximation:

# Run on 15th, 16th, 17th of Jan, Apr, Jul, Oct
$ cron-explain "0 9 15-17 1,4,7,10 *"
Input:  0 9 15-17 1,4,7,10 *
Output: At 09:00 on every day-of-month from 15 through 17 in January, April, July, and October

# This covers:
# - 15th if weekday
# - 16th if 15th is Saturday (Monday)
# - 17th if 15th is Sunday (Monday) 

# But runs ALL THREE DAYS if 15th is Friday!

# Better: Use script with business logic
#!/bin/bash
# quarterly-report.sh

MONTH=$(date +\%m)
DAY=$(date +\%d)
DOW=$(date +\%u)

# Only run in Jan, Apr, Jul, Oct
if [[ ! " 01 04 07 10 " =~ " $MONTH " ]]; then
    exit 0
fi

# If today is 15th and weekday, run
if [ $DAY -eq 15 ] && [ $DOW -le 5 ]; then
    /opt/generate-quarterly-report.sh
    exit 0
fi

# If today is Monday and 15th was weekend
if [ $DOW -eq 1 ]; then
    LAST_SUNDAY=$(date -d "last sunday" +\%d)
    LAST_SATURDAY=$(date -d "last saturday" +\%d)
    
    if [ $LAST_SUNDAY -eq 15 ] || [ $LAST_SATURDAY -eq 15 ]; then
        /opt/generate-quarterly-report.sh
    fi
fi

# Run daily, script handles logic:
0 9 * * * /opt/quarterly-report.sh >> /var/log/quarterly.log 2>&1

# Alternative: Use 'when' or 'systemd calendar' for complex schedules
# systemd.timer example:
# OnCalendar=*-01,04,07,10-15..17 09:00:00
```

---

### Example 16: Timezone-aware scheduling

**Scenario:** Server is UTC but you want jobs to run at local business hours.

```bash
# Server is in UTC, you're in PST (UTC-8)
# Want job to run at 9am PST = 5pm UTC (17:00)

$ cron-explain "0 17 * * 1-5"
Input:  0 17 * * 1-5
Output: At 17:00 on Monday through Friday

# But this breaks during daylight saving time!
# PST becomes PDT (UTC-7), so 9am PDT = 4pm UTC (16:00)

# Option 1: Set timezone in crontab (modern cron supports this)
CRON_TZ=America/Los_Angeles
0 9 * * 1-5 /opt/morning-job.sh

# Option 2: Use systemd timers with timezone
# /etc/systemd/system/morning-job.timer:
[Timer]
OnCalendar=America/Los_Angeles *-*-* 09:00:00
Persistent=true

# Option 3: Two crontabs (winter/summer)
# Winter (PST):
0 17 * 11-02 1-5 /opt/morning-job.sh  # Nov-Feb
# Summer (PDT):
0 16 * 03-10 1-5 /opt/morning-job.sh  # Mar-Oct

# Check server timezone
$ timedatectl
$ date +\%Z

# Test what time cron thinks it is
* * * * * date >> /tmp/cron-time.txt
```

---

## Use Cases

- Writing cron jobs for CI/CD
- Setting up scheduled tasks
- Understanding inherited cron jobs
- Teaching/learning cron syntax
- Documenting scheduled operations
- Validating cron expressions before deployment
- Debugging why scheduled jobs didn't run
- Converting human-readable schedules to cron format

---

## Integration Examples

### npm Scripts

Add helpful scripts to `package.json`:

```json
{
  "scripts": {
    "cron:explain": "cron-explain",
    "cron:validate": "cron-explain --examples",
    "cron:help": "cron-explain -h"
  }
}
```

Usage:
```bash
npm run cron:explain "0 5 * * 1"
npm run cron:validate
```

---

### Pre-commit Hook - Validate Crontab

Prevent invalid cron expressions from being committed:

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if crontab files were modified
if git diff --cached --name-only | grep -q "crontab\|.cron"; then
  echo "🔍 Validating cron expressions..."
  
  # Extract cron expressions from staged files
  git diff --cached | grep "^+" | grep -E "^\+[0-9\*]" | while read line; do
    cron_expr=$(echo "$line" | sed 's/^+//' | awk '{print $1,$2,$3,$4,$5}')
    
    # Validate with cron-explain
    if ! cron-explain "$cron_expr" > /dev/null 2>&1; then
      echo "❌ Invalid cron expression: $cron_expr"
      exit 1
    else
      meaning=$(cron-explain "$cron_expr" | grep "Output:")
      echo "✅ Valid: $cron_expr → $meaning"
    fi
  done
fi

echo "✅ Cron expressions validated"
exit 0
```

---

### GitHub Actions - Document Cron Jobs

Auto-generate documentation for scheduled workflows:

```yaml
# .github/workflows/document-crons.yml
name: Document Cron Jobs

on:
  push:
    paths:
      - '.github/workflows/*.yml'

jobs:
  document:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install cron-explain
        run: npm install -g cron-explain
      
      - name: Extract and explain cron schedules
        run: |
          echo "# Scheduled Workflows" > docs/SCHEDULES.md
          echo "Auto-generated: $(date)" >> docs/SCHEDULES.md
          echo "" >> docs/SCHEDULES.md
          
          for workflow in .github/workflows/*.yml; do
            # Extract cron expressions
            grep -A1 "schedule:" "$workflow" | grep "cron:" | while read line; do
              workflow_name=$(basename "$workflow" .yml)
              cron_expr=$(echo "$line" | sed "s/.*cron: *['\"]//;s/['\"].*//" | tr -d "'\"")
              
              echo "## $workflow_name" >> docs/SCHEDULES.md
              echo "\`\`\`" >> docs/SCHEDULES.md
              echo "$cron_expr" >> docs/SCHEDULES.md
              echo "\`\`\`" >> docs/SCHEDULES.md
              
              cron-explain "$cron_expr" >> docs/SCHEDULES.md
              echo "" >> docs/SCHEDULES.md
            done
          done
      
      - name: Commit documentation
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add docs/SCHEDULES.md
          git diff --staged --quiet || git commit -m "docs: update cron schedules"
          git push
```

**Generated docs/SCHEDULES.md example:**
```markdown
# Scheduled Workflows
Auto-generated: 2026-02-07

## backup-database
```
0 2 * * *
```
Input:  0 2 * * *
Output: At 02:00

## weekly-report
```
0 9 * * 1
```
Input:  0 9 * * 1
Output: At 09:00 on Monday
```

---

### VS Code Snippet

Add to `.vscode/snippets.code-snippets`:

```json
{
  "Cron Expression with Explanation": {
    "prefix": "cron",
    "body": [
      "# ${1:Description}",
      "# Cron: ${2:0 0 * * *}",
      "# Runs: ${3:Every day at midnight}",
      "${2:0 0 * * *} ${4:command}"
    ],
    "description": "Insert cron job with explanation"
  }
}
```

Usage: Type `cron` and press Tab to expand template.

---

### Shell Alias for Quick Access

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Explain cron expression
alias cronx='cron-explain'

# Generate cron from natural language
alias cron-gen='cron-explain'

# Validate current crontab
alias cron-check='crontab -l | grep -v "^#" | awk "{print \$1,\$2,\$3,\$4,\$5}" | while read c; do cron-explain "$c" || echo "Invalid: $c"; done'

# Show examples
alias cron-examples='cron-explain --examples'
```

Usage:
```bash
cronx "0 5 * * 1"
cron-gen "every Monday at 5am"
cron-check
```

---

### Systemd Timer Helper

Convert cron to systemd timer format:

```bash
#!/bin/bash
# cron-to-systemd.sh

cron_expr="$1"
service_name="$2"

if [ -z "$cron_expr" ] || [ -z "$service_name" ]; then
  echo "Usage: ./cron-to-systemd.sh '<cron>' <service-name>"
  exit 1
fi

# Explain the cron
explanation=$(cron-explain "$cron_expr" | grep "Output:" | sed 's/Output: //')

# Convert to OnCalendar format (simplified)
# This is a basic converter - systemd calendar format is more complex

read min hour dom mon dow <<< $(echo "$cron_expr")

calendar=""
if [ "$min" != "*" ] && [ "$hour" != "*" ]; then
  calendar="*-*-* $hour:$min:00"
elif [ "$hour" != "*" ]; then
  calendar="*-*-* $hour:*:00"
fi

# Generate systemd timer
cat > "${service_name}.timer" <<EOF
[Unit]
Description=$explanation
Requires=${service_name}.service

[Timer]
OnCalendar=$calendar
Persistent=true

[Install]
WantedBy=timers.target
EOF

echo "✓ Created ${service_name}.timer"
echo "  Cron: $cron_expr"
echo "  Meaning: $explanation"
echo "  OnCalendar: $calendar"
echo ""
echo "Next steps:"
echo "  sudo cp ${service_name}.timer /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable ${service_name}.timer"
echo "  sudo systemctl start ${service_name}.timer"
```

Usage:
```bash
./cron-to-systemd.sh "0 2 * * *" backup
# Creates backup.timer with systemd format
```

---

### Kubernetes CronJob Generator

Generate Kubernetes CronJob manifests with explanations:

```bash
#!/bin/bash
# k8s-cronjob-gen.sh

cron_expr="$1"
job_name="$2"
image="$3"
command="$4"

explanation=$(cron-explain "$cron_expr" | grep "Output:" | sed 's/Output: //')

cat <<EOF > "${job_name}-cronjob.yaml"
apiVersion: batch/v1
kind: CronJob
metadata:
  name: $job_name
spec:
  # $explanation
  schedule: "$cron_expr"
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: $job_name
            image: $image
            command: ["$command"]
          restartPolicy: OnFailure
EOF

echo "✓ Created ${job_name}-cronjob.yaml"
echo "  Schedule: $cron_expr ($explanation)"
```

Usage:
```bash
./k8s-cronjob-gen.sh "0 2 * * *" backup-db postgres:15 /backup.sh
```

---

### Docker Compose with Cron Services

Document cron schedules in docker-compose.yml:

```yaml
version: '3.8'

services:
  # Main app
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
  
  # Cron runner
  cron:
    image: alpine:latest
    command: crond -f
    volumes:
      - ./crontab:/etc/crontabs/root
    labels:
      # Document cron schedules using labels
      cron.backup: "0 2 * * * - At 02:00 (daily backups)"
      cron.cleanup: "0 0 * * 0 - At 00:00 on Sunday (weekly cleanup)"
      cron.reports: "0 9 1 * * - At 09:00 on day 1 (monthly reports)"
```

Extract and validate:
```bash
# Validate all cron expressions in docker-compose.yml
docker-compose config | grep "cron\." | while read label; do
  cron_expr=$(echo "$label" | cut -d: -f2 | awk '{print $1,$2,$3,$4,$5}')
  echo "Checking: $cron_expr"
  cron-explain "$cron_expr" || echo "❌ Invalid: $cron_expr"
done
```

---

### Ansible Playbook Integration

Validate cron jobs before deployment:

```yaml
# playbooks/setup-cron.yml
---
- name: Setup Cron Jobs
  hosts: all
  tasks:
    - name: Validate cron expressions
      local_action:
        module: shell
        cmd: "cron-explain '{{ item.schedule }}'"
      loop:
        - { name: "backup", schedule: "0 2 * * *", job: "/opt/backup.sh" }
        - { name: "cleanup", schedule: "0 0 * * 0", job: "/opt/cleanup.sh" }
      register: cron_validation
      failed_when: cron_validation.rc != 0
    
    - name: Install validated cron jobs
      cron:
        name: "{{ item.name }}"
        minute: "{{ item.schedule.split()[0] }}"
        hour: "{{ item.schedule.split()[1] }}"
        day: "{{ item.schedule.split()[2] }}"
        month: "{{ item.schedule.split()[3] }}"
        weekday: "{{ item.schedule.split()[4] }}"
        job: "{{ item.job }}"
      loop:
        - { name: "backup", schedule: "0 2 * * *", job: "/opt/backup.sh" }
        - { name: "cleanup", schedule: "0 0 * * 0", job: "/opt/cleanup.sh" }
```

---

### CI/CD Cron Linter

Add to CI pipeline to validate all cron expressions:

```yaml
# .gitlab-ci.yml
lint-crons:
  stage: validate
  script:
    - npm install -g cron-explain
    - |
      # Find all cron expressions in repo
      grep -r -E "^[0-9\*].*\*.*\*" . --include="*.yml" --include="*.yaml" --include="crontab" | \
      while IFS=: read file expr; do
        echo "Checking $file"
        cron_expr=$(echo "$expr" | awk '{print $1,$2,$3,$4,$5}')
        if cron-explain "$cron_expr" > /dev/null 2>&1; then
          echo "  ✅ Valid: $cron_expr"
        else
          echo "  ❌ Invalid: $cron_expr"
          exit 1
        fi
      done
```

---

### Terraform AWS EventBridge Integration

Generate EventBridge cron rules with explanations:

```hcl
# terraform/cronjobs.tf

# Validate cron before creating resource
resource "null_resource" "validate_cron" {
  provisioner "local-exec" {
    command = "cron-explain '${var.backup_schedule}' || exit 1"
  }
}

# Create EventBridge rule (uses cron format)
resource "aws_cloudwatch_event_rule" "backup" {
  name                = "daily-backup"
  description         = "Daily backup at 2am (${var.backup_schedule})"
  schedule_expression = "cron(${var.backup_schedule})"
  
  depends_on = [null_resource.validate_cron]
}

# variables.tf
variable "backup_schedule" {
  description = "Cron expression for backup schedule (validates with cron-explain)"
  type        = string
  default     = "0 2 * * *"  # At 02:00
  
  validation {
    condition     = can(regex("^[0-9\\*].* .* .* .* .*$", var.backup_schedule))
    error_message = "Must be valid cron expression. Use cron-explain to validate."
  }
}
```

---

## Troubleshooting

### "Error: Invalid cron expression"

**Problem:** Cron expression has syntax errors.

**Solution:**
```bash
# Check each field:
# minute (0-59) hour (0-23) day (1-31) month (1-12) weekday (0-7)

# Bad:
cron-explain "60 5 * * *"
# Error: Minute must be 0-59

# Good:
cron-explain "0 5 * * *"
# Output: At 05:00

# Common mistakes:
cron-explain "5 0 * * *"   # 00:05, not 05:00
cron-explain "0 25 * * *"  # Invalid: hour must be 0-23
cron-explain "* * * * 8"   # Invalid: weekday must be 0-7
```

---

### "Cannot convert natural language to cron"

**Problem:** Natural language is too ambiguous or not supported.

**Examples of what works:**
```bash
✅ cron-explain "every Monday at 5am"
✅ cron-explain "every 15 minutes"
✅ cron-explain "first day of month at midnight"
✅ cron-explain "every weekday at 9am"
```

**Examples of what doesn't work:**
```bash
❌ cron-explain "next Tuesday"         # Cron is for recurring, not one-time
❌ cron-explain "tomorrow at 3pm"      # Use 'at' command instead
❌ cron-explain "when server load is low"  # No conditional logic
❌ cron-explain "twice a week"         # Too vague, which days?
```

**Solution:** Be specific!
```bash
# Instead of "twice a week":
cron-explain "every Monday and Thursday at 9am"

# Instead of "next Tuesday" (use 'at' command):
echo "command" | at 3pm next Tuesday
```

---

### Cron Expression Works in cron-explain but Fails in Actual Cron

**Problem:** Different cron implementations have different features.

**Variations:**
```bash
# Standard cron (5 fields):
0 5 * * 1-5    ✅ Works everywhere

# Some systems support 6 fields (with seconds):
0 0 5 * * 1-5  ❌ Not standard, may fail

# Vixie cron supports @reboot:
@reboot /script.sh  ✅ Works on most Linux

# But some minimal systems don't:
@reboot /script.sh  ❌ Fails on BusyBox/Alpine

# Check your cron version:
man cron  # or: crontab -l
```

**Solution:** Stick to standard 5-field format for portability.

---

### "Works in cron-explain but Job Doesn't Run"

**Problem:** Valid syntax but environmental issues.

**Debug checklist:**
```bash
# 1. Check cron daemon is running
systemctl status cron     # Debian/Ubuntu
systemctl status crond    # CentOS/RHEL
brew services list | grep cron  # macOS

# 2. Check crontab was saved
crontab -l

# 3. Check cron logs
grep CRON /var/log/syslog  # Ubuntu/Debian
grep CRON /var/log/cron    # CentOS/RHEL
log stream --predicate 'process == "cron"' --info  # macOS

# 4. Test the command manually
/path/to/script.sh

# 5. Check permissions
ls -la /path/to/script.sh
chmod +x /path/to/script.sh

# 6. Use absolute paths in cron
# ❌ node script.js
# ✅ /usr/bin/node /home/user/script.js

# 7. Set PATH in crontab
PATH=/usr/local/bin:/usr/bin:/bin
0 5 * * * node /home/user/script.js
```

---

### Timezone Confusion

**Problem:** Cron runs in different timezone than expected.

**Solution:**
```bash
# Check server timezone
timedatectl  # Linux
date +%Z     # All systems

# Set timezone in crontab (modern cron supports this)
CRON_TZ=America/New_York
0 9 * * 1-5 /opt/backup.sh

# Or use UTC and calculate offset
# Want 9am EST (UTC-5):
0 14 * * 1-5 /opt/backup.sh  # 14:00 UTC = 9:00 EST

# Verify with cron-explain
cron-explain "0 14 * * 1-5"
# Output: At 14:00 on Monday through Friday
```

---

### Special Characters Not Working

**Problem:** `%` or `*` in commands are interpreted by cron.

**Solution:**
```bash
# % is special in cron (newline)
# ❌ This fails:
0 5 * * * curl http://example.com?param=value%20with%20space

# ✅ Escape it:
0 5 * * * curl http://example.com?param=value\%20with\%20space

# Or use a script instead:
0 5 * * * /opt/scripts/api-call.sh

# For * in filenames, escape or quote:
0 2 * * * find /tmp -name "*.log" -delete
```

---

### Day of Month AND Day of Week Confusion

**Problem:** Combining day of month and day of week doesn't work as expected.

**Common mistake:**
```bash
# Want: First Monday of every month
# Wrong:
0 9 1 * 1
# This runs: On the 1st of every month OR every Monday
# Not: Only on 1st when it's a Monday

# cron uses OR logic for day fields!
```

**Solution:**
```bash
# Use script with logic:
0 9 1-7 * 1 /opt/first-monday-check.sh

# first-monday-check.sh:
#!/bin/bash
if [ $(date +\%d) -le 7 ]; then
  /opt/actual-task.sh
fi

# Or use explicit dates:
cron-explain "0 9 1-7 * 1"
# Output: At 09:00 on every day-of-month from 1 through 7 and on Monday
# This catches the first Monday (1st-7th includes first week)
```

---

### JSON Output Not Parsing

**Problem:** JSON output is malformed or missing.

**Solution:**
```bash
# Check version supports --json
cron-explain --version

# Valid JSON output:
cron-explain "0 5 * * 1" --json | jq .
# {
#   "input": "0 5 * * 1",
#   "type": "cron-to-natural",
#   "cron": "0 5 * * 1",
#   "natural": "At 05:00 on Monday",
#   ...
# }

# If jq fails, check for extra output:
cron-explain "0 5 * * 1" --json 2>/dev/null | jq .

# Or update to latest version:
npm update -g cron-explain
```

---

## License

MIT

## Author

Muin Momin - [muin.me](https://muin.me)

---

*Stop memorizing cron syntax. Just describe what you want.*
