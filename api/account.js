const accounts = {
  'dudasaus@umich.edu': {
    password: 'password',
    rfid: 'f4554076'
  }
}

module.exports = {
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (accounts[email] && accounts[email]['password'] === password) {
      res.json({ success: true });
    }
    else {
      res.json({ success: false });
    }
  }
}
