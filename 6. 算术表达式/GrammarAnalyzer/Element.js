// 栈里实际放置的元素
// stateNumber 是状态号，token 可以是终结符 token 对象也可以是非终结符 token 对象
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
