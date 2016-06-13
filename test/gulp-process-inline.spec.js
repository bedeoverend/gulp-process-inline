'use strict';

const assert = require('assert');
const File = require('vinyl');
const processInline = require('..')();
const through = require('through2').obj;

function extract(input, selector, count = 1) {
  return new Promise((resolve) => {
    let extractScript = processInline.extract(selector),
        fakeFile = new File({
          contents: new Buffer(input)
        });

    extractScript.on('data', (file) => {
      if (!--count) {
        resolve(file);
      }
    });

    extractScript.write(fakeFile);
  });
}

function restore(file, count = 1) {
  return new Promise(resolve => {
    let restore = processInline.restore();

    restore.on('data', (file) => {
      if (!--count) {
        resolve(file);
      }
    });

    restore.write(file);
  });
}

describe('gulp-process-inline', () => {
  describe('extract and restore', () => {
    let js = 'for(var o=0;o<r.length;o++) { // @foo bar }',
        reversedJs = '} rab oof@ // { )++o;htgnel.r<o;0=o rav(rof',
        input = `<body>Hello<script>${reversedJs}</script><script>${js}</script></body>`,
        output = `<body>Hello<script>${js}</script><script>${reversedJs}</script></body>`,
        restored;

    it('should have restored to expected output', (done) => {
      let stream = processInline.extract('script');
      // It'll extract 2 scripts, so should be piped to the finish twice
      let count = 2;

      stream
        .pipe(through((file, enc, cb) => {
          file.contents = new Buffer(file.contents.toString().split('').reverse().join(''));
          cb(null, file);
        }))
        .pipe(processInline.restore())
        .pipe(through((file, enc, cb) => {
          cb();
          if (!--count) {
            assert.equal(file.contents.toString(), output);
            done();
          }
        }))

      let file = new File({
        contents: new Buffer(input)
      });

      stream.write(file);
    });

    it('should leave file untouched if selector not found', () => {
      let original = '<div>Hi</div>',
          promise;

      return extract(original, 'style')
        .then(file => {
          file.contents = new Buffer('nope');
          return file;
        })
        .then(restore)
        .then(file => file.contents.toString())
        .then(restored => {
          assert.equal(original, restored);
        });
    });
  });
});
