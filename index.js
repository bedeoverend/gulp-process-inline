var through = require('through2').obj,
    cheerio = require('cheerio'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    PluginError = gutil.PluginError;

module.exports = function (opts) {
  opts = opts || {};
  var cheerioOpts = opts.cheerio || {};

  var extract = function(selector) {
    var i = 0;
    return through(function (file, encoding, done) {
      var that = this;

      if (file.isNull()) {
        return done(null, file);
      }

      if (file.isStream()) {
        return done(new PluginError('gulp-process-inline', 'Streaming not supported.'));
      }

      // Restore from files, or start a fresh
      var $ = file._inlineProcess && file._inlineProcess.$ || cheerio.load(file.contents.toString(), cheerioOpts),
          elements = $(selector),
          clone;

      if (elements.length === 0) {
        clone = file.clone();
        clone.contents = new Buffer('');

        clone._inlineProcess = {
          blank: true,
          source: file
        };

        done(null, clone);
      } else {
        elements.each(function() {
          var cache = file._inlineProcess || {},
              element = $(this),
              html = element.html();

          clone = file.clone();
          clone.contents = new Buffer(html);

          // Update cache
          cache.$ = $;
          cache.source = file;
          cache.element = element;

          // Set cache on clone in case its new
          clone._inlineProcess = cache;

          that.push(clone);
        });
        done();
      }
    });
  };

  var restore = function() {
    return through(function(file, encoding, done) {
      var cache = file._inlineProcess;

      if (!cache) {
        return done(new PluginError('gulp-process-inline', 'Extract must be run first'));
      }

      if (cache.blank) {
        done(null, cache.source);
      } else {
        // Restore from manipulated file
        cache.element.text(file.contents.toString());

        // Write back to intitial source file
        cache.source.contents = new Buffer(cache.$.html());

        // Return initial source file
        done(null, cache.source);
      }
    });
  };

  return {
    extract: extract,
    restore: restore
  };
};