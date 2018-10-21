const _tokenTypeArray = Symbol('tokenTypeArray');

class GrammarSet
{
    constructor(tokenTypeArray)
    {
        this[_tokenTypeArray] = tokenTypeArray;
    }

    includes(token)
    {
        return this[_tokenTypeArray].includes(token.getType());
    }
}

module.exports = {
    GrammarSet
};
