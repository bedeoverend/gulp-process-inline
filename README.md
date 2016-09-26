# Gulp Process Inline
[![][npm-badge]][npm-url] [![][travis-badge]][travis-url] [![][npmdeps-badge]][npmdeps-url] [![][npmdevdeps-badge]][npmdevdeps-url]

Process sections of HTML files (eg: scripts, styles) directly inline with Gulp.

## Installation
Install `gulp-process-inline` with NPM
```bash
npm install --save-dev gulp-process-inline
```

## Usage
`gulp-process-inline` takes a HTML selector, pulls its content out into a stream that you pipe to other Gulp plugins, then writes the transformed content back to HTML.

To use it just call `.extract()` with the HTML selector you want, then call `.restore()` when you want to write the contents back to HTML. Every instance of the selector in a given file will be iterated over and processed.

```js
var gulp = require('gulp');
var processInline = require('gulp-process-inline');

gulp.task('scripts', function() {
  return gulp.src('./src/index.html')
    .pipe(processInline().extract('script'))
      // Pipe other gulp plugins here
      // eg: .pipe(uglify())
    .pipe(processInline().restore())
    .pipe(gulp.dest('./dist'));
});
```

## License

MIT © Bede Overend


[npm-badge]: https://img.shields.io/npm/v/gulp-process-inline.svg
[npm-url]: https://npmjs.org/package/gulp-process-inline
[travis-badge]: https://img.shields.io/travis/bedeoverend/gulp-process-inline.svg
[travis-url]: https://travis-ci.org/bedeoverend/gulp-process-inline
[npmdeps-badge]: https://img.shields.io/david/bedeoverend/gulp-process-inline.svg
[npmdeps-url]: https://david-dm.org/bedeoverend/gulp-process-inline
[npmdevdeps-badge]: https://img.shields.io/david/dev/bedeoverend/gulp-process-inline.svg?theme=shields.io
[npmdevdeps-url]: https://david-dm.org/bedeoverend/gulp-process-inline#info=devDependencies
