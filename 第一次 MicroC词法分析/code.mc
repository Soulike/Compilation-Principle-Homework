int x;
input(x);
if(x<0) then
    x:=2*x+1/3;
else if(x>0)
    x:=2/x;
else
    x:=x+1;
for(i:=0;i<=10;i++)
    x=x+2;
output(x);
#
