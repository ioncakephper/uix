const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return /(Email)/ig.test(columnHeader);
    }
}

module.exports = {
    Matcher,
}