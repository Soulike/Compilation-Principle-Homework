const {GrammarSet} = require('./GrammarSet');

/*
 * 以下代码针对的文法
 * E->TE'
 * E'->+TE'|ε
 * T->FT'
 * T'->*FT'|ε
 * F->(E)|id
 * */


/*预测表。注意，若推出空串，则数组为空
 * 顺序已经预先倒置，因此直接分解push入数组即可
 * 如果是同步记号，则是一个布尔值 true
 * */
const table = {
    'E': {
        'id': ['E\'', 'T'],
        '(': ['E\'', 'T'],
        ')': true,
        '#': true
    },
    'E\'': {
        '+': ['E\'', 'T', '+'],
        ')': [],
        '#': []
    },
    'T': {
        'id': ['T\'', 'F'],
        '(': ['T\'', 'F'],
        '+': true,
        ')': true,
        '#': true
    },
    'T\'': {
        '+': [],
        '*': ['T\'', 'F', '*'],
        ')': [],
        '#': []
    },
    'F': {
        'id': ['id'],
        '+': true,
        '*': true,
        '(': [')', 'E', '('],
        ')': true,
        '#': true
    }
};

function isNonTerminal(token)
{
    const nonTerminals = Object.keys(table);
    return nonTerminals.includes(token);
}

function isTerminal(token)
{
    return !isNonTerminal(token);
}


function FIRST(nonTerminal)
{
    const {OPERATORS} = TOKEN_TYPES;
    switch (nonTerminal)
    {
        case 'E':
        {
            return new GrammarSet([OPERATORS['('], TOKEN_TYPES['id']]);
        }
        case 'E2':
        {
            return new GrammarSet([OPERATORS['+']]);
        }
        case 'T':
        {
            return new GrammarSet([OPERATORS['('], TOKEN_TYPES['id']]);
        }
        case 'T2':
        {
            return new GrammarSet([OPERATORS['*']]);
        }
        case 'F':
        {
            return new GrammarSet([OPERATORS['('], TOKEN_TYPES['id']]);
        }
        default:
        {
            return [];
        }
    }
}

function FOLLOW(nonTerminal)
{
    const {OPERATORS} = TOKEN_TYPES;
    switch (nonTerminal)
    {
        case 'E':
        {
            return new GrammarSet([OPERATORS[')'], OPERATORS['#']]);
        }
        case 'E2':
        {
            return new GrammarSet([OPERATORS[')'], OPERATORS['#']]);
        }
        case 'T':
        {
            return new GrammarSet([OPERATORS['+'], OPERATORS[')'], OPERATORS['#']]);
        }
        case 'T2':
        {
            return new GrammarSet([OPERATORS['+'], OPERATORS[')'], OPERATORS['#']]);
        }
        case 'F':
        {
            return new GrammarSet([OPERATORS['+'], OPERATORS['*'], OPERATORS[')'], OPERATORS['#']]);
        }
        default:
        {
            return [];
        }
    }
}

module.exports = {
    FIRST,
    FOLLOW,
    isNonTerminal,
    isTerminal,
    table
};


