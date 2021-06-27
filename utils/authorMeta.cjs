const yaml = require('js-yaml');
const fs = require('fs');

try {
  const authorMeta = yaml.load(fs.readFileSync('static/assets/author/authors.yml', 'utf8'));
  fs.writeFileSync('static/assets/author/authors.json', JSON.stringify(authorMeta));
} catch (e) {
  console.log(e);
}
