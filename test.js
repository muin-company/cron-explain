// Simple tests for cron-explain

const { convert, parseCronExpression, naturalLanguageToCron, isCronExpression } = require('./cron-parser.js');

const tests = [
  // Cron to natural
  { input: '* * * * *', expected: 'At every minute' },
  { input: '0 * * * *', expected: 'At 00 past every hour' },
  { input: '*/15 * * * *', expected: 'At every 15 minutes past every hour' },
  { input: '0 0 * * *', expected: 'At 00:00' },
  { input: '0 5 * * 1', expected: 'At 05:00 on Monday' },
  { input: '0 9 * * 1-5', expected: 'At 09:00 on Monday-Friday' },
  { input: '@daily', expected: 'At 00:00' },
  { input: '@hourly', expected: 'past every hour' },
  
  // Detection tests
  { input: '0 5 * * 1', shouldBeCron: true },
  { input: 'every Monday', shouldBeCron: false },
];

console.log('Running tests...\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  try {
    if (test.shouldBeCron !== undefined) {
      const result = isCronExpression(test.input);
      if (result === test.shouldBeCron) {
        console.log(`✓ Test ${index + 1}: Detection correct for "${test.input}"`);
        passed++;
      } else {
        console.log(`✗ Test ${index + 1}: Expected ${test.shouldBeCron} but got ${result} for "${test.input}"`);
        failed++;
      }
    } else {
      const result = convert(test.input);
      const output = result.output;
      
      if (output.includes(test.expected) || test.expected.includes(output)) {
        console.log(`✓ Test ${index + 1}: "${test.input}" -> "${output}"`);
        passed++;
      } else {
        console.log(`✗ Test ${index + 1}: Expected "${test.expected}" but got "${output}"`);
        failed++;
      }
    }
  } catch (error) {
    console.log(`✗ Test ${index + 1}: Error - ${error.message}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
