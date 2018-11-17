const TOKEN_TYPES = {
    OPERATORS:
        {
            '+': 0,
            '-': 1,
            '*': 2,
            '/': 3,
            '(': 4,
            ')': 5,
            '#': 6
        },
    'id': 7,
    'number': 8
};

function getTokenType(token)
{
    return TOKEN_TYPES[token] ? TOKEN_TYPES[token] : TOKEN_TYPES.OPERATORS[token];
}

module.exports = {
    getTokenType,
    TOKEN_TYPES
};
