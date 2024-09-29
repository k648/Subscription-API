const userSchema = `CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,  -- Add a primary key for unique identification
    service_id VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL
)`

// Export the schema for use in other modules
module.exports = userSchema;


