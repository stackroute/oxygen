var temp = "This is a string.";
var count = (temp.match(/is/g) || []).length;
console.log(count);
