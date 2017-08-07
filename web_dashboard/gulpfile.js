var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var obfuscate = require('gulp-obfuscate');
var jsonConcat = require('gulp-json-concat');
var browserSync = require('browser-sync');
var tap = require('gulp-tap');
var fs = require('fs');
const path = require('path');


gulp.task('default', ['watch', 'angular_js']);

var paths = {
    "root": "app/",
    "assets_js": "app/assets/"
};

// var components = {
//     "path": "",
//     "search_query": "app/components/**/*.js",
//     "file": "components.js",
//     "destination": "app/components.js"
// };

var assets = {
    "path": "",
    "search_query": [
        "!app/assets/js/vendor.js",
        "app/assets/**/*.js"
    ],
    "file": "vendor.js",
    "destination": "app/assets/js/vendor.js"
};

var style = {
    "path": "",
    "search_query": [
        "!app/assets/css/style.css",
        "app/assets/**/*.css"
    ],
    "file": "style.css",
    "destination": "app/assets/css/style.css"
};

var lang = {
    "search_query": "app/components/**/*Lang.json"
};

var angular = {
    "path": "",
    "search_query": [
        "app/angular/**/*.js",
        "app/modules/**/*.js"
    ],
    "destination": "app/app.js"
};

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: ["app"],
            index: "index.html"
        },
        browser: "google chrome canary"
    });

    console.log('=== server started ===>');
    // gulp.watch('app/**/*').on('change', browserSync.reload);
});

gulp.task('watch', function() {
    gulp.watch(angular.search_query, ['angular_js']);
    // gulp.watch([components.search_query, "app/assets/js/translate.js"], ['compile_components_js']);
    // gulp.watch(assets.search_query, ['compile_assets_js']);
    // gulp.watch(style.search_query, ['compile_assets_css']);
    // gulp.watch(lang.search_query, ['lang']);
});

gulp.task('angular_js', function() {
    fs.exists(angular.destination, function(exists) {
        if (exists) {
            fs.truncate(angular.destination, 0, function() {});
        }
    });

    return gulp.src(angular.search_query)
        .pipe(concat(angular.destination))
        .pipe(gulp.dest(angular.path));
        // .pipe(gulp.dest(bower.path))
        // .pipe(uglify())
});

gulp.task('compile_assets_js', function() {

    fs.exists(assets.destination, function(exists) {
        if (exists) {
            fs.truncate(assets.destination, 0, function() {});
        }
    });

    return gulp.src([
            "app/assets/vendor/modernizr/modernizr.js",
            "app/assets/vendor/breakpoints/breakpoints.js",
            "app/assets/vendor/jquery/jquery.js",
            "app/assets/js/jquery.formatter.js",
            "app/assets/vendor/bootstrap/bootstrap.js",
            "app/assets/vendor/animsition/jquery.animsition.js",
            "app/assets/vendor/asscroll/jquery-asScroll.js",
            "app/assets/vendor/mousewheel/jquery.mousewheel.js",
            "app/assets/vendor/asscrollable/jquery.asScrollable.all.js",
            "app/assets/vendor/ashoverscroll/jquery-asHoverScroll.js",
            "app/assets/vendor/switchery/switchery.min.js",
            "app/assets/vendor/intro-js/intro.js",
            "app/assets/vendor/screenfull/screenfull.js",
            "app/assets/vendor/slidepanel/jquery-slidePanel.js",
            "app/assets/vendor/jquery-placeholder/jquery.placeholder.js",
            "app/assets/js/plugins/sweetalert.js",
            "app/assets/js/core.js",
            "app/assets/js/site.js",
            "app/assets/js/sections/menu.js",
            "app/assets/js/sections/menubar.js",
            "app/assets/js/sections/sidebar.js",
            "app/assets/js/configs/config-colors.js",
            "app/assets/js/configs/config-tour.js",
            "app/assets/js/components/asscrollable.js",
            "app/assets/js/components/animsition.js",
            "app/assets/js/components/slidepanel.js",
            "app/assets/js/components/switchery.js",
            "app/assets/js/components/jquery-placeholder.js",
            "app/assets/js/components/datatables.js",
            "app/assets/vendor/datatables/jquery.dataTables.min.js",
            "app/assets/vendor/datatables-tabletools/dataTables.tableTools.js",
            "app/assets/js/plugins/xlsx.full.min.js",
            "app/assets/angular/angular.min.js",
            "app/assets/angular/angular-route.min.js",
            "app/assets/angular/angular-ui-router.min.js",
            "app/assets/angular/ui-bootstrap-2.2.0.min.js",
            "app/assets/vendor/bootstrap-datepicker/bootstrap-datepicker.js",
            "app/assets/vendor/typeahead-js/bloodhound.min.js",
            "app/assets/vendor/typeahead-js/typeahead.jquery.min.js",
            "app/assets/angular/ng-file-upload.min.js",
            "app/assets/vendor/select2/select2.js",
            "app/assets/js/format.js",
            "app/assets/js/translate.js",
            "bower_components/angular-aria/angular-aria.js",
            "bower_components/angular-animate/angular-animate.min.js",
            "node_modules/ng-table/bundles/ng-table.js",
            "bower_components/angular-datatables/dist/angular-datatables.js",
            "bower_components/angular-resource/angular-resource.js",
            "app/assets/js/sly/core.js",
            "app/assets/js/sly/scalyr.js",
            "app/assets/js/sly/slyEvaluate.js",
            "app/assets/js/sly/slyRepeat.js",
            "bower_components/alertify.js/lib/alertify.min.js",
            "bower_components/ng-alertify/dist/ng-alertify.js",
            "bower_components/angular-material/angular-material.js",
            "bower_components/angular-bootstrap/ui-bootstrap.js",
            "bower_components/formatter.js/dist/formatter.js",
            "bower_components/angular-input-masks/angular-input-masks-standalone.js"
        ])
        .pipe(concat(assets.destination))
        // .pipe(gulp.dest(assets.path))
        // .pipe(uglify())
        .pipe(gulp.dest(assets.path));
});

gulp.task('compile_assets_css', function() {

    fs.exists(style.destination, function(exists) {
        if (exists) {
            fs.truncate(style.destination, 0, function() {});
        }
    });

    return gulp.src([
            "app/assets/css/bootstrap.min.css",
            "app/assets/css/bootstrap-extend.min.css",
            "app/assets/css/site.min.css",
            "app/assets/css/pages/errors.css",
            "app/assets/fonts/brand-icons/brand-icons.min.css",
            "app/assets/vendor/animsition/animsition.css",
            "app/assets/vendor/asscrollable/asScrollable.css",
            "app/assets/vendor/switchery/switchery.css",
            "app/assets/vendor/intro-js/introjs.css",
            "app/assets/vendor/slidepanel/slidePanel.css",
            "app/assets/vendor/flag-icon-css/flag-icon.css",
            "app/assets/fonts/brand-icons/brand-icons.min.css",
            "app/assets/css/apps/documents.css",
            "app/assets/vendor/bootstrap-datepicker/bootstrap-datepicker.css",
            "app/assets/css/custom.css",
            "app/assets/css/plugins/sweetalert.css",
            "app/assets/vendor/typeahead-js/typeahead.css",
            "app/assets/vendor/select2/select2.css",
            "bower_components/angular-material/angular-material.css",
            "node_modules/ng-table/bundles/ng-table.css",
            "bower_components/angular-datatables/dist/css/angular-datatables.css",
            "bower_components/alertify.js/themes/alertify.bootstrap.css",
            "bower_components/ng-alertify/dist/ng-alertify.css"
        ])
        .pipe(concat(style.destination))
        .pipe(gulp.dest(style.path));
});

// gulp.task('lang', function() {
//     var file_key = "";
//     return gulp.src(lang.search_query)
//         .pipe(tap(function(file, t) {
//             file_key = path.basename(file.path, "Lang" + path.extname(file.path));
//         }))
//         .pipe(jsonConcat("lang.json", function(data) {
//             var translation_json = {};
//             var current_name_key = "";
//
//             for (var key in data) {
//                 current_name_key = key.split("/")[0];
//                 for (var trans_key in data[key]) {
//                     if (typeof(translation_json[trans_key]) === "undefined") {
//                         translation_json[trans_key] = {};
//                     }
//                     for (var lang_key in data[key][trans_key]) {
//                         translation_json[trans_key][current_name_key + "_" + lang_key] = data[key][trans_key][lang_key];
//                     }
//                 }
//             }
//
//             return new Buffer(JSON.stringify(translation_json));
//         }))
//         .pipe(gulp.dest("app/"));
// });
