const connection = require("../config/db"); // Adjust the path according to your setup

  const authorizeUser = (...requiredRoles) => {
    return async (req, res, next) => {
      try {
        console.log(req.user)
        const {user_id} = req.user;
        if (!user_id) {
          return res.status(400).send('User ID is required');
        }
       

        connection.query('SELECT * FROM users WHERE user_id = ?',[user_id], (error, results) => {
          if (error) {
            console.error('Database query error:', error); // Log the error
            return res.status(500).send('Internal Server Error'); // Send a response
          }
        
          // Check if any user was found
          if (results.length === 0) {
            return res.status(404).send('User not found');
          }
        
          const userRole = results[0].role;
          
          if (requiredRoles.includes(userRole)) {
          return  next();
          } else {
            res.status(403).send('Forbidden');
          }
        });
        
      } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).send('Internal Server Error');
      }
    };
  };

module.exports = authorizeUser;

