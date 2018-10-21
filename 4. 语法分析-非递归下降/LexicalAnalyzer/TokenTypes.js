const TOKEN_TYPES = {
    OPERATORS:
        {
            '*': 1,
            '+': 2,
            '(': 3,
            ')': 4,
            '#': 5
        },
    'id': 6,
    'number': 7
};

function getTokenType(token)
{
    return TOKEN_TYPES[token] ? TOKEN_TYPES[token] : TOKEN_TYPES.OPERATORS[token];
}

module.exports = {
    getTokenType,
    TOKEN_TYPES
};
