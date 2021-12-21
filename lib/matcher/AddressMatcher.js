const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return /(Address|Location)/ig.test(columnHeader);
    }
}

module.exports = {
    Matcher,
}