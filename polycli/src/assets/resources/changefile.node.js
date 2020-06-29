const fs = require('fs')
const lunit = require('./large-subunit-map')
const suint = require('./small-subunit-map')

var lunitproteins = { 'large_sunit_proteins': Object.keys(lunit) };
var sunitproteins = { 'small_sunit_proteins': Object.keys(suint) };


fs.writeFile('lunitproteins.json', JSON.stringify(lunitproteins), 'utf8', (err) => {
    if (err) console.log("error ", err)
    else console.log("Saved.")
})
fs.writeFile('sunitproteins.json', JSON.stringify(sunitproteins), 'utf8', (err) => {
    if (err) console.log("error ", err)
    else console.log("Saved.")
})