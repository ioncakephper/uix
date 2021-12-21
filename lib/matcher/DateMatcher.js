const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return /(Date)/ig.test(columnHeader);
    }
}

module.exports = {
    Matcher,
}