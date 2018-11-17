class NonTerminalToken
{
    constructor(nonTerminal, value = 0)
    {
        this.nonTerminal = nonTerminal;
        this.value = value;
    }

    getNonTerminal()
    {
        return this.nonTerminal;
    }

    getValue()
    {
        return this.value;
    }

    setValue(value)
    {
        this.value = value;
    }
}

module.exports = {
    NonTerminalToken
};
