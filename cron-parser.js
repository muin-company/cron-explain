// Core cron parser - converts between cron and natural language

const PRESETS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *'
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseCronExpression(cron) {
  // Handle presets
  if (cron.startsWith('@')) {
    const preset = PRESETS[cron.toLowerCase()];
    if (preset) {
      return parseCronExpression(preset);
    }
    throw new Error(`Unknown preset: ${cron}`);
  }

  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Cron expression must have exactly 5 fields: minute hour day month weekday');
  }

  const [minute, hour, day, month, weekday] = parts;

  // Build description
  let desc = 'At';

  // Time
  const timeDesc = buildTimeDescription(minute, hour);
  desc += ' ' + timeDesc;

  // Day/Date specifics
  const dateDesc = buildDateDescription(day, month, weekday);
  if (dateDesc) {
    desc += ' ' + dateDesc;
  }

  return desc;
}

function buildTimeDescription(minute, hour) {
  if (minute === '*' && hour === '*') {
    return 'every minute';
  }

  if (hour === '*') {
    const minDesc = buildFieldDescription(minute, 'minute', 'minutes');
    return minDesc + ' past every hour';
  }

  const hourDesc = buildFieldDescription(hour, 'hour', 'hours');
  
  if (hourDesc.includes(',') || hourDesc.includes('-') || hourDesc.includes('/')) {
    const minuteDesc = minute === '0' ? '' : `:${minute.padStart(2, '0')}`;
    return minuteDesc ? `${minuteDesc.slice(1)} minutes past ${hourDesc}` : hourDesc;
  }

  // Simple time format
  const minuteDesc = minute === '0' ? ':00' : ':' + minute.padStart(2, '0');
  return `${hour.padStart(2, '0')}${minuteDesc}`;
}

function buildDateDescription(day, month, weekday) {
  const parts = [];

  if (day !== '*') {
    const dayDesc = buildFieldDescription(day, 'day', 'day of month');
    parts.push('on ' + dayDesc);
  }

  if (month !== '*') {
    const monthDesc = buildMonthDescription(month);
    parts.push('in ' + monthDesc);
  }

  if (weekday !== '*') {
    const weekdayDesc = buildWeekdayDescription(weekday);
    if (day === '*') {
      parts.push('on ' + weekdayDesc);
    } else {
      parts.push('if it\'s ' + weekdayDesc);
    }
  }

  return parts.join(' ');
}

function buildFieldDescription(field, singular, plural = singular + 's') {
  // Every
  if (field === '*') {
    return 'every ' + singular;
  }

  // Step values (*/5)
  if (field.includes('*/')) {
    const step = field.split('*/')[1];
    return `every ${step} ${plural}`;
  }

  // Range with step (1-10/2)
  if (field.includes('/')) {
    const [range, step] = field.split('/');
    const [start, end] = range.split('-');
    return `every ${step} ${plural} from ${start} through ${end}`;
  }

  // Range (1-5)
  if (field.includes('-')) {
    const [start, end] = field.split('-');
    return `${start}-${end}`;
  }

  // List (1,3,5)
  if (field.includes(',')) {
    const values = field.split(',');
    if (values.length === 2) {
      return `${values[0]} and ${values[1]}`;
    }
    return values.slice(0, -1).join(', ') + ' and ' + values[values.length - 1];
  }

  // Single value - pad minutes/hours
  if ((singular === 'minute' || singular === 'hour') && field.length === 1) {
    return field.padStart(2, '0');
  }
  
  return field;
}

function buildMonthDescription(month) {
  if (month.includes(',')) {
    const months = month.split(',').map(m => MONTHS[parseInt(m) - 1] || m);
    if (months.length === 2) {
      return `${months[0]} and ${months[1]}`;
    }
    return months.slice(0, -1).join(', ') + ' and ' + months[months.length - 1];
  }

  if (month.includes('-')) {
    const [start, end] = month.split('-');
    return `${MONTHS[parseInt(start) - 1]}-${MONTHS[parseInt(end) - 1]}`;
  }

  const monthNum = parseInt(month);
  return MONTHS[monthNum - 1] || month;
}

function buildWeekdayDescription(weekday) {
  if (weekday.includes(',')) {
    const days = weekday.split(',').map(d => DAYS[parseInt(d)] || d);
    if (days.length === 2) {
      return `${days[0]} and ${days[1]}`;
    }
    return days.slice(0, -1).join(', ') + ' and ' + days[days.length - 1];
  }

  if (weekday.includes('-')) {
    const [start, end] = weekday.split('-');
    return `${DAYS[parseInt(start)]}-${DAYS[parseInt(end)]}`;
  }

  const dayNum = parseInt(weekday);
  return DAYS[dayNum] || weekday;
}

function naturalLanguageToCron(text) {
  text = text.toLowerCase().trim();

  // Common presets
  if (text.match(/every (minute|hour|day|week|month|year)/)) {
    if (text.includes('minute')) return '* * * * *';
    if (text.includes('hour')) return '0 * * * *';
    if (text.includes('day')) return '0 0 * * *';
    if (text.includes('week')) return '0 0 * * 0';
    if (text.includes('month')) return '0 0 1 * *';
    if (text.includes('year')) return '0 0 1 1 *';
  }

  // Extract components
  let minute = '*', hour = '*', day = '*', month = '*', weekday = '*';

  // Time patterns
  const timeMatch = text.match(/(\d+):(\d+)/);
  if (timeMatch) {
    hour = timeMatch[1];
    minute = timeMatch[2];
  } else {
    const hourMatch = text.match(/(\d+)\s*(am|pm)/);
    if (hourMatch) {
      let h = parseInt(hourMatch[1]);
      if (hourMatch[2] === 'pm' && h !== 12) h += 12;
      if (hourMatch[2] === 'am' && h === 12) h = 0;
      hour = h.toString();
      minute = '0';
    }
  }

  // Weekday patterns
  DAYS.forEach((dayName, index) => {
    if (text.includes(dayName.toLowerCase())) {
      weekday = index.toString();
    }
  });

  // Month patterns
  MONTHS.forEach((monthName, index) => {
    if (text.includes(monthName.toLowerCase())) {
      month = (index + 1).toString();
    }
  });

  // Every X minutes/hours
  const everyMinMatch = text.match(/every (\d+) minutes?/);
  if (everyMinMatch) {
    minute = `*/${everyMinMatch[1]}`;
    hour = '*';
    day = '*';
    month = '*';
    weekday = '*';
  }

  const everyHourMatch = text.match(/every (\d+) hours?/);
  if (everyHourMatch) {
    minute = '0';
    hour = `*/${everyHourMatch[1]}`;
  }

  return `${minute} ${hour} ${day} ${month} ${weekday}`;
}

function isCronExpression(input) {
  input = input.trim();
  
  // Check for presets
  if (input.startsWith('@')) {
    return true;
  }

  // Check for cron pattern (5 fields with allowed characters)
  const cronPattern = /^[0-9\*\-\,\/\s]+$/;
  const parts = input.split(/\s+/);
  
  return parts.length === 5 && cronPattern.test(input);
}

function convert(input) {
  input = input.trim();
  
  if (isCronExpression(input)) {
    return {
      type: 'cron-to-natural',
      input: input,
      output: parseCronExpression(input)
    };
  } else {
    return {
      type: 'natural-to-cron',
      input: input,
      output: naturalLanguageToCron(input)
    };
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseCronExpression,
    naturalLanguageToCron,
    isCronExpression,
    convert,
    PRESETS
  };
}
