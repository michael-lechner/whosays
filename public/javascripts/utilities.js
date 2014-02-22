if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

function map(items, f) {
        var output = [];
        for(var i=0, len=items.length; i<len; i++) {
                output.push(f(items[i]));
        }
        return output;
}

function filter(items, f) {
        var output = [];
        for(var i=0, len=items.length; i<len; i++) {
                if(f(items[i])) {
                        output.push(items[i]);
                }
        }
        return output;
}

/*inclusive
*/
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var letterCapitalize = function(str, delim){
        var strArray = str.split(' ');

        for(var i = 0; i < strArray.length; i++){
                strArray[i] = strArray[i].charAt(0).toUpperCase() + strArray[i].substring(1);
        }

        return strArray.join(delim);
}

