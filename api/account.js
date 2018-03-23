const Database = require('../database/db');
const crypto = require('crypto');

const accounts = {
  'dudasaus@umich.edu': {
    password: 'password',
    rfid: 'f4554076'
  }
}

const db = new Database;

module.exports = {
  create(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const rfid = req.body.rfid;

    // Make sure we have values
    if (!email || !password || !rfid) {
      res.json({ success: false, message: 'Missing values' });
      return;
    }

    // Get other vars
    const salt = crypto.randomBytes(16).toString('hex');
    // Hash + salt the password
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    const hashedPassword = hash.digest('hex');


    // Open database
    let curr = null;
    try {
      curr = db.open();
    }
    catch (e) {
      res.json({ success: false, message: 'Unable to open database' });
      return;
    }

    // Attempt to create account
    const sql = `INSERT INTO accounts (email, password, salt, rfid) VALUES (?, ?, ?, ?)`
    const vals = [email, hashedPassword, salt, rfid];
    curr.run(sql, vals, (err) => {
      if (!err) {
        res.json({ success: true });
      }
      else {
        res.json({ success: false, message: 'Email or RFID already used' });
      }
      curr.close();
    });
  },

  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Make sure we have values
    if (!email || !password) {
      res.json({ success: false });
      return;
    }

    // Open database
    let curr = null;
    try {
      curr = db.open();
    }
    catch (e) {
      res.json({ success: false });
      return;
    }

    // Verify login
    const sql = 'SELECT email, password, salt FROM accounts WHERE email=?';
    const vals = [email];
    curr.get(sql, vals, (err, row) => {
      if (!err && row !== undefined) {
        const toHash = password + row.salt;

        // Hash the password
        const hash = crypto.createHash('sha256');
        hash.update(toHash);
        const hashedPassword = hash.digest('hex');

        if (hashedPassword === row.password) {
          // Passwords match
          res.json({
            success: true,
            email: row.email
          });
        }
        else {
          // Passwords did not match
          res.json({ success: false });
        }
        curr.close();
      }
      else {
        // Row wasn't found or DB error
        res.json({ success: false });
      }
    });
  },

  verifyRfid(req, res) {
    const email = req.body.email;
    const rfid = req.body.rfid;

    // Make sure we have values
    if (!email || !rfid) {
      res.json({ success: false });
      return;
    }

    // Open database
    let curr = null;
    try {
      curr = db.open();
    }
    catch (e) {
      res.json({ success: false });
      return;
    }

    // Verify RFID
    const sql = 'SELECT email FROM accounts WHERE email=? AND rfid=?';
    const vals = [email, rfid];
    curr.get(sql, vals, (err, row) => {
      if (!err && row !== undefined) {
        // Success
        res.json({
          success: true,
          email: row.email
        });
      }
      else {
        // Not found
        res.json({
          success: false
        });
      }
      curr.close();
    });
  },

  list(req, res) {
    // Open database
    let curr = null;
    try {
      curr = db.open();
    }
    catch (e) {
      res.json({ success: false });
      return;
    }

    // Gather emails
    const sql = 'SELECT email FROM accounts';
    curr.all(sql, (err, rows) => {
      if (err) {
        res.json({ success: false });
      }
      else {
        let emails = [];
        for (let r of rows) {
          emails.push(r.email);
        }
        res.json({ success: true, emails });
      }
      curr.close();
    });
  }
}
