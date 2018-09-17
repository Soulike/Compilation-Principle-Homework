class WordPair
{
    constructor(signal, value)
    {
        this.signal = signal;
        this.value = value;
    }

    printPair()
    {
        process.stdout.write(`(${this.signal}, ${this.value})`);
    };
}

module.exports = {
    WordPair
};
