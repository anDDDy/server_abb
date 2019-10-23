const CORRELATOR = {
  id6: 3
}
let a = [
  [],
  []
];
let b = [{
  id: 1
}, {
  id: 3
}, {
  id: 9
}];
a[0] = a[0].concat(b);
console.log(a);
