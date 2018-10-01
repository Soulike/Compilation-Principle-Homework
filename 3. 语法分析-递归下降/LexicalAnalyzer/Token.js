class Token
{
    constructor(type, value, row, col)
    {
        this.type = type;
        this.value = value;
        this.row = row;
        this.col = col;
    }

    getType()
    {
        return this.type;
    };

    getValue()
    {
        return this.value;
    };

    getRow()
    {
        return this.row;
    };

    getCol()
    {
        return this.col;
    };
}

module.exports = {
    Token
};
