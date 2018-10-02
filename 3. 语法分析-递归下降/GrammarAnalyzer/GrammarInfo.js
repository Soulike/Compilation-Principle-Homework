const {GrammarSet} = require('./GrammarSet');
const {TOKEN_TYPES} = require('../LexicalAnalyzer');

/*
 * 以下代码针对的文法
 * E->TE'
 * E'->+TE'|ε
 * T->FT'
 * T'->*FT'|ε
 * F->(E)|id
 * */

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
    FOLLOW
};


