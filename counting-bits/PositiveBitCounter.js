function Count (input) {
  if(input === 0) return[0];
  if(input < 0) throw new RangeError('Only > 0 numbers');
  var number_input = input;
  var count = bit_count(number_input);
  var regex_count = bit_count_regex(number_input);
  var positions = get_positions(number_input);
  positions.unshift(count);
  return positions
}
//best performance
function bit_count(u) {
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}
//using a regex
function bit_count_regex(number_input){
  var str_binary = decimalToBin(number_input);
  return str_binary.match(/1/g).length
}
function get_positions(number_input){
  var str_binary = decimalToBin(number_input);
  var arrOfPositions = [];
  str_binary.split('').reverse().forEach((char, index) => { 
      if(char === "1") arrOfPositions.push(index);
  });
  return arrOfPositions;
}
function decimalToBin(dec){
  return (dec >>> 0).toString(2);
}

module.exports = { Count }
