#!/usr/local/bin/node
const {KEYWORDS, OPERATORS, IDENTIFIERS, REGEX} = require('./keywords');
const {generateRegex, readFileAsync} = require('./functions');
const {WordPair} = require('./WordPair');
const {argv, exit} = process;
const {error} = console;
if (argv.length !== 3)
{
    error('参数数量错误。使用方法: main.js /code/file/path');
    exit(1);
}
const path = argv[2];
readFileAsync(path)
    .then(data =>
    {
        const words = data.toString().trim().split(/\s+/); // 使用空格分割代码
        const keywords = Object.keys(KEYWORDS); // 关键字列表
        const operators = Object.keys(OPERATORS); // 运算符列表
        // 把运算符从长到短排序，使正则表达式中长运算符在前优先匹配
        operators.sort((x, y) =>
        {
            return y.length - x.length;
        });
        const operatorRegex = generateRegex(operators);
        let processedWords = []; // 已经扫描到的词法单元
        // 从前到后，逐个单词扫描
        words.forEach(word =>
        {
            if (keywords.includes(word) || operators.includes(word)) // 如果这个单词是关键词或者运算符，就直接添加进已处理单词中
            {
                processedWords.push(word);
            }
            else // 其他情况，有可能是运算符与字面量之间没有空格分隔，使用运算符来分割
            {
                processedWords.push(...word.match(operatorRegex), ...(word.split(operatorRegex).filter(word =>
                {
                    return word.length !== 0;
                })));
            }
        });
        const {ID, NUM} = REGEX;
        const wordPairs = [];
        processedWords = [...new Set(processedWords)]; // 去重
        processedWords.forEach((word) =>
        {
            // 如果是关键字
            if (KEYWORDS[word] !== undefined)
            {
                wordPairs.push(new WordPair(KEYWORDS[word], word));
            }
            // 如果是运算符
            else if (OPERATORS[word] !== undefined)
            {
                wordPairs.push(new WordPair(OPERATORS[word], word));
            }
            // 如果是标识符
            else if (ID.test(word))
            {
                wordPairs.push(new WordPair(IDENTIFIERS.ID, word));
            }
            // 如果是数字
            else if (NUM.test(word))
            {
                wordPairs.push(new WordPair(IDENTIFIERS.NUM, word));
            }
            // 暂时不考虑出错情况
        });

        wordPairs.forEach(wordPair =>
        {
            wordPair.printPair();
        });
        exit(0);
    })
    .catch(err =>
    {
        error(`发生错误\n${err}`);
        exit(1);
    });
