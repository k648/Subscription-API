const connection = require("../config/db");
const uuid = require('uuid');
const { StatusCodes } = require('http-status-codes')

const logger = require('../logFile/logger'); // import the logger

 //Subcribe Users

 const subscribeUser = async (req, res) => {
  const { service_id, phone_number } = req.body;
  logger.info(service_id)
  const dateCreated = new Date();
  const subscription_date = new Date();
  const subscription_id = uuid.v4();

  // Ensure service_id and phone_number are provided
  if (!service_id || !phone_number) {
      return res.status(400).json({ msg: 'Service ID or phone_number is required!' });
  }

  try {
      // Check if subscriber already exists
      connection.query('SELECT * FROM subscribers WHERE service_id = ?', [service_id], (error, results) => {
          if (error) {
              return res.status(500).json({ msg: 'Database error', error });
          }

          // If the subscriber exists, send a 409 response
          if (results.length > 0) {
              return res.status(409).json({ msg: 'User is already subscribed' });
          }

          // Proceed to insert the new subscriber
          connection.query('INSERT INTO subscribers (subscription_id, service_id, phone_number, dateCreated, subscription_date) VALUES (?, ?, ?, ?, ?)', 
          [subscription_id, service_id, phone_number, dateCreated, subscription_date], (insertError) => {
              if (insertError) {
                  // Handle duplicate entry error
                  if (insertError.code === 'ER_DUP_ENTRY') {
                      return res.status(409).json({ error: 'Duplicate entry: phone number already exists.' });
                  } else {
                      return res.status(500).json({ msg: 'Database error', error: insertError });
                  }
              }

              // Successfully inserted
              return res.status(201).json({ subscription_id });
          });
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal Server Error' });
  }
};



const unsubscribeUser = async (req, res) => {
  const { subscription_id } = req.params;
  const unsubscription_date = new Date();

  try {
    // Perform the delete operation
    connection.query('DELETE FROM subscribers WHERE subscription_id = ?', [subscription_id], async (error, results) => {
      if (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ msg: 'Internal server error' });
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: 'Subscriber does not exist' });
      }

      // Perform the insert operation for the unsubscription
      connection.query('INSERT INTO unsubscribed (subscription_id, unsubscription_date) VALUES (?, ?)', [subscription_id, unsubscription_date], (insertError) => {
        if (insertError) {
          console.error('Insert error:', insertError);
          return res.status(500).json({ msg: 'Internal server error' });
        }

        return res.status(StatusCodes.OK).json({ msg: 'Subscriber deleted and unsubscription recorded successfully' });
      });
    });
  } catch (err) {
    console.error('Catch block error:', err); // Log the error for debugging
    return res.status(500).json({ msg: 'Internal server error' });
  }
};


 

 const getSubscriber = async (req, res) => {
   try {
     // Correctly extract subscription_id from request parameters
     const  {subscription_id} = req.params;
 
     // Query the database
     connection.query('SELECT * FROM subscribers WHERE  subscription_id = ?', [subscription_id], (error, result, fields) => {
       if (error) {
         // Handle the database query error
         return res.status(500).json({ error: 'Database query failed' });
       }
 
       // Check if the result is empty
       if (result.length === 0) {
         return res.status(404).json({ message: 'User is not subscribed' });
       }
 
       // Return the result if found
       return res.status(StatusCodes.OK).json({ result });
     });
   } catch (error) {
     // Handle unexpected errors
     return res.status(500).json({ error: 'Internal server error' });
   }
 };
 
 const updateSubscriber = (req, res) => {
  try {
    const { subscription_id } = req.params;
    const { service_id, phone_number } = req.body; // Extracting the data from the request body

    connection.query(
      'UPDATE subscribers SET service_id = ?, phone_number = ? WHERE subscription_id = ?',
      [service_id, phone_number, subscription_id],
      (error, result) => {
        if (error) {
          console.error('Update error:', error);
          return res.status(500).json({ msg: 'Internal server error' });
        }

        // Check if any rows were affected
        if (result.affectedRows === 0) {
          return res.status(404).json({ msg: 'Subscriber does not exist' });
        }

        return res.status(StatusCodes.OK).json({ msg: 'Subscriber updated successfully' });
      }
    );
  } catch (err) {
    console.error('Catch block error:', err); // Log the error for debugging
    return res.status(500).json({ msg: 'Internal server error' });
  }
};



const checkSubscriberStatus = (req,res) =>{
  try {
  const {subscription_id} = req.params
    connection.query(`SELECT 
            status, 
            subscription_date,
             subscription_id
        FROM 
            subscribers 
        WHERE 
            subscription_id = ?`, [subscription_id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      if (results.length > 0) {
        const userStatus = results[0];
     
        return res.json({
            status: userStatus.status,
            subscription_id : userStatus.subscription_id,
            subscription_date: userStatus.subscription_date
        });
      }
      else {
        // User not found or not subscribed
        return res.json({
            status: 'not_subscribed',
            subscription_date: null
        });
    }
});
  } catch {
  res.status(404).json({msg:'user not subscribed'})
  }
}


const checkunSubscriberStatus = (req,res) =>{
  try {
  const {subscription_id} = req.params
    connection.query(`SELECT 
            status, 
            unsubscription_date,
            subscription_id
        FROM 
            unsubscribed 
        WHERE 
            subscription_id = ?`, [subscription_id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      if (results.length > 0) {
        const userStatus = results[0];
     
        return res.json({
            status: userStatus.status,
            unsubscription_date: userStatus.unsubscription_date
        });
      }
      else {
        // User not found or not subscribed
        return res.json({
            status: null,
            unsubscription_date: null
        });
    }
});
  } catch {
  res.status(404).json({msg:'user not subscribed'})
  }
}



module.exports = {
   subscribeUser,
   unsubscribeUser,
   getSubscriber ,
   updateSubscriber,
   checkSubscriberStatus,
   checkunSubscriberStatus
};