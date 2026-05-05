<!-- create user -->

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


<!-- create event -->
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_time DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00,
  category VARCHAR(100),
  user_id VARCHAR(255),
  status ENUM('pending', 'approved', 'cancelled') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<!-- create payment -->
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    transaction_id VARCHAR(255) NOT NULL,
    ticket_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
);


<!-- create ticket -->
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    participant_id VARCHAR(255) NOT NULL, -- Matches the type of your User ID
    purchase_status ENUM('available', 'pending', 'purchased', 'cancelled') DEFAULT 'available',
    quantity INT DEFAULT 1,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key constraints ensure data integrity
    CONSTRAINT fk_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE
);


<!-- alter table -->
-- Step 1: Remove the existing constraint
ALTER TABLE tickets 
DROP FOREIGN KEY fk_event;

-- Step 2: Add the correct constraint with ON DELETE CASCADE
ALTER TABLE tickets 
ADD CONSTRAINT fk_event 
FOREIGN KEY (event_id) 
REFERENCES events(id) 
ON DELETE CASCADE;