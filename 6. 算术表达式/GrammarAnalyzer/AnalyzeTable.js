const {Functions} = require('../LexicalAnalyzer');
const {NonTerminalToken} = require('./NonTerminalToken');

class Action
{
    /*
     * nextStateNumber: 移进后的状态，-1 代表 acc
     * poppedTokensAmount: 这次归约应该弹出几个符号
     * reduceToNonTerminalToken: 这次归约后压入栈的符号
     * usingGrammarNumber: 这次归约使用的文法编号
     * usingGrammar: 这次归约使用的文法
     * */
    constructor(type, nextStateNumber = -1, poppedTokensAmount = 0, reduceToNonTerminalToken = '', usingGrammarNumber = -1, usingGrammar = '')
    {
        this.type = type;
        this.nextStateNumber = nextStateNumber;
        this.reduceToNonTerminalToken = reduceToNonTerminalToken;
        this.poppedTokensAmount = poppedTokensAmount;
        this.usingGrammarNumber = usingGrammarNumber;
        this.usingGrammar = usingGrammar;
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

    getReduceToNonTerminalToken()
    {
        return this.reduceToNonTerminalToken;
    }

    getUsingGrammarNumber()
    {
        return this.usingGrammarNumber;
    }

    getPoppedTokensAmount()
    {
        return this.poppedTokensAmount;
    }

    getUsingGrammar()
    {
        return this.usingGrammar;
    }
}

Action.SHIFT = 'SHIFT';
Action.REDUCE = 'REDUCE';

/*
 L->En
 E->E+T
 E->E-T
 E->T
 T->T*F
 T->T/F
 T->F
 F->(E)
 F->id

 +	-	*	/	(	)	id	$		E	T	F
 0					s4		s5			1	2	3
 1	s6	s7						acc
 2	r3	r3	s8	s9				r3
 3	r6	r6	r6	r6				r6
 4					s13		s14			10	11	12
 5	r8	r8	r8	r8				r8
 6					s4		s5				15	3
 7					s4		s5				16	3
 8					s4		s5					17
 9					s4		s5					18
 10	s20	s21				s19
 11	r3	r3	s22	s23		r3
 12	r6	r6	r6	r6		r6
 13					s13		s14			24	25	26
 14	r8	r8	r8	r8		r8
 15	r1	r1	s8	s9				r1
 16	r2	r2	s8	s9				r2
 17	r4	r4	r4	r4				r4
 18	r5	r5	r5	r5				r5
 19	r7	r7	r7	r7				r7
 20					s13		s14				27	26
 21					s13		s14				28	26
 22					s13		s14					29
 23					s13		s14					30
 24	s20	s21				s31
 25	r3	r3	s22	s23		r3
 26	r6	r6	r6	r6		r6
 27	r1	r1	s22	s23		r1
 28	r2	r2	s22	s23		r2
 29	r4	r4	r4	r4		r4
 30	r5	r5	r5	r5		r5
 * */

const {SHIFT, REDUCE} = Action;
const {getTokenType} = Functions;
const ActionTable = {
    0: {
        [getTokenType('(')]: new Action(SHIFT, 4),
        [getTokenType('number')]: new Action(SHIFT, 5)
    },
    1: {
        [getTokenType('+')]: new Action(SHIFT, 6),
        [getTokenType('-')]: new Action(SHIFT, 7),
        [getTokenType('#')]: new Action(SHIFT, -1)
    },
    2: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('*')]: new Action(SHIFT, 8),
        [getTokenType('/')]: new Action(SHIFT, 9),
        [getTokenType('#')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T')
    },
    3: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('#')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F')
    },
    4: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    5: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('*')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('/')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('#')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id')
    },
    6: {
        [getTokenType('(')]: new Action(SHIFT, 4),
        [getTokenType('number')]: new Action(SHIFT, 5)
    },
    7: {
        [getTokenType('(')]: new Action(SHIFT, 4),
        [getTokenType('number')]: new Action(SHIFT, 5)
    },
    8: {
        [getTokenType('(')]: new Action(SHIFT, 4),
        [getTokenType('number')]: new Action(SHIFT, 5)
    },
    9: {
        [getTokenType('(')]: new Action(SHIFT, 4),
        [getTokenType('number')]: new Action(SHIFT, 5)
    },
    10: {
        [getTokenType('+')]: new Action(SHIFT, 20),
        [getTokenType('-')]: new Action(SHIFT, 21),
        [getTokenType(')')]: new Action(SHIFT, 19)
    },
    11: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('*')]: new Action(SHIFT, 22),
        [getTokenType('/')]: new Action(SHIFT, 23),
        [getTokenType(')')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T')
    },
    12: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType(')')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F')
    },
    13: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    14: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('*')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType('/')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id'),
        [getTokenType(')')]: new Action(REDUCE, -1, 1, new NonTerminalToken('F'), 8, 'F->id')
    },
    15: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T'),
        [getTokenType('*')]: new Action(SHIFT, 8),
        [getTokenType('/')]: new Action(SHIFT, 9),
        [getTokenType('#')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T')
    },
    16: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T'),
        [getTokenType('*')]: new Action(SHIFT, 8),
        [getTokenType('/')]: new Action(SHIFT, 9),
        [getTokenType('#')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T')
    },
    17: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('#')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F')
    },
    18: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('#')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F')
    },
    19: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('#')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)')
    },
    20: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    21: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    22: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    23: {
        [getTokenType('(')]: new Action(SHIFT, 13),
        [getTokenType('number')]: new Action(SHIFT, 14)
    },
    24: {
        [getTokenType('+')]: new Action(SHIFT, 20),
        [getTokenType('-')]: new Action(SHIFT, 21),
        [getTokenType(')')]: new Action(SHIFT, 31)
    },
    25: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T'),
        [getTokenType('*')]: new Action(SHIFT, 22),
        [getTokenType('/')]: new Action(SHIFT, 23),
        [getTokenType(')')]: new Action(REDUCE, -1, 1, new NonTerminalToken('E'), 3, 'E->T')
    },
    26: {
        [getTokenType('+')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F'),
        [getTokenType(')')]: new Action(REDUCE, -1, 1, new NonTerminalToken('T'), 6, 'T->F')
    },
    27: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T'),
        [getTokenType('*')]: new Action(SHIFT, 22),
        [getTokenType('/')]: new Action(SHIFT, 23),
        [getTokenType(')')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 1, 'E->E+T')
    },
    28: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T'),
        [getTokenType('*')]: new Action(SHIFT, 22),
        [getTokenType('/')]: new Action(SHIFT, 23),
        [getTokenType(')')]: new Action(REDUCE, -1, 3, new NonTerminalToken('E'), 2, 'E->E-T')
    },
    29: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F'),
        [getTokenType(')')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 4, 'T->T*F')
    },
    30: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F'),
        [getTokenType(')')]: new Action(REDUCE, -1, 3, new NonTerminalToken('T'), 5, 'T->T/F')
    },
    31: {
        [getTokenType('+')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('-')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('*')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType('/')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)'),
        [getTokenType(')')]: new Action(REDUCE, -1, 3, new NonTerminalToken('F'), 7, 'F->(E)')
    }
};

const GotoTable = {
    0: {
        E: 1,
        T: 2,
        F: 3
    },
    4: {
        E: 10,
        T: 11,
        F: 12
    },
    6: {
        T: 15,
        F: 3
    },
    7: {
        T: 16,
        F: 3
    },
    8: {
        F: 17
    },
    9: {
        F: 18
    },
    13: {
        E: 24,
        T: 25,
        F: 26
    },
    20: {
        T: 27,
        F: 26
    },
    21: {
        T: 28,
        F: 26
    },
    22: {
        F: 29
    },
    23: {
        F: 30
    }
};

function getAction(stateNumber, terminalToken)
{
    return ActionTable[stateNumber][terminalToken];
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
