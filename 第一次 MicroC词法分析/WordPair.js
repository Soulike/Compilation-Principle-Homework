class WordPair
{
    constructor(signal, value)
    {
        this.signal = signal;
        this.value = value;
    }

    printPair()
    {
        console.log(`(${this.signal}, ${this.value})`);
    };
}

module.exports = {
    WordPair
};
