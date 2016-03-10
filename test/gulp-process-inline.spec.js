'use strict';

const assert = require('assert');
const File = require('vinyl');
const processInline = require('..')();

function extract(input, selector) {
  return new Promise((resolve) => {
    let extractScript = processInline.extract('script'),
        fakeFile = new File({
          contents: new Buffer(input)
        });

    extractScript.write(fakeFile);

    extractScript.once('data', (file) => {
      resolve(file);
    });
  });
}

function restore(file, done) {
  return new Promise(resolve => {
    let restore = processInline.restore();

    restore.once('data', (file) => {
      resolve(file);
    });

    restore.write(file);
  });
}

describe('gulp-process-inline', () => {
  describe('extract and restore', () => {
    let js = 'for(var o=0;o<r.length;o++) { // @foo bar }',
        input = `<body>Hello<script>${js}</script></body>`,
        extracted,
        restored;

    beforeEach(() => {
      return extract(input, 'script')
        .then(partial => {
          extracted = partial.contents.toString();
          return partial;
        })
        .then(restore)
        .then(file => {
          restored = file.contents.toString()
        });
    });

    it('should have extracted the js script', () => {
      assert.equal(extracted, js);
    });

    it('should have restored back to the original input', () => {
      assert.equal(restored, input);
    });
  });
});
