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
        const {ID, NUM} = REGEX;
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
            else // 其他情况，有可能是运算符与字面量之间没有空格分隔
            {
                const identifiers = [...(word.match(operatorRegex) || []), ...(word.split(operatorRegex).filter(word =>
                {
                    return word.length !== 0;
                }))];
                // 按照源代码中的正确顺序，进行排序
                const sortedIdentifiers = []; // 经过正确排序的标识符列表
                const identifierLastIndex = {}; // 特定标识符最后出现的位置
                // 看看这个各个标识符在原字符串的什么位置，安放在数组的对应位置以保证顺序
                identifiers.forEach(identifier =>
                {
                    identifierLastIndex[identifier] = word.indexOf(identifier, identifierLastIndex[identifier] + 1 || 0);
                    sortedIdentifiers[identifierLastIndex[identifier]] = identifier;
                });
                // 因为双字符运算符可能导致 undefined，所以删除所有 undefined
                processedWords.push(...(sortedIdentifiers).filter((identifier) =>
                {
                    return identifier !== undefined;
                }));
            }
        });
        const wordPairs = [];
        processedWords.forEach((word) =>
        {
            if (KEYWORDS[word] !== undefined) // 如果是关键字
            {
                wordPairs.push(new WordPair(KEYWORDS[word], word));
            }
            else if (OPERATORS[word] !== undefined) // 如果是运算符
            {
                wordPairs.push(new WordPair(OPERATORS[word], word));
            }
            else if (ID.test(word)) // 如果是标识符
            {
                wordPairs.push(new WordPair(IDENTIFIERS.ID, word));
            }
            else if (NUM.test(word)) // 如果是数字
            {
                wordPairs.push(new WordPair(IDENTIFIERS.NUM, word));
            }
            // 暂时不考虑出错情况
        });

        wordPairs.forEach(wordPair =>
        {
            wordPair.printPair();
        });
    })
    .catch(err =>
    {
        error(`发生错误\n${err}`);
        exit(1);
    });
