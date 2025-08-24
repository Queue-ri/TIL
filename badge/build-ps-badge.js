const fs = require('fs');
const path = require('path');

let template = fs.readFileSync('badge/template.svg', 'utf-8');
const listFile = path.resolve(__dirname, '../recent-ps-list.txt');

/* 교체할 내용 */
// 줄 단위로 1차 파싱
const lines = fs.readFileSync(listFile, 'utf-8').trim().split('\n');
const statusToEmoji = {
  update: '📙',
  new: '📗'
};

// 2차 파싱
const data = lines.map(line => {
  const [status, ...rest] = line.split(','); // 첫 쉼표만 기준으로 자르기
  const title = rest.join(',').trim(); // 이후는 쉼표로 자르면 안됨
  const emoji = statusToEmoji[status.trim()] || '📘';
  let text = `${emoji} ${title}`;

  // 42자로 최대 길이 제한
  if (text.length > 42) {
    text = text.slice(0, 42) + '...';
  }

  return text;
});

let i = 0;
svg = template.replace(/Placeholder for line \d+/g, () => data[i++]);

fs.writeFileSync('badge/ps-badge.svg', svg, 'utf-8');