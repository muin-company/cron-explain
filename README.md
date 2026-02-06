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

## License

MIT

## Author

Muin Momin - [muin.me](https://muin.me)

---

*Stop memorizing cron syntax. Just describe what you want.*
