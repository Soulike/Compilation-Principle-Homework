const {IDENTIFIERS} = require('./keywords');

class WordPair
{
    constructor(signal, value)
    {
        this.signal = signal;
        this.value = value;
    }

    printPair()
    {
        if (this.signal !== IDENTIFIERS.ID)
        {
            process.stdout.write(`(${this.signal}, ${this.value})`);
        }
        else
        {
            process.stdout.write(`(${this.signal}, \'${this.value}\')`);
        }

    }
}

module.exports = {
    WordPair
};
