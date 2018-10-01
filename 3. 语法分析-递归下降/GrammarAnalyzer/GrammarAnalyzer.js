const {LexicalAnalyzer, TOKEN_TYPES} = require('../LexicalAnalyzer');

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
        this[tokenArray] = (new LexicalAnalyzer(code)).getTokenArray();
        this[analyzeProcess] = '';
        this[nextTokenIndex] = 0;
        this[nextToken] = this[tokenArray][0];
        this[E]();
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
        if (this[nextToken] !== undefined)
        {
            // 确实在 E 的 FIRST 集合中，正常进行
            if (this[nextToken].getValue() === '(' || this[nextToken].getType() === TOKEN_TYPES.id)
            {
                this[analyzeProcessAppend]('E->TE\'');
                this[T]();
                this[E2]();
            }
            // 如果不在 E 的 FIRST 集合中，则跳过直到见到 FOLLOW 集合中的值
            else if (this[nextToken].getValue() !== '(' && this[nextToken].getType() !== TOKEN_TYPES.id)
            {
                this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                this[match](this[nextToken].getValue());
                this[E]();
            }
            // 见到 FOLLOW 集合里面的值，E 出栈
            else if (this[nextToken].getValue() === ')' || this[nextToken].getValue() === '#')
            {
                this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                this[match](this[nextToken].getValue());
            }
            // 其他情况，直接把 E 出栈
            else
            {
                this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
            }

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
        }
    }

    [E2]()
    {
        // 如果在 FIRST 集里面
        if (this[nextToken] !== undefined && this[nextToken].getValue() === '+')
        {
            this[analyzeProcessAppend]('E\'->+TE\'');
            this[match]('+');
            this[T]();
            this[E2]();
        }
        // 如果是在 FOLLOW 集里面，则输出空串
        else if (this[nextToken].getValue() === ')' || this[nextToken].getValue() === '#')
        {
            this[analyzeProcessAppend]('E\'->ε');
        }
        // 剩下的情况，尝试跳过这个符号再匹配一次
        else if (this[nextToken] !== undefined)
        {
            this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
            this[match](this[nextToken].getValue());
            this[E2]();
        }
    }

    [T]()
    {
        if (this[nextToken] !== undefined)
        {
            // 确实在 T 的 FIRST 集合中，正常进行
            if (this[nextToken].getValue() === '(' || this[nextToken].getType() === TOKEN_TYPES.id)
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
            else if (this[nextToken].getValue() !== '(' && this[nextToken].getType() !== TOKEN_TYPES.id)
            {
                this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                this[match](this[nextToken].getValue());
                this[T]();
            }
            // 见到 FOLLOW 集合里面的值，T 出栈
            else if (this[nextToken].getValue() === '+' || this[nextToken].getValue() === ')' || this[nextToken].getValue() === '#')
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

    [T2]()
    {
        if (this[nextToken] !== undefined && this[nextToken].getValue() === '*')
        {
            this[analyzeProcessAppend]('T\'->*FT\'');
            this[match]('*');
            this[F]();
            this[T2]();
        }
        // 如果是在 FOLLOW 集里面，则输出空串
        else if (this[nextToken].getValue() === '+' || this[nextToken].getValue() === ')' || this[nextToken].getValue() === '#')
        {
            this[analyzeProcessAppend]('T\'->ε');
        }
        // 剩下的情况，尝试跳过这个符号再匹配一次
        else if (this[nextToken] !== undefined)
        {
            this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
            this[match](this[nextToken].getValue());
            this[T2]();
        }
    }

    [F]()
    {
        if (this[nextToken] !== undefined)
        {
            // 确实在 F 的 FIRST 集合中，正常进行
            if (this[nextToken].getValue() === '(' || this[nextToken].getType() === TOKEN_TYPES.id)
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
            else if (this[nextToken].getValue() !== '(' && this[nextToken].getType() !== TOKEN_TYPES.id)
            {
                this[skip](this[nextToken].getValue(), this[nextToken].getRow(), this[nextToken].getCol());
                this[match](this[nextToken].getValue());
                this[F]();
            }
            // 见到 FOLLOW 集合里面的值，F 出栈
            else if (this[nextToken].getValue() === '+' || this[nextToken].getValue() === '*' || this[nextToken].getValue() === ')' || this[nextToken].getValue() === '#')
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

    [skip](token, row, col)
    {
        this[analyzeProcessAppend](`Error: Unexpected token \"${token}\" in row ${row}, col ${col}, skipping`);
    }

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
