var gulp = require('gulp');
var concat = require('gulp-concat');
var fs = require('fs');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
const path = require('path');


gulp.task('default', ["compile_php", "watch"]);

var module_data = {
    "path": "",
    "search_query": [
        "!api/modules/modules.php",
        "api/modules/**/*.php"
    ],
    "file": "modules.php"
};

gulp.task('watch', function() {
    gulp.watch(module_data.search_query, ['compile_php']);
});

gulp.task('compile_php', function() {

    var destination_file = "api/modules/" + module_data.file;

    return gulp.src(module_data.search_query)
        .pipe(replace('<?php', ''))
        .pipe(replace('?>', ''))
        .pipe(concat(destination_file))
        .pipe(insert.wrap('<?php', '?>'))
        .pipe(gulp.dest(""));
});
