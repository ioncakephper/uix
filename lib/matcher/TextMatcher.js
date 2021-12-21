const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return false;
    }
}

module.exports = {
    Matcher,
}