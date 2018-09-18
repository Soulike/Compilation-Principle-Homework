int x;
input(x);
if(x<0) then
    x:=2*x+1/3;
else if(x>0) then
    x:=2/x;
else then
    x:=x+1;
    x:=x+2;
output(x);
#
