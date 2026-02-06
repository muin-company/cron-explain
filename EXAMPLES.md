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

## Natural Language to Cron (Reverse Mode)

### Time-based patterns

```bash
# Every X minutes/hours/days
cron-explain "every 15 minutes"
# Cron: */15 * * * *

cron-explain "every 2 hours"
# Cron: 0 */2 * * *

cron-explain "every 3 days"
# Cron: 0 0 */3 * *
```

### Time of day

```bash
# 12-hour format
cron-explain "every day at 3am"
# Cron: 0 3 * * *

cron-explain "5pm every day"
# Cron: 0 17 * * *

# 24-hour format
cron-explain "every day at 15:30"
# Cron: 30 15 * * *

# Special times
cron-explain "noon every day"
# Cron: 0 12 * * *

cron-explain "midnight every day"
# Cron: 0 0 * * *
```

### Weekday patterns

```bash
# Specific days
cron-explain "every Monday at 9am"
# Cron: 0 9 * * 1

cron-explain "Friday at 5pm"
# Cron: 0 17 * * 5

# Weekday ranges
cron-explain "weekdays at 9am"
# Cron: 0 9 * * 1-5
# Means: At 09:00 on Monday-Friday

cron-explain "midnight on weekends"
# Cron: 0 0 * * 0,6
# Means: At 00:00 on Sunday and Saturday
```

### Day of month

```bash
# First/last of month
cron-explain "first of the month"
# Cron: 0 0 1 * *

cron-explain "15th of every month"
# Cron: 0 0 15 * *
```

### Preset shortcuts

```bash
cron-explain "hourly"
# Cron: 0 * * * *

cron-explain "daily"
# Cron: 0 0 * * *

cron-explain "weekly"
# Cron: 0 0 * * 0

cron-explain "monthly"
# Cron: 0 0 1 * *

cron-explain "yearly"
# Cron: 0 0 1 1 *
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
