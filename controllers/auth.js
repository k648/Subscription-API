require('dotenv').config()
const connection = require("../config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
  try {
    const { service_id, password } = req.body;
    // Check if the user already exists
      connection.query('SELECT * FROM users WHERE service_id = ? ', [service_id],(error,results)=>{
        if (error) {
          return res.status(500).json({ msg: 'Database error', error });
            }

    if (results.length > 0) {
      return res.status(409).json({ msg: 'User already exists' });
    }  
      // Hash the password

      bcrypt.hash(password, 10, function(err, hash) {
        connection.query('INSERT INTO users SET ?', {service_id:service_id,password:hash});   
    });
    return res.status(201).json({ msg: 'User created!' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};


const loginUser = (req, res) => {
  // Destructure service_id and password from request body for better readability
  const { service_id, password } = req.body;

  // Check if both service_id and password are provided
  if (!service_id || !password) {
    return res.status(400).send({
      msg: 'service_id and password are required!'
    });
  }

  // Use parameterized queries to prevent SQL injection
  const query = 'SELECT * FROM users WHERE service_id = ?';
  connection.query(query, [service_id], (err, result) => {
    if (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).send({
        msg: 'An error occurred while querying the database.'
      });
    }

    // Check if the user exists
    if (result.length === 0) {
      return res.status(401).send({
        msg: 'User does not exist'
      });
    }

    // Check the password
    bcrypt.compare(password, result[0].password, (bErr, bResult) => {
      if (bErr) {
        console.error(bErr); // Log the error for debugging
        return res.status(500).send({
          msg: 'An error occurred while comparing passwords.'
        });
      }

      if (bResult) {
        const token = jwt.sign({ user_id:result[0].user_id,service_id: result[0].service_id,role:result[0].role}, process.env.TOKEN_KEY, { expiresIn: '1h' });

        return res.status(200).send({
          msg: 'Logged in!',
          token,
          expiresIn: '1h',
          user: result[0].service_id
        });
      }

      return res.status(401).send({
        msg: 'service_id or password is incorrect!'
      });
    });
  });
};
  

  //export controller functions
module.exports = {
    registerUser,
    loginUser
  
};