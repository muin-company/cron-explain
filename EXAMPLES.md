# Cron Examples

## Basic Patterns

```bash
# Every minute
cron-explain "* * * * *"
# Output: At every minute

# Every hour
cron-explain "0 * * * *"
# Output: At 00 past every hour

# Every day at midnight
cron-explain "0 0 * * *"
# Output: At 00:00

# Every Monday at 5am
cron-explain "0 5 * * 1"
# Output: At 05:00 on Monday

# Every weekday at 9am
cron-explain "0 9 * * 1-5"
# Output: At 09:00 on Monday-Friday
```

## Step Values

```bash
# Every 15 minutes
cron-explain "*/15 * * * *"
# Output: At every 15 minutes past every hour

# Every 2 hours
cron-explain "0 */2 * * *"
# Output: At 00 past every 2 hours
```

## Lists

```bash
# At 6am and 6pm
cron-explain "0 6,18 * * *"
# Output: At 06:00 and 18:00

# Monday and Friday
cron-explain "0 9 * * 1,5"
# Output: At 09:00 on Monday and Friday
```

## Natural Language to Cron

```bash
# Simple conversions
cron-explain "every day"
# Cron: 0 0 * * *

cron-explain "every hour"
# Cron: 0 * * * *

cron-explain "every Monday at 5am"
# Cron: 0 5 * * 1

cron-explain "every 15 minutes"
# Cron: */15 * * * *
```

## Presets

```bash
cron-explain "@daily"
# Output: At 00:00

cron-explain "@hourly"
# Output: At 00 past every hour

cron-explain "@weekly"
# Output: At 00:00 on Sunday

cron-explain "@monthly"
# Output: At 00:00 on day 1
```

## Tips

- The tool auto-detects whether input is cron or natural language
- For natural language, be specific: "every Monday at 5am" works better than "mondays 5"
- Use presets (@daily, @hourly) for common patterns
- Web version at index.html has interactive examples
