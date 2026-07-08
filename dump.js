const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\vivobook15\\Documents\\Car Wash pro';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const firstLine = content.split('\n')[0];
  console.log(`[${f}] -> ${firstLine}`);
}
