const {LexicalAnalyzer} = require('../LexicalAnalyzer');
const {Element} = require('./Element');
const {getAction, getGoto, getActionsForStateNumber, getGotoForStateNumber} = require('./AnalyzeTable');

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
            if (token === undefined)
            {
                return;
            }
            const tokenValue = token.getValue();
            const action = getAction(this.top().getStateNumber(), tokenValue);
            if (action === undefined)
            {
                this.errorProcessor();
                token = this.getNextToken();
            }
            else if (action.isShift())
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

    errorProcessor()
    {
        const token = this.tokenArray[this.currentTokenIndex];
        this.analyzeProcessAppend(`错误：在 ${token.getCol()} 列处 ${token.getValue()} 出现错误`);
        this.currentTokenIndex--;
        while (true) // 退栈循环
        {
            const topStateNumber = this.top().getStateNumber();// 查看栈顶状态
            const gotoForTopStateNumber = getGotoForStateNumber(topStateNumber);
            let hasGotValidToken = false;
            if (gotoForTopStateNumber !== undefined) // 如果栈顶状态有非终结符的转移
            {
                while (true) // 忽略输入符号循环
                {
                    const currentTokenValue = this.getNextToken().getValue();
                    if (currentTokenValue === '#') // 忽略到了结束符，那就结束错误恢复尝试
                    {
                        this.analyzeProcessAppend(`错误：意外的代码结尾`);
                        return;
                    }
                    for (const nonTerminal in gotoForTopStateNumber)
                    {
                        if (gotoForTopStateNumber.hasOwnProperty(nonTerminal))
                        {
                            const stateNumber = gotoForTopStateNumber[nonTerminal];
                            if (getAction(stateNumber, currentTokenValue) !== undefined) // 如果发现转移之后可以恢复正常分析
                            {
                                this.currentTokenIndex--;
                                this.push(new Element(stateNumber, nonTerminal));
                                hasGotValidToken = true; // 告知已经可以恢复正常分析
                                break;
                            }
                        }
                    }
                    if (hasGotValidToken) // 如果找到了可以继续分析的终结符，就跳出循环
                    {
                        break;
                    }
                    else // 否则，忽略这个输入
                    {
                        this.analyzeProcessAppend(`错误：跳过输入符号 ${currentTokenValue}`);
                    }
                }
                if (hasGotValidToken)
                {
                    break;
                }
            }
            else // 如果没有，就继续出栈
            {
                this.pop();
            }
        }
    }
}

module.exports = {GrammarAnalyzer};
