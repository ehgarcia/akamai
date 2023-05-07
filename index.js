const mysql = require("mysql2"),
  xlsx = require("xlsx");
 
// (B) CONNECT TO DATABASE - CHANGE SETTINGS TO YOUR OWN!
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "akamai",
});

// (C) OPEN EXCEL FILE - USE FIRST WORKSHEET
let workbook = xlsx.readFile("consumos_akamai.xlsx"),
  worksheet = workbook.Sheets[workbook.SheetNames[0]],
  range = xlsx.utils.decode_range(worksheet["!ref"]);
 
// (D) IMPORT EXCEL
for (let row = range.s.r; row <= range.e.r; row++) {
  // (D1) READ CELLS
  let data = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
    data.push(cell.v);
  }

  // (D2) INSERT INTO DATABASE
  let sql = "INSERT INTO `consumos_akamai` (`nap`,`ab_out`,`ab_a_pagar`,`miembro`) VALUES (?,?,?,?)";
  db.query(sql, data, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("USER ID:" + results.insertId);
  });
}
 
// (E) DONE - CLOSE DB CONNECTION
db.end();