const {LexicalAnalyzer} = require('./LexicalAnalyzer');

const analyzer = new LexicalAnalyzer('11+222+233+4');

console.log(analyzer.getTokenArray());
