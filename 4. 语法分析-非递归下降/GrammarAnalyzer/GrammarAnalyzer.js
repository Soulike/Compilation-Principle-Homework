const {LexicalAnalyzer} = require('../LexicalAnalyzer');
const {isNonTerminal, table} = require('./GrammarInfo');

const tokenArray = Symbol('tokenArray');
const currentIndex = Symbol('currentIndex');
const analyzeProcess = Symbol('analyzeProcess');

const stack = Symbol('stack');
const push = Symbol('push');
const pop = Symbol('pop');
const getStackTop = Symbol('getStackTop');
const error = Symbol('error');
const skip = Symbol('skip');

const analyzeProcessAppend = Symbol('analyzeProcessAppend');
const analyze = Symbol('analyze');

class GrammarAnalyzer
{
    constructor(code)
    {
        this[tokenArray] = (new LexicalAnalyzer(code)).getTokenArray();
        this[analyzeProcess] = '';

        this[stack] = [];
        this[currentIndex] = 0;

        this[push]('#');
        this[push]('E');

        this[analyze]();
    }

    [push](arr)
    {
        this[stack].push(...arr);
    }

    [pop]()
    {
        return this[stack].pop();
    }

    [getStackTop]()
    {
        return this[stack][this[stack].length - 1];
    }

    [analyze]()
    {
        let stackTop = null;
        let tableContent = null;
        while (true)
        {
            stackTop = this[getStackTop]();
            if (this[currentIndex] >= this[tokenArray].length)
            {
                this[analyzeProcessAppend]('缺少结尾符号#');
                return;
            }
            if (isNonTerminal(stackTop))
            {
                tableContent = table[stackTop][(this[tokenArray][this[currentIndex]]).getValue()];

                if (tableContent === true) // 如果是个同步记号，直接弹出栈顶记号
                {
                    const token = this[pop]();
                    if ((this[tokenArray][this[currentIndex]]).getValue() === ')')
                    {
                        this[analyzeProcessAppend](`弹栈，弹出非终结符 ${token}，括号不匹配`);
                    }
                    else if (token === 'F')
                    {
                        this[analyzeProcessAppend](`弹栈，弹出非终结符 ${token}，用户少输入了一个 id`);
                    }
                    else
                    {
                        this[analyzeProcessAppend](`弹栈，弹出非终结符 ${token}`);
                    }
                }
                else // 如果不是同步记号
                {
                    if (tableContent === undefined) // 如果表是空的，抛弃当前输入记号
                    {
                        this[skip]((this[tokenArray][this[currentIndex]]).getValue());
                    }
                    else // 如果表不是空的，把表的内容入栈
                    {
                        const left = this[pop]();
                        this[push](tableContent);
                        const right = [...tableContent].reverse();

                        let str = '';
                        right.forEach(c =>
                        {
                            str += c;
                        });

                        this[analyzeProcessAppend](`${left}->${str ? str : 'ε'}`);
                    }
                }
            }
            else // 如果栈顶是个终结符
            {
                if (stackTop === '#') // 如果是结束符
                {
                    if (this[currentIndex] !== this[tokenArray].length - 1) // 输入指针指向的不是最后一个字符
                    {
                        if ((this[tokenArray][this[currentIndex]]).getValue() === '#') // 如果 # 不是最后一个，忽略后面的字符
                        {
                            this[analyzeProcessAppend]('忽略#之后的输入');
                        }
                        else // 如果还没到#，就跳过
                        {
                            this[skip]((this[tokenArray][this[currentIndex]]).getValue());
                        }
                    }
                    this[analyzeProcessAppend]('分析结束');
                    return;
                }
                else if (stackTop === (this[tokenArray][this[currentIndex]]).getValue()) // 如果栈顶与输入记号相同，就栈顶出栈，输入后移
                {
                    this[pop]();
                    this[currentIndex]++;
                }
                else // 如果栈顶与输入记号不同，弹出栈顶
                {
                    const token = this[pop]();
                    this[analyzeProcessAppend](`弹栈，弹出终结符 ${token}，用户少输入了一个 ${token}`);
                }
            }
        }
    }

    [error](msg)
    {
        console.error(msg);
    }

    [analyzeProcessAppend](str)
    {
        this[analyzeProcess] += `${str}\n`;
    }

    [skip](token)
    {
        this[analyzeProcessAppend](`输入串跳过记号 ${token}，用户多输入了一个 ${token}`);

        this[currentIndex]++;
    }


    getAnalyzeProcess()
    {
        return this[analyzeProcess];
    }
}

module.exports = {GrammarAnalyzer};
