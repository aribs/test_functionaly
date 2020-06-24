const fs = require('fs')
//Normalize library
var normalize = {
  normalizeMail: function (mail) {
    let aux = mail.split('@');
    let atIndex = aux[0].indexOf('+');
    aux[0] = atIndex < 0 ? aux[0].replace('.', '') : aux[0].replace('.', '').substring(0, atIndex - 1);
    var normalizedEmail = aux.join('@');
    return normalizedEmail.toLowerCase();
  },
  normalizeStreet: function (street) {
    var regex_street = new RegExp(/st[.]/,'g');
    var regex_road = new RegExp(/st[.]/,'g');
    return street.toLowerCase().replace(regex_street, 'street').replace(regex_road, 'road');
  },
  normalizeState: function (state) {
    var regex_illinois = new RegExp(/il/,'g');
    var regex_california = new RegExp(/ca/,'g');
    var regex_newyork = new RegExp(/ny/,'g');
    return state.toLowerCase().replace(regex_illinois, 'illinois').replace(regex_california, 'california').replace(regex_newyork, 'new york');
  }
}

function Check (filePath) {
  // READ FRAUD LINES
  let orders = [];
  let fraudResults = [];
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let lines = fileContent.split('\n');
 for (let line of lines) {
   let items = line.split(',')
   let order = {
     orderId: Number(items[0]),
     dealId: Number(items[1]),
     email: normalize.normalizeMail(items[2]),
     street: normalize.normalizeStreet(items[3]),
     city: items[4].toLowerCase(),
     state: normalize.normalizeState(items[5]),
     zipCode: items[6],
     creditCard: items[7]
   }
   orders.push(order);
 }

 // CHECK FRAUD
 var response = [];
 orders.forEach(function (current, index){
  let isFraudulent = false;
  for(let j = index +1; j < orders.length; j++){
    isFraudulent = false;
    var condition1 = (current.dealId === orders[j].dealId && current.email === orders[j].email && current.creditCard !== orders[j].creditCard)
    var condition2 = (current.dealId === orders[j].dealId && current.state === orders[j].state && current.zipCode === orders[j].zipCode && current.street === orders[j].street && current.city === orders[j].city && current.creditCard !== orders[j].creditCard)
    if (condition1 || condition2) {
        isFraudulent = true
      }
      if (isFraudulent) {
        fraudResults.push({
          isFraudulent: true,
          orderId: orders[j].orderId
        })
      }
  }
 })
  
  return fraudResults;
}

module.exports = { Check }
