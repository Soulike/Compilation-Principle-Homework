const {TOKEN_TYPES} = require('./TokenTypes');

const TOKEN_REGEX = {
    ID: /^[A-z_][A-z0-9_]*!/,
    OPERATOR: generateOperatorRegex(Object.keys(TOKEN_TYPES.OPERATORS)),
    BLANK: /^\s+/,
    NUMBER: /^[+\-]?(?:[0-9]+e-?[0-9]+)|^(?:-?[0-9]+(?:\.[0-9]+)?)/
};

module.exports = {
    TOKEN_REGEX
};

function generateOperatorRegex(patternArray)
{
    let regex = '^(';
    patternArray.forEach((pattern) =>
    {
        if (['+', '*', '?', '.', '(', ')', '[', ']', '{', '}', '|', '^', '$', '\\', '/'].includes(pattern)) // 特殊字符转义
        {
            regex += `\\${pattern}|`;
        }
        else
        {
            regex += `${pattern}|`;
        }

    });
    if (regex[regex.length - 1] === '|')
    {
        regex = regex.slice(0, -1);
        regex += ')';
    }
    return new RegExp(regex);
}
