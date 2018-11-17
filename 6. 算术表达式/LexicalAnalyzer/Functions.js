const {TOKEN_TYPES} = require('./TokenTypes');

function getTokenType(token)
{
    return TOKEN_TYPES[token] ? TOKEN_TYPES[token] : TOKEN_TYPES.OPERATORS[token];
}


module.exports = {
    getTokenType
};
