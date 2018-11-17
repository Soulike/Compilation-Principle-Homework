#!/usr/local/bin/node
const readline = require('readline');
const {GrammarAnalyzer} = require('./GrammarAnalyzer');

let code = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 1.16+2*(3.53-7)/1e2
rl.question('Input your code. End with #:\n', (answer) =>
{
    code = answer + '#';
    const analyzer = new GrammarAnalyzer(code);
    console.log(analyzer.getAnalyzeProcess());
    rl.close();
    process.exit(0);
});
