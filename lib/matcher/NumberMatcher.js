const { BasicMatcher } = require('./BasicMather')

class Matcher extends BasicMatcher {
    matches(columnHeader) {
        return /(Amount|Value|Price)/ig.test(columnHeader);
    }
}

module.exports = {
    Matcher,
}