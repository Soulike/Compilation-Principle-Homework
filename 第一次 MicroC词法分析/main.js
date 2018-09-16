#!/usr/local/bin/node
const {KEYWORDS, OPERATORS, IDENTIFIERS, REGEX} = require('./keywords');
const {generateRegex, readFileAsync} = require('./functions');
const {WordPair} = require('./WordPair');

const {argv, exit} = process;
const {error} = console;
if (argv.length !== 3)
{
    error('参数数量错误。使用方法: main /code/file/path');
    exit(1);
}

const path = argv[2];
readFileAsync(path)
    .then(data =>
    {
        const words = data.toString().trim().split(/\s+/);
        const keywords = Object.keys(KEYWORDS);

        const operators = Object.keys(OPERATORS);
        const oneCharacterOperators = operators.filter((operator) =>
        {
            return operator.length === 1;
        });
        const twoCharacterOperators = operators.filter((operator) =>
        {
            return operator.length === 2;
        });

        const oneCharacterOperatorRegex = generateRegex(oneCharacterOperators);
        const twoCharacterOperatorRegex = generateRegex(twoCharacterOperators);

        let processedWords = [];

        words.forEach(word =>
        {
            // 如果这个单词没有被处理过
            if (!processedWords.includes(word))
            {
                // 如果这个单词是关键词或者运算符，就直接添加进已处理单词中
                if (keywords.includes(word) || operators.includes(word))
                {
                    processedWords.push(word);
                }
                // 其他情况，有可能是运算符与字面量之间没有空格分隔
                else
                {
                    // 先得到单词中存在的所有双字符运算符
                    let operatorsInWord = word.match(twoCharacterOperatorRegex) || [];
                    // 将单词用双字符运算符拆分成更小的单词
                    const wordsWithoutTwoCharacterOperators = word.split(twoCharacterOperatorRegex);
                    // 遍历通过双字符运算符拆分的单词数组
                    wordsWithoutTwoCharacterOperators.forEach(splitWord =>
                    {
                        // 添加这个小单词中存在的单字符运算符
                        operatorsInWord = [...operatorsInWord, ...(splitWord.match(oneCharacterOperatorRegex) || [])];
                        // 把这个小单词中不含运算符的各部分添加到已处理单词中
                        processedWords.push(...splitWord.split(oneCharacterOperatorRegex));
                    });
                    // 把这些运算符添加到已处理单词中
                    processedWords.push(...operatorsInWord);
                }
            }
        });

        const {ID, NUM} = REGEX;
        const wordPairs = [];
        //对单词列表清除空白并去重
        processedWords = [...new Set(processedWords.filter((word =>
        {
            return word.length !== 0;
        })))];
        processedWords.forEach((word) =>
        {
            // 如果是关键字
            if (KEYWORDS[word])
            {
                wordPairs.push(new WordPair(KEYWORDS[word], word));
            }
            // 如果是运算符
            else if (OPERATORS[word])
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
        error(`文件读取发生错误\n${err}`);
    });
