const regex = /[#+\-*\/:<>=;()]/g;
const str = '5;';

console.log(str.match(regex));
console.log(str.split(regex));
