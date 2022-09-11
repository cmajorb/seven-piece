export default function getStatusConstants () {
    const constants_info = require('../testing/constants.json');
    const constants_keys = Object.keys(constants_info);
    let constants_vals = [];
    for (let index in constants_keys) {
        const key = constants_keys[index];
        constants_vals.push(constants_info[key as keyof typeof constants_info]);
    };
    constants_vals.sort((a, b) => b - a);
    return constants_vals;
  }