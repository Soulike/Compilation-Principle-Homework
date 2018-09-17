const regex = /:=|=|;|\(|\)/g;
const str = 'x:=5;if(a=6)';

console.log(str.match(regex));
console.log(str.split(regex));

console.log(''.trim());
