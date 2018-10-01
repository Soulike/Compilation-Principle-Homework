%{
#include <stdlib.h>
#include <stdio.h>
#define STUDENT_NUM 201692020
#define NAME "周敬尧"
int letterNum = 0;
int digitNum = 0;
int idNum = 0;
%}
delim   [ ]
letter  [A-Za-z]
digit   [0-9]
number  {digit}+
id      {letter}+
%%
{number} {
    int r=atoi(yytext);
	if (r==STUDENT_NUM) 
		printf("%s", NAME);
	else 
		printf("%s", yytext);
	digitNum+=yyleng;
}

{delim} {
    printf("%s", yytext);
}

{id} {
    printf("%s", yytext);
    ++idNum;
    letterNum+=yyleng;
}
%%
int main()
{
    yylex();
    printf("# of ids = %d, # of chars = %d, # of numbers = %d\n", idNum, letterNum, digitNum);
}
