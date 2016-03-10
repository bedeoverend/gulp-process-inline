var assert = require('assert');
var File = require('vinyl');
var processInline = require('..')();

function createFile(contents) {
  return
}

describe('gulp-process-inline', function() {
  describe('extract and restore', function() {
    var js = 'for(var o=0;o<r.length;o++) { // @foo bar }',
        input = '<body>Hello<script>'+js+'</script></body>',
        extracted,
        restored;

    beforeEach(function(done) {
      var extractScript = processInline.extract('script'),
          restore = processInline.restore(),
          fakeFile = new File({
            contents: new Buffer(input)
          });

      extractScript.write(fakeFile);

      extractScript.once('data', function(file) {
        // check the contents
        extracted = file.contents.toString();
        restore.write(file);
      });

      restore.once('data', function(file) {
        restored = file.contents.toString();
        done();
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
