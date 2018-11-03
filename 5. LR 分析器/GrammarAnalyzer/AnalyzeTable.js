class Action
{
    /*
     * nextState: 移进后的状态，-1 代表 acc
     * reduceTokenNumber: 这次归约应该弹出几个符号
     * reduceTo: 这次归约后压入栈的符号
     * grammar: 这次归约使用的文法
     * errorProcessor: 错误处理函数
     * */
    constructor(type, nextStateNumber = -1, reduceTokenNumber = 0, reduceTo = '', grammar = '', errorType = -1)
    {
        this.type = type;
        this.nextStateNumber = nextStateNumber;
        this.reduceTo = reduceTo;
        this.reduceTokenNumber = reduceTokenNumber;
        this.grammar = grammar;
        this.errorType = errorType;
    }

    isReduce()
    {
        return this.type === Action.REDUCE;
    }

    isShift()
    {
        return this.type === Action.SHIFT;
    }

    getNextStateNumber()
    {
        return this.nextStateNumber;
    }

    getReduceTokenNumber()
    {
        return this.reduceTokenNumber;
    }

    getReduceTo()
    {
        return this.reduceTo;
    }

    getGrammar()
    {
        return this.grammar;
    }

    getErrorType()
    {
        return this.errorType;
    }
}

Action.SHIFT = 'SHIFT';
Action.REDUCE = 'REDUCE';
Action.ERROR = 'ERROR';
Action.ERROR_TYPE = {
    EXTRA_INPUT: 0,
    UNEXPECTED_END: 1,
    UNMATCHED_RIGHT_BRACKET: 2,
    MISSING_OPERAND: 2
};

const {SHIFT, REDUCE, ERROR} = Action;
const {EXTRA_INPUT, UNEXPECTED_END, UNMATCHED_RIGHT_BRACKET, MISSING_OPERAND} = Action.ERROR_TYPE;

const ActionTable = {
    0: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 4),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 5),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    1: {
        '+': new Action(SHIFT, 6),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(SHIFT, -1)
    },
    2: {
        '+': new Action(REDUCE, -1, 1, 'E', 'E->T'),
        '*': new Action(SHIFT, 7),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 1, 'E', 'E->T')
    },
    3: {
        '+': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '*': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 1, 'T', 'T->F')
    },
    4: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 11),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 12),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    5: {
        '+': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '*': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 1, 'F', 'F->id')
    },
    6: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 4),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 5),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    7: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 4),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 5),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    8: {
        '+': new Action(SHIFT, 16),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(SHIFT, 15),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    9: {
        '+': new Action(REDUCE, -1, 1, 'E', 'E->T'),
        '*': new Action(SHIFT, 17),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 1, 'E', 'E->T'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    10: {
        '+': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '*': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    11: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 11),
        ')': new Action(ERROR, -1, 0, '', '', UNMATCHED_RIGHT_BRACKET),
        'id': new Action(SHIFT, 12),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    12: {
        '+': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '*': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    13: {
        '+': new Action(REDUCE, -1, 3, 'E', 'E->E+T'),
        '*': new Action(SHIFT, 7),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 3, 'E', 'E->E+T')
    },
    14: {
        '+': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '*': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 3, 'T', 'T->T*F')
    },
    15: {
        '+': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '*': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(REDUCE, -1, 3, 'F', 'F->(E)')
    },
    16: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 11),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 12),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    17: {
        '+': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(SHIFT, 11),
        ')': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        'id': new Action(SHIFT, 12),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    18: {
        '+': new Action(SHIFT, 16),
        '*': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(SHIFT, 21),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    19: {
        '+': new Action(REDUCE, -1, 3, 'E', 'E->E+T'),
        '*': new Action(SHIFT, 17),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 3, 'E', 'E->E+T'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    20: {
        '+': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '*': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    },
    21: {
        '+': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '*': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '(': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        ')': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        'id': new Action(ERROR, -1, 0, '', '', EXTRA_INPUT),
        '#': new Action(ERROR, -1, 0, '', '', UNEXPECTED_END)
    }
};

const GotoTable = {
    0: {
        E: 1,
        T: 2,
        F: 3
    },
    4: {
        E: 8,
        T: 9,
        F: 10
    },
    6: {
        T: 13,
        F: 3
    },
    7: {
        F: 14
    },
    11: {
        E: 18,
        T: 9,
        F: 10
    },
    16: {
        T: 19,
        F: 10
    },
    17: {
        F: 20
    }
};

function getAction(stateNumber, terminal)
{
    return ActionTable[stateNumber][terminal];
}

function getGoto(stateNumber, nonTerminal)
{
    return GotoTable[stateNumber][nonTerminal];
}

module.exports = {
    getAction,
    getGoto,
    ERROR_TYPE: Action.ERROR_TYPE
};
