const mysql = require('mysql2');
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('./public/conf.json')).database;
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const db = {
  createTable: async () => {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS type (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(20)
      );
    `);
    
    return await executeQuery(`
      CREATE TABLE IF NOT EXISTS booking (
        id INT PRIMARY KEY AUTO_INCREMENT,
        idType INT NOT NULL,
        date DATE NOT NULL,
        hour INT NOT NULL,
        name VARCHAR(50),
        FOREIGN KEY (idType) REFERENCES type(id)
      );
    `);
  },

  insert: async (booking) => {
    let temp=booking.date.split("/");
    let temp2=temp[2]+"-"+(parseInt(temp[1])<10?"0"+temp[1]:temp[1])+"-"+(parseInt(temp[0])<10?"0"+temp[0]:temp[0]);
    console.log(booking);
    const sql = "INSERT INTO booking (idType, date, hour, name) VALUES (?, ?, ?, ?)";
    return await executeQuery(sql, [booking.idType, temp2, booking.hour, booking.name]);
  },
  
  select: async () => {
    return await executeQuery("SELECT * FROM booking");
  },

  selectType: async () => {
    return await executeQuery("SELECT * FROM type");
  },

};

module.exports = db;