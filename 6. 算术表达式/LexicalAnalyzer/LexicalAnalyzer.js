const {Token} = require('./Token');
const {getTokenType} = require('./Functions');
const {TOKEN_REGEX} = require('./Regex');

// 私有变量 Symbol
const rowsArray = Symbol('rowsArray');
const currentRowNumber = Symbol('currentRowNumber');
const tokenArray = Symbol('tokenArray');

// 私有方法 Symbol
const splitToRows = Symbol('splitToRows');
const getNextRow = Symbol('getNextRow');
const analyze = Symbol('analyze');

class LexicalAnalyzer
{
    constructor(code)
    {
        this[rowsArray] = this[splitToRows](code);
        this[currentRowNumber] = -1;
        this[tokenArray] = [];
    }

    [splitToRows](str)
    {
        const rowSeparatorRegex = /\r\n|\n/;
        return str.split(rowSeparatorRegex);
    };

    [getNextRow]()
    {
        this[currentRowNumber]++;
        if (this[currentRowNumber] >= this[rowsArray].length)
        {
            return null;
        }
        else
        {
            return this[rowsArray][this[currentRowNumber]];
        }
    };

    [analyze]()
    {
        const {ID, OPERATOR, BLANK, NUMBER} = TOKEN_REGEX;
        let isNumberLastTime = false;
        let row = this[getNextRow]();
        let currentCol = 0;
        let matchResult = null;
        let token = '';

        while (row !== null)
        {
            while (row.length !== 0)
            {
                if ((matchResult = row.match(ID)) !== null)
                {
                    token = matchResult[0];
                    this[tokenArray].push(new Token(getTokenType('id'), token, this[currentRowNumber], currentCol + 1));
                }
                // 因为不可能两次都匹配到数字，因此设置一个标志位代表上次是不是匹配的数字
                else if ((matchResult = row.match(NUMBER)) !== null && isNumberLastTime === false)
                {
                    token = matchResult[0];
                    this[tokenArray].push(new Token(getTokenType('number'), token, this[currentRowNumber], currentCol + 1));
                    isNumberLastTime = true;
                }
                else if ((matchResult = row.match(OPERATOR)) !== null)
                {
                    token = matchResult[0];
                    this[tokenArray].push(new Token(getTokenType(token), token, this[currentRowNumber], currentCol + 1));
                    isNumberLastTime = false;
                }
                else if ((matchResult = row.match(BLANK)) !== null)
                {
                    token = matchResult[0];
                }
                else
                {
                    console.error(`Unexpected token ${row[0]} in row ${this[currentRowNumber] + 1} col ${currentCol + 1}`);
                    process.exit(1);
                }

                row = row.slice(token.length);
                currentCol += token.length;
                token = '';
                matchResult = null;
            }

            row = this[getNextRow]();
        }
    };

    getTokenArray()
    {
        this[analyze]();
        return this[tokenArray];
    };
}

module.exports = {
    LexicalAnalyzer
};
