const {LexicalAnalyzer, TOKEN_TYPES} = require('../LexicalAnalyzer');
const {FIRST, FOLLOW} = require('./GrammarInfo');

const tokenArray = Symbol('tokenArray');
const analyzeProcess = Symbol('analyzeProcess');
const nextTokenIndex = Symbol('nextTokenIndex');
const nextToken = Symbol('nextToken');

const match = Symbol('match');
const analyzeProcessAppend = Symbol('analyzeProcessAppend');
const skip = Symbol('skip');
const error = Symbol('error');

const [E, E2, T, T2, F] = [Symbol('E'), Symbol('E2'), Symbol('T'), Symbol('T2'), Symbol('F')];

class GrammarAnalyzer
{
    constructor(code)
    {
        try
        {
            this[tokenArray] = (new LexicalAnalyzer(code)).getTokenArray();
            this[analyzeProcess] = '';
            this[nextTokenIndex] = 0;
            this[nextToken] = this[tokenArray][0];
            this[E]();

            // 正常情况下，最后应当剩下一个 # 作为结尾。如果最后没有 # 号，显示警告
            if (this[nextToken] === undefined)
            {
                this[error]('Missing \"#\" in the end');
            }
            // 或者递归都已经完成了最后剩下的不是 # ，那就要把除了 # 以外的符号显示为错误
            else if (this[nextToken].getValue() !== '#')
            {
                for (let i = this[nextTokenIndex]; i < this[tokenArray].length - 1; i++)
                {
                    this[skip](this[tokenArray][i].getValue(), this[tokenArray][i].getRow(), this[tokenArray][i].getCol());
                }
            }
            else
            {
                this[analyzeProcessAppend]('Grammar Analysis Succeeded');
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [analyzeProcessAppend](str)
    {
        this[analyzeProcess] += `${str}\n`;
    }

    [match](token)
    {
        if (this[tokenArray][this[nextTokenIndex]].getValue() === token)
        {
            this[nextToken] = this[tokenArray][++this[nextTokenIndex]];
        }
        else
        {
            this[skip](token.getValue(), token.getRow(), token.getCol());
        }
    }

    [E]()
    {
        try
        {
            if (this[nextToken] !== undefined)
            {
                // 确实在 E 的 FIRST 集合中，正常进行
                if (FIRST('E').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('E->TE\'');
                    this[T]();
                    this[E2]();
                }
                // 如果不在 E 的 FIRST 集合中，则跳过直到见到 FOLLOW 集合中的值
                else if (!FIRST('E').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                    this[E]();
                }
                // 见到 FOLLOW 集合里面的值，E 出栈
                else if (FOLLOW('E').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                }
                // 其他情况，直接把 E 出栈
                else
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                }
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [E2]()
    {
        try
        {
            if (this[nextToken] !== undefined)
            {
                // 如果在 FIRST 集里面
                if (FIRST('E2').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('E\'->+TE\'');
                    this[match]('+');
                    this[T]();
                    this[E2]();
                }
                // 如果是在 FOLLOW 集里面，则输出空串
                else if (FOLLOW('E2').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('E\'->ε');
                }
                // 剩下的情况，尝试跳过这个符号再匹配一次
                else
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                    this[E2]();
                }
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [T]()
    {
        try
        {
            if (this[nextToken] !== undefined)
            {
                // 确实在 T 的 FIRST 集合中，正常进行
                if (FIRST('T').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('T->FT\'');
                    this[F]();
                    this[T2]();
                }
                // 在递归中见到了结束符号，证明是意外的结尾，直接结束当前递归分析
                else if (this[nextToken].getValue() === '#')
                {
                    this[error]('Unexpected ending mark \"#\"');
                }
                // 如果不在 T 的 FIRST 集合中，则跳过直到见到 FOLLOW 集合中的值
                else if (!FIRST('T').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                    this[T]();
                }
                // 见到 FOLLOW 集合里面的值，T 出栈
                else if (FOLLOW('T').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                }
                // 其他情况，直接把 T 出栈
                else
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                }
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [T2]()
    {
        try
        {
            if (this[nextToken] !== undefined)
            {
                if (FIRST('T2').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('T\'->*FT\'');
                    this[match]('*');
                    this[F]();
                    this[T2]();
                }
                // 如果是在 FOLLOW 集里面，则输出空串
                else if (FOLLOW('T2').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('T\'->ε');
                }
                // 剩下的情况，尝试跳过这个符号再匹配一次
                else
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                    this[T2]();
                }
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [F]()
    {
        try
        {
            if (this[nextToken] !== undefined)
            {
                // 确实在 F 的 FIRST 集合中，正常进行
                if (FIRST('F').includes(this[nextToken]))
                {
                    if (this[nextToken].getValue() === '(')
                    {
                        this[analyzeProcessAppend]('F->(E)');
                        this[match]('(');
                        this[E]();
                        this[match](')');
                    }
                    else if (this[nextToken].getType() === TOKEN_TYPES.id)
                    {
                        this[analyzeProcessAppend]('F->id');
                        this[match](this[nextToken].getValue());
                    }
                }
                // 在递归中见到了结束符号，证明是意外的结尾，直接结束当前递归分析
                else if (this[nextToken].getValue() === '#')
                {
                    this[error]('Unexpected ending mark \"#\"');
                }
                // 如果不在 F 的 FIRST 集合中，则跳过直到见到 FOLLOW 集合中的值
                else if (!FIRST('F').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                    this[F]();
                }
                // 见到 FOLLOW 集合里面的值，F 出栈
                else if (FOLLOW('F').includes(this[nextToken]))
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                    this[match](this[nextToken].getValue());
                }
                // 其他情况，直接把 F 出栈
                else
                {
                    this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                }
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    // 发出一个警告，报告在哪里跳过了什么字符
    [skip](token, row, col)
    {
        this[analyzeProcessAppend](`Warning: Unexpected token \"${token}\" in row ${row}, col ${col}, skipping`);
    }

    // 报错
    [error](msg)
    {
        this[analyzeProcessAppend](`Error: ${msg}`);
    }

    getAnalyzeProcess()
    {
        return this[analyzeProcess];
    }
}

module.exports = {GrammarAnalyzer};
