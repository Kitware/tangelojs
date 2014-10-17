/*jslint browser: true */

// Export a global module.
window.tangelo = {};

(function (tangelo) {
    "use strict";

    // Tangelo version number.
    tangelo.version = function () {
        var version = "0.7.0-dev";
        return version;
    };

    // The location of the API root.
    tangelo.apiRoot = "/api";

    // An "in-band" error, one that the application can recover from (possibly
    // by displaying an error message and asking the user to try again, etc.).
    tangelo.error = function (code, message, jqxhr) {
        var error = {};

        error.code = code;

        if (!message || tangelo.isObject(message)) {
            if (!jqxhr) {
                jqxhr = message;
            }
            message = tangelo.error.string(code);
        }

        error.message = message;

        if (jqxhr) {
            error.jqxhr = jqxhr;
        }

        return error;
    };
    tangelo.error.message = [];
    tangelo.error.string = function (code) {
        return tangelo.error.message[code] || "unrecognized error, code " + code;
    };
    tangelo.error.AJAX_FAILURE = 0;
    tangelo.error.APPLICATION_ERROR = 1;
    tangelo.error.message[tangelo.error.AJAX_FAILURE] = "ajax failure";
    tangelo.error.message[tangelo.error.APPLICATION_ERROR] = "application error";

    // An error bad enough to halt execution of the problem.
    tangelo.fatalError = function (module, msg) {
        if (msg === undefined) {
            msg = module;
            throw new Error(msg);
        }

        throw new Error("[" + module + "] " + msg);
    };

    // A function that generates an error-generating function, to be used for
    // missing dependencies (Google Maps API, JQuery UI, etc.).
    tangelo.unavailable = function (cfg) {
        var plugin = cfg.plugin,
            required = cfg.required,
            i,
            t;

        if (Object.prototype.toString.call(required) === "[object Array]") {
            if (required.length === 1) {
                required = required[0];
            } else if (required.length === 2) {
                required = required[0] + " and " + required[1];
            } else {
                t = "";
                for (i = 0; i < required.length - 1; i += 1) {
                    t += required[i] + ", ";
                }
                t += "and " + required[required.length - 1];

                required = t;
            }
        }

        return function () {
            tangelo.fatalError("JavaScript include error: " + plugin + " requires " + required);
        };
    };

    // Check for the required version number.
    tangelo.requireCompatibleVersion = function (reqvstr) {
        var reqv,
            tanv,
            compatible,
            parse;

        // This function parses out the structure of a version string.
        //
        // Major version 0 version numbers contain only two parts: 0.MINOR
        //
        // Major version 1 version numbers contain three parts:
        // MAJOR.MINOR.PATCH
        //
        // Any version number may also have a trailing hyphen followed by one or
        // more non-space, non-hyphen characters: 0.MINOR-TAG, or
        // MAJOR.MINOR.PATCH-TAG
        //
        // The minor and patch numbers may be omitted; they will be filled in
        // with 0s as appropriate.
        //
        // Negative numbers and non-number strings are not allowed in the
        // version number components.
        parse = function (s) {
            var parts,
                ver,
                tag,
                i,
                components;

            parts = s.split("-");
            if (parts.length > 1) {
                ver = parts.slice(0, -1).join("-");
                tag = parts.slice(-1)[0];
            } else {
                ver = parts[0];
                tag = parts[1];
            }

            if (!ver) {
                return null;
            }

            if (tag !== undefined && (tag.length === 0 || tag.indexOf(" ") !== -1)) {
                return null;
            }

            ver = ver.split(".").map(function (x) {
                return Number(x);
            });

            if (ver.length === 0) {
                return null;
            }

            for (i = 0; i < ver.length; i += 1) {
                if (isNaN(ver[i]) || ver[i] < 0) {
                    return null;
                }
            }

            components = ver[0] === 0 ? 2 : 3;
            if (ver.length > components) {
                return null;
            }

            for (i = ver.length; i < components; i += 1) {
                ver[i] = 0;
            }

            return {
                version: ver,
                tag: tag
            };
        };

        // Parse out the structures of the required version string, and the
        // current Tangelo version string.
        reqv = parse(reqvstr);
        tanv = parse(tangelo.version());

        // If either of them fails to parse, raise a fatal error.
        if (!tanv) {
            tangelo.fatalError("tangelo.requireCompatibleVersion()", "tangelo version number is invalid: " + tangelo.version());
        } else if (!reqv) {
            tangelo.fatalError("tangelo.requireCompatibleVersion()", "invalid version string: " + reqvstr);
        }

        // Run the compatibility rules.
        if (reqv.tag || tanv.tag || reqv.version[0] === 0 || tanv.version[0] === 0) {
            // If either version has a tag, or if the major version is 0, then
            // the versions must match exactly.
            compatible = reqv.tag === tanv.tag &&
                         reqv.version[0] === tanv.version[0] &&
                         reqv.version[1] === tanv.version[1] &&
                         reqv.version[2] === tanv.version[2];
        } else {
            // If there are no tags, and the major version is greater than 0,
            // then the major versions MUST match, and the required minor
            // version MUST be at most the Tangelo minor version.  If the minor
            // versions are equal, then the required patch level MUST be at most
            // the Tangelo patch level.
            compatible = reqv.version[0] === tanv.version[0] &&
                         (reqv.version[1] < tanv.version[1] || (reqv.version[1] === tanv.version[1] && reqv.version[2] <= tanv.version[2]));
        }

        return compatible;
    };
}(window.tangelo));
