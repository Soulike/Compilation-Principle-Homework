class Action
{
    /*
     * nextState: 移进后的状态，-1 代表 acc
     * reduceTokenNumber: 这次归约应该弹出几个符号
     * reduceTo: 这次归约后压入栈的符号
     * grammar: 这次归约使用的文法
     * errorProcessor: 错误处理函数
     * */
    constructor(type, nextStateNumber = -1, reduceTokenNumber = 0, reduceTo = '', grammar = '')
    {
        this.type = type;
        this.nextStateNumber = nextStateNumber;
        this.reduceTo = reduceTo;
        this.reduceTokenNumber = reduceTokenNumber;
        this.grammar = grammar;
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
}

Action.SHIFT = 'SHIFT';
Action.REDUCE = 'REDUCE';

const {SHIFT, REDUCE} = Action;
const ActionTable = {
    0: {

        '(': new Action(SHIFT, 4),

        'id': new Action(SHIFT, 5)

    },
    1: {
        '+': new Action(SHIFT, 6),
        '#': new Action(SHIFT, -1)
    },
    2: {
        '+': new Action(REDUCE, -1, 1, 'E', 'E->T'),
        '*': new Action(SHIFT, 7),
        '#': new Action(REDUCE, -1, 1, 'E', 'E->T')
    },
    3: {
        '+': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '*': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '#': new Action(REDUCE, -1, 1, 'T', 'T->F')
    },
    4: {
        '(': new Action(SHIFT, 11),
        'id': new Action(SHIFT, 12)
    },
    5: {
        '+': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '*': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '#': new Action(REDUCE, -1, 1, 'F', 'F->id')
    },
    6: {
        '(': new Action(SHIFT, 4),
        'id': new Action(SHIFT, 5)
    },
    7: {
        '(': new Action(SHIFT, 4),
        'id': new Action(SHIFT, 5)
    },
    8: {
        '+': new Action(SHIFT, 16),
        ')': new Action(SHIFT, 15)
    },
    9: {
        '+': new Action(REDUCE, -1, 1, 'E', 'E->T'),
        '*': new Action(SHIFT, 17),
        ')': new Action(REDUCE, -1, 1, 'E', 'E->T')
    },
    10: {
        '+': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        '*': new Action(REDUCE, -1, 1, 'T', 'T->F'),
        ')': new Action(REDUCE, -1, 1, 'T', 'T->F')
    },
    11: {
        '(': new Action(SHIFT, 11),
        'id': new Action(SHIFT, 12)
    },
    12: {
        '+': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        '*': new Action(REDUCE, -1, 1, 'F', 'F->id'),
        ')': new Action(REDUCE, -1, 1, 'F', 'F->id')
    },
    13: {
        '+': new Action(REDUCE, -1, 3, 'E', 'E->E+T'),
        '*': new Action(SHIFT, 7),
        '#': new Action(REDUCE, -1, 3, 'E', 'E->E+T')
    },
    14: {
        '+': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '*': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '#': new Action(REDUCE, -1, 3, 'T', 'T->T*F')
    },
    15: {
        '+': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '*': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '#': new Action(REDUCE, -1, 3, 'F', 'F->(E)')
    },
    16: {
        '(': new Action(SHIFT, 11),
        'id': new Action(SHIFT, 12)
    },
    17: {
        '(': new Action(SHIFT, 11),
        'id': new Action(SHIFT, 12)
    },
    18: {
        '+': new Action(SHIFT, 16),
        ')': new Action(SHIFT, 21)
    },
    19: {
        '+': new Action(REDUCE, -1, 3, 'E', 'E->E+T'),
        '*': new Action(SHIFT, 17),
        ')': new Action(REDUCE, -1, 3, 'E', 'E->E+T')
    },
    20: {
        '+': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        '*': new Action(REDUCE, -1, 3, 'T', 'T->T*F'),
        ')': new Action(REDUCE, -1, 3, 'T', 'T->T*F')
    },
    21: {
        '+': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        '*': new Action(REDUCE, -1, 3, 'F', 'F->(E)'),
        ')': new Action(REDUCE, -1, 3, 'F', 'F->(E)')
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

function getActionsForStateNumber(stateNumber)
{
    return ActionTable[stateNumber];
}

function getGoto(stateNumber, nonTerminal)
{
    return GotoTable[stateNumber][nonTerminal];
}

function getGotoForStateNumber(stateNumber)
{
    return GotoTable[stateNumber];
}

module.exports = {
    getAction,
    getGoto,
    getActionsForStateNumber,
    getGotoForStateNumber
};
