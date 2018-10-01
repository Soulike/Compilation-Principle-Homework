#!/usr/local/bin/node
const {GrammarAnalyzer} = require('./GrammarAnalyzer');

const code = 'id**id+id)#';

const analyzer = new GrammarAnalyzer(code);

console.log(analyzer.getAnalyzeProcess());
