function loadFile(url, done) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(){
        return done(null, this.responseText);
    };

    xhr.onerror = function(err){
        return done(err, this.responseText);
    };

    xhr.open("GET", url, true);
    xhr.send();
}

function renderLess(code, done) {
    var parser;

    if ('function' === typeof less.render) {
        less
            .render(code)
            .then(function (result) {
                done(null, result.css);
            })
            .catch(function (err) {
                done(err);
            });
    } else {
        parser = new (less.Parser);
        parser.parse(code, function (e, tree) {
            if (e) {
                return done(e);
            }

            done(null, tree.toCSS());
        });
    }
}

function renderLessWithLibrary(code, done) {
    loadFile('src/less/pixel-pattern.less', function (err, libcode) {
        renderLess(libcode + '\n' + code, done);
    });
}
