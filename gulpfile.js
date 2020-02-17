var gulp        = require('gulp');
var gutil       = require('gulp-util');
var ts          = require("gulp-typescript");
var fs          = require('fs');
var ftp         = require( 'vinyl-ftp' );
var argv        = require('yargs').argv;
var jso         = require('gulp-javascript-obfuscator');
var branch      = argv.branch;
var project     = argv.project;
var commit      = argv.commit;
var mode        = argv.mode || "low";
var tsProject   = ts.createProject('tsconfig.json',
    {
        "files": [
            project + "/core/**/*.ts"
        ],
        "include": [
            project + "/def/**/*"
        ]
    }
);

gulp.task('version', function(cb){
    console.log("Project:"+project)
    console.log("Commit:"+commit)
    fs.writeFile(project+'/core/Version.ts', "module Core {export class Version {public readonly clientVersion:string = \""+commit+"\";}}", cb);
});

gulp.task('ts',['version'], function () {
    var options = {
            high:{
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
                debugProtection: true,
                debugProtectionInterval: true,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                renameGlobals: false,
                rotateStringArray: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: 'rc4',
                stringArrayThreshold: 1,
                transformObjectKeys: true,
                unicodeEscapeSequence: false
            },
            medium:{
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: false,
                debugProtectionInterval: false,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                renameGlobals: false,
                rotateStringArray: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: 'base64',
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                unicodeEscapeSequence: false
            },
            low: {
                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                debugProtectionInterval: false,
                disableConsoleOutput: false,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                renameGlobals: false,
                rotateStringArray: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: false,
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: false      
            }
    }

    
    if (mode && mode!="none") {
        return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(project+"/dist/js")).pipe(jso(options[mode])).pipe(gulp.dest(project+'/dist/js'));
    } 
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(project+"/dist/js"));
    
});



gulp.task("default", ['version','ts'],function () {

    var conn = ftp.create( {
        host: 'game.tech.spinmatic.net',
        user: 'production',
        pass: 'AP6TksUy',
        parallel: 10,
        log: gutil.log
    } );

    //whic files will be uploaded
    var globs = [
        project+'/assets/**',
        project+'/dist/**',
        project+'/libs/**',
        project+'/index.html',
        project+'/default.config'
    ];

    return gulp.src( globs, { base: project, buffer: false } )
        .pipe( conn.newer( "/production/"+project+"/"+branch+"/"+commit.substring(0, 7) ) )
        .pipe( conn.dest( "/production/"+project+"/"+branch+"/"+commit.substring(0, 7) ) );
});