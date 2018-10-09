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

            // 正常情况下，最后应当剩下一个 # 作为结尾。如果没有见到 # 号就用完了所有 token，显示警告
            if (this[nextToken] === undefined)
            {
                this[error]('Missing \"#\" in the end');
            }
            // 如果最后不是只剩下 # 字符，那就应当报错
            else if (this[nextTokenIndex] !== this[tokenArray].length - 1)
            {
                for (let i = this[nextTokenIndex]; i < this[tokenArray].length; i++)
                {
                    if (this[tokenArray][i].getValue() !== '#')
                    {
                        this[skip](this[tokenArray][i].getValue(), this[tokenArray][i].getRow(), this[tokenArray][i].getCol());
                    }
                }
            }

            this[analyzeProcessAppend]('Grammar analysis finished');
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
        try
        {

            if (this[tokenArray][this[nextTokenIndex]] !== undefined)
            {
                // 正常情况下，match 函数不会见到结束符 #（因为递归结束后才会验证结束符），如果见到了就是异常
                if (this[tokenArray][this[nextTokenIndex]].getValue() === '#')
                {
                    this[error]('Unexpected ending mark \"#\"');
                }
                // 其他情况，检查预期符号与实际符号是否相符
                else if (this[tokenArray][this[nextTokenIndex]].getValue() === token)
                {
                    this[nextToken] = this[tokenArray][++this[nextTokenIndex]];
                }
                // 不相符，试着跳过这个符号并输出错误信息
                else
                {
                    this[skip](token.getValue(), token.getRow(), token.getCol());
                }
            }
            else // 正常情况下，match 函数不会见到 undefined。如果见到了，一定是输入不完整
            {
                this[error]('Uncompleted code');
            }
        }
        catch (e)
        {
            this[error](e);
        }
    }

    [E]()
    {
        try
        {
            if (this[nextToken].getValue() === '#')
            {
                this[match]('#');
            }
            else if (this[nextToken] !== undefined)
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
            if (this[nextToken].getValue() === '#')
            {
                this[match]('#');
            }
            else if (this[nextToken] !== undefined)
            {
                // 确实在 T 的 FIRST 集合中，正常进行
                if (FIRST('T').includes(this[nextToken]))
                {
                    this[analyzeProcessAppend]('T->FT\'');
                    this[F]();
                    this[T2]();
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
            if (this[nextToken].getValue() === '#')
            {
                this[match]('#');
            }
            else if (this[nextToken] !== undefined)
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
