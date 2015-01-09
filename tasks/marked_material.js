module.exports = function (grunt) {
    'use strict';

    var marked = require('marked'),
        fs = require('fs');

    function convertMdToHtml(md) {
        var renderer = new marked.Renderer(),

            originalCode = renderer.code,
            output,
            isFirstHeader = true;

        renderer.paragraph = function (text) {
            return '<p layout-margin>' + text + '</p>';
        };

        renderer.code = function (code, lang, escaped) {
            var html = originalCode.call(this, code, lang, escaped);

            return '<div layout-margin>' + html + '</div>';
        };

        renderer.heading = function (text, level) {
            var html = '';

            if (1 === level) {
                if (!isFirstHeader) {
                    html += '</md-whiteframe><md-divider></md-divider>';
                }

                isFirstHeader = false;

                html += '<md-whiteframe class="md-whiteframe-z1" layout="column">';
                html += '<md-toolbar class="md-hue-2">';
                html += '<h2 class="md-toolbar-tools">' + text + '</h2>';
                html += '</md-toolbar>';
                return html;
            }

            if (2 === level) {
                html += '<md-toolbar class="docs-toolbar">';
                html += '<h2 class="md-toolbar-tools">' + text + '</h2>';
                html += '</md-toolbar>';
                return html;
            }

            return '<h' + level + ' layout-margin>' + text + '</h' + level + '>';
        };

        marked.setOptions({
            renderer: renderer,
            highlight: function (code, lang) {
                return require('highlight.js').highlight(lang, code).value;
            },
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            smartLists: true,
            smartypants: false
        });

        output = marked(md);

        if (false === isFirstHeader) {
            output += '</md-whiteframe>';
        }
        return output;
    }

    grunt.registerMultiTask('marked-material', 'Convert markdown code to html for ngMaterial', function () {
        grunt.log.writeln('Converting markdown to html');

        var filesCount = 0;

        this.files.forEach(function (fileset) {
            var src = fileset.src,
                dest = fileset.dest,
                md;

            md = fs.readFileSync(src[0]).toString();
            fs.writeFileSync(dest, convertMdToHtml(md));

            grunt.log.ok(dest);
            filesCount = filesCount + 1;
        });

        grunt.log.writeln();
        grunt.log.write('Saved ');
        grunt.log.write(filesCount);
        grunt.log.write(' file(s).');
    });
};
