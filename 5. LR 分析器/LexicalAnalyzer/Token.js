const _type = Symbol('type');
const _value = Symbol('value');
const _row = Symbol('row');
const _col = Symbol('col');

class Token
{
    constructor(type, value, row, col)
    {
        this[_type] = type;
        this[_value] = value;
        this[_row] = row;
        this[_col] = col;
    }

    getType()
    {
        return this[_type];
    };

    getValue()
    {
        return this[_value];
    };

    getRow()
    {
        return this[_row];
    };

    getCol()
    {
        return this[_col];
    };
}

module.exports = {
    Token
};
