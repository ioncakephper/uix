const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return /(^is|^has|^exists)/ig.test(columnHeader);
    }
}

module.exports = {
    Matcher,
}