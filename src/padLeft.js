function padLeft(input, pad, char) {
    "use strict";

    return new Array(pad - input.length + 1).join(char) + input;
}
