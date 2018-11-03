const {LexicalAnalyzer} = require('../LexicalAnalyzer');
const {Element} = require('./Element');
const {getAction, getGoto} = require('./AnalyzeTable');

class GrammarAnalyzer
{
    constructor(code)
    {
        this.tokenArray = (new LexicalAnalyzer(code)).getTokenArray();
        this.currentTokenIndex = -1;
        this.analyzeProcess = '';
        this.stack = [];
        this.push(new Element(0, '#'));
        this.analyze();
    }

    analyze()
    {
        let token = this.getNextToken();
        while (true)
        {
            const tokenValue = token.getValue();
            const action = getAction(this.top().getStateNumber(), tokenValue);
            if (action.isShift())
            {
                if (action.getNextStateNumber() === -1)
                {
                    this.analyzeProcessAppend('分析成功');
                    return;
                }
                this.push(new Element(action.getNextStateNumber(), tokenValue));
                this.analyzeProcessAppend(`移进 ${tokenValue}`);
                token = this.getNextToken();
            }
            else if (action.isReduce())
            {
                const reduceTokenNumber = action.getReduceTokenNumber();
                this.multiplePop(reduceTokenNumber);
                const topStateNumber = this.top().getStateNumber();
                const nextStateNumber = getGoto(topStateNumber, action.getReduceTo());
                this.push(new Element(nextStateNumber, action.getReduceTo()));
                this.analyzeProcessAppend(`按照 ${action.getGrammar()} 归约`);
            }
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

    extraInputError(extraTerminal)
    {
        return () =>
        {
            this.analyzeProcessAppend(`错误: 多余的输入符号 ${extraTerminal}`);
            this.getNextToken();
        };
    }
}

module.exports = {GrammarAnalyzer};
