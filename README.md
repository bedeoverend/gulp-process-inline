# gulp-process-inline

## Installation

```bash
npm install gulp-process-inline
```

## Usage

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var processInline = require('gulp-process-inline');

gulp.task('uglify-inline', function() {
  var processor = processInline();
  return gulp.src('./src/*.html')
    .pipe(processor.extract('script'))
    .pipe(uglify())
    .pipe(processor.restore())
    .pipe(gulp.dest('./dest'));
});
```
