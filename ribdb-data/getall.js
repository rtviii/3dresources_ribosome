const fs = require("fs");
const { exec } = require("child_process");
const { stdout, stderr } = require("process");
// console.log(shell.ls('.'))

// extracting all names
// var names = [];
// console.log(
//   shell
//     .ls("*.json")
//     .map(string => (names = [...names, { pdbid: string.substring(0, 4) }]))
// );
// fs.writeFileSync("pdb-names.json", JSON.stringify(names));

// extract relevant from nom file

var file;
const q = exec("jq . 4UG0.json", (err, stdout, stderr) => {
  file = stdout;
});



