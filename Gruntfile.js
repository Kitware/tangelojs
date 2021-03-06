/*jshint node:true*/
/*global module:false*/
module.exports = function (grunt) {
    "use strict";

    var fs = require("fs"),
        devopts;

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON("package.json"),
        banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
          "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
          "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" +
          "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" +
          " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n",
        // Task configuration.
        prompt: {
            devopts: {
                options: {
                    questions: [
                        {
                            config: "tangeloPath",
                            type: "input",
                            message: "Tangelo command?",
                            default: "tangelo"
                        },

                        {
                            config: "tangeloPort",
                            type: "input",
                            message: "Tangelo port?",
                            default: "8080"
                        }
                    ]
                }
            }
        },
        version: {
            src: [
                "lib/core/core.js",
                "test/tangelo-version.js"
            ]
        },
        cleanup: {
            dist: ["dist"],
            dev: ["node_modules"],
            devopts: ["devopts.json"]
        },
        concat: {
            options: {
                banner: "<%= banner %>",
                stripBanners: true
            },
            dist: {
                src: ["lib/**/*.js"],
                dest: "dist/<%= pkg.name %>.js"
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
            },
            dist: {
                src: "<%= concat.dist.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        },
        jshint: {
            options: {
                // Enforcing options (for strict checking, should be true by
                // default; set to false indicates departure from this policy).
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noempty: false,
                nonbsp: true,
                nonew: true,
                plusplus: false,
                quotmark: "double",
                undef: true,
                unused: true,
                strict: true,
                maxparams: false,
                maxdepth: false,
                maxstatements: false,
                maxcomplexity: false,
                maxlen: false,

                // Relaxing options (for strict checking, should be false by
                // default; set to true indicates departure from this policy).
                eqnull: true,

                // Environment options.
                browser: true,

                // Globals.
                globals: {
                    console: false
                }
            },
            gruntfile: {
                src: "Gruntfile.js"
            },
            tangelo: {
                src: ["lib/**/*.js"]
            },
            test: {
                options: {
                    globals: {
                        QUnit: false,
                        tangelo: false
                    }
                },
                src: ["test/**/*.js"]
            }
        },
        jscs: {
            options: {
                requireCurlyBraces: true,
                requireSpaceAfterKeywords: true,
                requireSpaceBeforeBlockStatements: true,
                requireParenthesesAroundIIFE: true,
                requireSpacesInConditionalExpression: true,
                requireSpacesInAnonymousFunctionExpression: {
                    beforeOpeningRoundBrace: true,
                    beforeOpeningCurlyBrace: true
                },
                requireSpacesInNamedFunctionExpression: {
                    beforeOpeningCurlyBrace: true
                },
                requireSpacesInFunctionDeclaration: {
                    beforeOpeningCurlyBrace: true
                },
                requireMultipleVarDecl: true,
                requireBlocksOnNewline: true,
                disallowPaddingNewlinesInBlocks: true,
                disallowEmptyBlocks: true,
                disallowQuotedKeysInObjects: true,
                disallowSpaceAfterObjectKeys: true,
                requireSpaceBeforeObjectValues: true,
                requireCommaBeforeLineBreak: true,
                requireOperatorBeforeLineBreak: true,
                disallowSpaceAfterPrefixUnaryOperators: true,
                disallowSpaceBeforePostfixUnaryOperators: true,
                disallowImplicitTypeConversion: ["numeric", "boolean", "binary", "string"],
                disallowMultipleLineStrings: true,
                disallowMultipleLineBreaks: true,
                disallowMixedSpacesAndTabs: true,
                disallowTrailingWhitespace: true,
                disallowTrailingComma: true,
                disallowKeywordsOnNewLine: ["else if", "else"],
                requireLineFeedAtFileEnd: true,
                requireCapitalizedConstructors: true,
                requireDotNotation: true,
                requireSpaceAfterLineComment: true,
                disallowNewlineBeforeBlockStatements: true,
                validateLineBreaks: "LF",
                validateIndentation: 4,
                validateParameterSeparator: ", ",
                safeContextKeyword: ["that"]
            },
            gruntfile: {
                src: ["Gruntfile.js"]
            },
            tangelo: {
                src: ["lib/**/*.js"]
            },
            test: {
                src: ["test/**/*.js"]
            }
        },
        genhtml: {
            files: ["test/**/*.js"]
        },
        copy: {
            testjs: {
                expand: true,
                cwd: "test/",
                src: "**/*.js",
                dest: "dist/test/"
            }
        },
        qunit: {
            options: {
                httpBase: null
            },
            files: ["dist/test/**/*.html"]
        },
        watch: {
            gruntfile: {
                files: "<%= jshint.gruntfile.src %>",
                tasks: ["jshint:gruntfile", "jscs:gruntfile"]
            },
            tangelo: {
                files: "<%= jshint.lib_test.src %>",
                tasks: ["jshint:lib", "jscs:lib", "test"]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-continue");
    grunt.loadNpmTasks("grunt-prompt");
    grunt.loadNpmTasks("grunt-version");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // Default task.
    grunt.registerTask("default", ["devopts", "jshint", "jscs", "build"]);

    // Build task.
    grunt.registerTask("build", "Build tangelo.js and tangelo.min.js", ["version", "concat", "uglify"]);

    // Build tasks to support testing.
    grunt.registerMultiTask("genhtml", "Generate HTML files for QUnit tests", function () {
        var name,
            config;

        this.filesSrc.forEach(function (v) {
            // Extract the name of the test suite, e.g., test/alpha.js -> alpha.
            name = v.split("/")[1]
                .split(".")[0];

            // Build a jade task config.  The assignment below is so we can have a
            // dynamic key based on the name of the test.
            config = {
                files: {},
                options: {
                    client: false,
                    data: {
                        title: "Test case - " + name,
                        script: name + ".js"
                    }
                }
            };
            config.files["dist/test/" + name + ".html"] = "jade/qunitHarness.jade";

            // Add a jade task keyed to the test suite.
            grunt.config(["jade", name], config);
        });

        // Schedule the jade task so the actual tests are generated.
        grunt.task.run("jade");
    });

    // Tangelo launch/kill task.
    (function () {
        var tangelo = null,
            stopping,
            output = [];

        grunt.registerTask("tangelo", "Starts/stops a Tangelo server instance.", function (op) {
            var done,
                cmdline,
                fragment = null;

            if (op === "start") {
                if (tangelo) {
                    grunt.fail.warn("Tangelo is running already.");
                }

                stopping = false;

                done = this.async();

                cmdline = {
                    cmd: devopts.tangeloPath,
                    args: [
                        "--port", devopts.tangeloPort,
                        "--root", "."
                    ]
                };

                console.log("Starting Tangelo server with: " + cmdline.cmd + " " + cmdline.args.join(" "));
                tangelo = grunt.util.spawn(cmdline, function () {});
                if (!tangelo) {
                    grunt.fail.fatal("Could not launch Tangelo");
                }

                tangelo.stderr.setEncoding("utf8");

                tangelo.stderr.on("data", function (chunk) {
                    var complete = chunk.slice(-1) === "\n",
                        lines,
                        i,
                        n;

                    if (fragment) {
                        chunk = fragment + chunk;
                        fragment = null;
                    }

                    lines = chunk.split("\n");
                    n = complete ? lines.length : lines.length - 1;
                    for (i = 0; i < n; i++) {
                        if (!stopping && lines[i].indexOf("ENGINE Bus STARTED") !== -1) {
                            console.log("Tangelo started with PID " + tangelo.pid);
                            done();
                        }

                        output.push(lines[i]);
                    }

                    if (!complete) {
                        fragment = lines[lines.length - 1];
                    }
                });

                tangelo.stderr.on("end", function () {
                    if (stopping) {
                        return;
                    }
                    grunt.fail.fatal("Tangelo could not be started\n" + output.join("\n"));
                });
            } else if (op === "stop") {
                if (!tangelo) {
                    grunt.fail.warn("Tangelo is not running");
                }

                stopping = true;
                done = this.async();

                tangelo.kill();

                tangelo.stderr.on("end", function () {
                    done();
                });

                setTimeout(function () {
                    grunt.fail.warn("Could not kill Tangelo\n" + output.join("\n"));
                }, 10000);
            } else {
                grunt.fail.warn("Unknown argument: '" + op + "'");
            }
        });
    }());

    // Test task.  Ensure we have devopts, start the Tangelo server, run the
    // tests, then shut the server down.
    grunt.registerTask("test", [
        "devopts",
        "genhtml",
        "copy",
        "tangelo:start",
        "continueOn",
        "qunit",
        "continueOff",
        "tangelo:stop"
    ]);

    // Developer options task.
    grunt.registerTask("devopts", "Read developer options from devopts.json, or create it if it doesn't exist", function () {
        var text;

        try {
            text = fs.readFileSync("devopts.json", {encoding: "utf8"});
            devopts = JSON.parse(text);
        } catch (e) {
            grunt.task.run("gendevopts");
            grunt.task.run("devopts");
            return;
        }

        grunt.config(["qunit", "options"], {
            httpBase: "http://localhost:" + devopts.tangeloPort
        });
    });

    grunt.registerTask("gendevopts", "Write developer options out to disk", function () {
        var text;

        // If there is no config, then schedule the prompt task, followed by a
        // retry of the current task, then bail.
        if (!grunt.config("tangeloPath")) {
            grunt.task.run("prompt:devopts");
            grunt.task.run("gendevopts");
            return;
        }

        // Build a devopts object from the config values.
        text = JSON.stringify({
            tangeloPath: grunt.config("tangeloPath"),
            tangeloPort: parseInt(grunt.config("tangeloPort"))
        }, null, 4) + "\n";

        // Serialize it to disk.
        try {
            fs.writeFileSync("devopts.json", text);
        } catch (e) {
            grunt.fail.warn("Could not write devopts.json\n" + e);
        }
    });

    // Clean task.  To prevent "grunt clean" from deleting the node_modules
    // directory (as it would by default), we're renaming the task to "cleanup",
    // then installing a better behaved default "clean" task.
    grunt.renameTask("clean", "cleanup");
    grunt.registerTask("clean", ["clean:dist"]);
    grunt.registerTask("clean:dist", ["cleanup:dist"]);
    grunt.registerTask("clean:dev", ["cleanup:dev"]);
    grunt.registerTask("clean:devopts", ["cleanup:devopts"]);
    grunt.registerTask("clean:all", ["clean:dist", "clean:dev", "clean:devopts"]);
};
