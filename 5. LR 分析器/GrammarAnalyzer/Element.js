class Element
{
    constructor(stateNumber, token)
    {
        this.stateNumber = stateNumber;
        this.token = token;
    }

    getStateNumber()
    {
        return this.stateNumber;
    }

    getToken()
    {
        return this.token;
    }

}

module.exports = {Element};
