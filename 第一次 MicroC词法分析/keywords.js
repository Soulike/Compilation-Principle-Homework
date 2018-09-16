const OPERATORS = {
    '#': 0,
    '+': 13,
    '-': 14,
    '*': 15,
    '/': 16,
    ':': 17,
    ':=': 18,
    '<': 20,
    '<>': 21,
    '<=': 22,
    '>': 23,
    '>=': 24,
    '=': 25,
    ';': 26,
    '(': 27,
    ')': 28
};

const KEYWORDS = {
    'for': 1,
    'if': 2,
    'then': 3,
    'else': 4,
    'while': 5,
    'do': 6,
    'until': 29,
    'int': 30,
    'input': 31,
    'output': 32
};

const IDENTIFIERS = {
    ID: 10,
    NUM: 11
};

const REGEX = {
    ID: /^[A-z][A-z0-9]*$/,
    NUM: /^[0-9]+$/
};

module.exports = {
    OPERATORS,
    KEYWORDS,
    IDENTIFIERS,
    REGEX
};

