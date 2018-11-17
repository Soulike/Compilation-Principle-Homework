const {LexicalAnalyzer, Token, Functions} = require('../LexicalAnalyzer');
const {Element} = require('./Element');
const {getAction, getGoto} = require('./AnalyzeTable');

class GrammarAnalyzer
{
    constructor(code)
    {
        const {getTokenType} = Functions;
        this.tokenArray = (new LexicalAnalyzer(code)).getTokenArray();

        // 如果第一个数是+或者-，就补一个 0
        if (this.tokenArray[0].getValue() === '+' || this.tokenArray[0].getValue() === '-')
        {
            this.tokenArray = [new Token(getTokenType('number'), 0, -1, -1), ...this.tokenArray];
        }

        this.currentTokenIndex = -1;
        this.analyzeProcess = '';
        this.stack = [];
        this.push(new Element(0, new Token(getTokenType('#'), '#', -1, -1)));
        this.analyze();
    }

    analyze()
    {
        let token = this.getNextToken();
        while (true)
        {
            if (token === undefined)
            {
                return;
            }
            const action = getAction(this.top().getStateNumber(), token.getType());
            if (action === undefined)
            {
                this.errorProcessor();
                return;
            }
            else if (action.isShift())
            {
                if (action.getNextStateNumber() === -1)
                {
                    //this.analyzeProcessAppend('分析成功');
                    this.analyzeProcessAppend(this.top().getToken().getValue());
                    return;
                }
                this.push(new Element(action.getNextStateNumber(), token));
                //this.analyzeProcessAppend(`移进 ${token.getValue()}`);
                token = this.getNextToken();
            }
            else if (action.isReduce())
            {
                const usingGrammarNumber = action.getUsingGrammarNumber();
                this.processReduce(action, usingGrammarNumber);
                const topStateNumber = this.top().getStateNumber();
                const nextStateNumber = getGoto(topStateNumber, action.getReduceToNonTerminalToken().getNonTerminal());
                this.push(new Element(nextStateNumber, action.getReduceToNonTerminalToken()));
                //this.analyzeProcessAppend(`按照 ${action.getUsingGrammar()} 归约`);
            }
        }
    }

    processReduce(action, usingGrammarNumber)
    {
        const stackTopIndex = this.stack.length - 1;
        if (usingGrammarNumber === 1)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex - 2].getToken().getValue()) + parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(3);
        }
        else if (usingGrammarNumber === 2)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex - 2].getToken().getValue()) - parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(3);
        }
        else if (usingGrammarNumber === 3)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(1);
        }
        else if (usingGrammarNumber === 4)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex - 2].getToken().getValue()) * parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(3);
        }
        else if (usingGrammarNumber === 5)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex - 2].getToken().getValue()) / parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(3);
        }
        else if (usingGrammarNumber === 6)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(1);
        }
        else if (usingGrammarNumber === 7)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex - 1].getToken().getValue()));
            this.multiplePop(3);
        }
        else if (usingGrammarNumber === 8)
        {
            action.getReduceToNonTerminalToken().setValue(parseFloat(this.stack[stackTopIndex].getToken().getValue()));
            this.multiplePop(1);
        }

    }

    getNextToken()
    {
        return this.tokenArray[++this.currentTokenIndex];
    }

    top()
    {
        return this.stack[this.stack.length - 1];
    }

    push(element)
    {
        this.stack.push(element);
    }

    pop()
    {
        return this.stack.pop();
    }

    multiplePop(number)
    {
        for (let i = 0; i < number; i++)
        {
            this.stack.pop();
        }
    }

    analyzeProcessAppend(str)
    {
        this.analyzeProcess += `${str}\n`;
    }

    getAnalyzeProcess()
    {
        return this.analyzeProcess;
    }

    errorProcessor()
    {
        this.analyzeProcessAppend('算式错误，请重新输入');
    }
}

module.exports = {GrammarAnalyzer};
