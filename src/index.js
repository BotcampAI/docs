'use strict';
const fs = require('fs');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

fs.readFile('./README.md', 'utf-8', (err, md) => {
  fs.readFile('./src/index.tmpl', 'utf-8', (err, tmpl) => {
    marked(md, function (err, content) {
      tmpl = tmpl.replace('${content}', content);
      fs.writeFile('index.html', tmpl);
    });
  });
});
