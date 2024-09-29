
var  subscribersSchema = ( `CREATE TABLE subscribers (
  subscription_id VARCHAR(50) NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  dateCreated DATETIME NOT NULL,
  PRIMARY KEY (subscription_id),
  INDEX idx_service_id (service_id)  -- Optional: Index for faster queries on service_id
)`)


