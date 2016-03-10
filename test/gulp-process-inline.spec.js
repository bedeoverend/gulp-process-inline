var assert = require('assert');
var File = require('vinyl');
var processInline = require('..')();

function extract(input, selector, done) {
  var extractScript = processInline.extract('script'),
      fakeFile = new File({
        contents: new Buffer(input)
      });

  extractScript.write(fakeFile);

  extractScript.once('data', function(file) {
    // check the contents
    extracted = file.contents.toString();
    done(file);
  });
}

function restore(file, done) {
  var restore = processInline.restore();

  restore.once('data', function(file) {
    done(file);
  });

  restore.write(file);
}

describe('gulp-process-inline', function() {
  describe('extract and restore', function() {
    var js = 'for(var o=0;o<r.length;o++) { // @foo bar }',
        input = '<body>Hello<script>'+js+'</script></body>',
        extracted,
        restored;

    beforeEach(function(done) {
      extract(input, 'script', function(partial) {
        extracted = partial.contents.toString();
        restore(partial, function(file) {
          restored = file.contents.toString();
          done();
        });
      });
    });

    it('should have extracted the js script', function() {
      assert.equal(extracted, js);
    });

    it('should have restored back to the original input', function() {
      assert.equal(restored, input);
    });
  });
});
