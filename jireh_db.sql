-- Create database
CREATE DATABASE IF NOT EXISTS jireh_db;
USE jireh_db;
SET GLOBAL event_scheduler = ON;

-- Create OWNER table
CREATE TABLE owner (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ADMIN table
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    store_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owner(id)
);

-- Create STORE table
CREATE TABLE store (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id),
    FOREIGN KEY (owner_id) REFERENCES owner(id)
);

-- Modified SUBSCRIPTION table
CREATE TABLE subscription (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    subscription_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'INACTIVE',
    last_payment_date DATETIME,
    next_billing_date DATETIME NOT NULL,
    retry_count INT DEFAULT 0,
    last_retry_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Create LOCATION table
CREATE TABLE location (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Create USER table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- Create EMPLOYEE table
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    position VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    salary DECIMAL(10,2) NOT NULL,
    employment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE expense_category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_recurring BOOLEAN DEFAULT false,     -- Added: For recurring expenses
    budget_limit DECIMAL(10,2),             -- Added: Optional budget limit per category
    parent_category_id INT,                 -- Added: For hierarchical categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (parent_category_id) REFERENCES expense_category(id)
);

CREATE TABLE expense (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(20),             -- Added: Cash, Card, Bank Transfer, etc.
    receipt_number VARCHAR(50),             -- Added: For receipt tracking
    receipt_image_url TEXT,                 -- Added: For storing receipt images
    is_recurring BOOLEAN DEFAULT false,     -- Added: Flag for recurring expenses
    recurring_frequency VARCHAR(20),        -- Added: daily, weekly, monthly, etc.
    recurring_end_date DATE,                -- Added: End date for recurring expenses
    created_by INT NOT NULL,
    approved_by INT,                        -- Added: For expense approval workflow
    approval_status VARCHAR(20) DEFAULT 'pending', -- Added: pending, approved, rejected
    approval_date DATETIME,                 -- Added: When the expense was approved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (category_id) REFERENCES expense_category(id),
    FOREIGN KEY (created_by) REFERENCES user(id),
    FOREIGN KEY (approved_by) REFERENCES user(id)
);

CREATE TABLE recurring_expense (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT NOT NULL,
    frequency VARCHAR(20) NOT NULL,         -- daily, weekly, monthly, yearly
    start_date DATE NOT NULL,
    end_date DATE,
    last_generated_date DATE,
    next_generation_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expense(id)
);

-- Create CATEGORY table
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- Create ITEM table
CREATE TABLE item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    last_inventory_update DATETIME,
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT true,
    is_temporary BOOLEAN DEFAULT false,
    expiry_hours INT DEFAULT NULL,
    auto_reset_quantity BOOLEAN DEFAULT false,
    last_quantity_reset DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id)
);
ALTER TABLE item COMMENT 'Items table with temporary item support. Temporary items can auto-reset their quantity after specified expiry hours.';

-- Modified ORDER table with enhanced features
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    user_id INT NOT NULL,
    employee_id INT NOT NULL,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Customer information
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    
    -- Order status and timing
    order_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    
    -- Financial information
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment information
    payment_status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    remaining_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    
    -- Refund tracking
    refund_status VARCHAR(20) DEFAULT NULL,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_reason TEXT,
    
    -- Additional fields
    notes TEXT,
    tags JSON,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- Modified ORDER_ITEM table with enhanced tracking
CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    category_id INT NOT NULL,
    
    -- Item details
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    -- Discount tracking per item
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT NULL,
    
    -- Return/Refund tracking per item
    returned_quantity INT DEFAULT 0,
    refunded_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (category_id) REFERENCES category(id)  
);

-- New table for order history tracking
CREATE TABLE order_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
);

-- Create STOCK_TRANSFER table
CREATE TABLE stock_transfer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_location_id INT NOT NULL,
    to_location_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, completed, cancelled
    notes TEXT,
    transfer_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_location_id) REFERENCES location(id),
    FOREIGN KEY (to_location_id) REFERENCES location(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE db_version (
    version VARCHAR(50),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- For expense analysis and reporting
CREATE INDEX idx_expense_date_amount ON expense(expense_date, amount);
CREATE INDEX idx_expense_approval ON expense(approval_status, approval_date);
CREATE INDEX idx_expense_recurring ON expense(is_recurring, recurring_frequency);
CREATE INDEX idx_expense_lookup ON expense(store_id, location_id, expense_date);
CREATE INDEX idx_expense_category ON expense(category_id);
CREATE INDEX idx_expense_category_store ON expense_category(store_id, is_active);

-- For recurring expense tracking
CREATE INDEX idx_recurring_expense_dates ON recurring_expense(next_generation_date, last_generated_date);
CREATE INDEX idx_recurring_expense_status ON recurring_expense(is_active, frequency);

-- Authentication & User Management Indices
CREATE INDEX idx_user_auth ON user(email, password_hash);  -- For login queries
CREATE INDEX idx_user_location_role ON user(location_id, role);  -- For role-based location access
CREATE INDEX idx_user_store_status ON user(store_id, is_active);  -- For active users per store

-- Store Management Indices
CREATE INDEX idx_store_owner ON store(owner_id, is_active);  -- For owner's store lookup
CREATE INDEX idx_store_admin ON store(admin_id, is_active);  -- For admin's store management

-- Location Management Indices
CREATE INDEX idx_location_store ON location(store_id, is_active);  -- For store's locations
CREATE INDEX idx_location_status ON location(is_active, store_id);  -- For active locations lookup

-- Employee Management Indices
CREATE INDEX idx_employee_lookup ON employee(store_id, location_id, is_active);  -- For employee filtering
CREATE INDEX idx_employee_contact ON employee(phone, email);  -- For contact lookups

-- Category & Item Management Indices
CREATE INDEX idx_expense_category_parent ON expense_category(parent_category_id);
CREATE INDEX idx_expense_category_recurring ON expense_category(is_recurring);
CREATE INDEX idx_category_location ON category(location_id, is_active);  -- For location's categories
CREATE INDEX idx_item_lookup ON item(category_id, is_active, is_hidden);  -- For item filtering
CREATE INDEX idx_item_barcode ON item(barcode);  -- For barcode scanning
CREATE INDEX idx_item_inventory ON item(category_id, quantity);  -- For inventory management

CREATE INDEX idx_item_temporary ON item(
    is_temporary,
    expiry_hours,
    last_quantity_reset
);

-- Order Management Indices
CREATE INDEX idx_order_lookup ON `order`(
    store_id, 
    location_id, 
    status,
    order_date
);  -- For order filtering and reporting

CREATE INDEX idx_order_payment ON `order`(
    payment_status,
    payment_method,
    total_amount
);  -- For payment tracking

CREATE INDEX idx_order_customer ON `order`(
    customer_phone,
    customer_email
);  -- For customer order history

CREATE INDEX idx_order_number_search ON `order`(
    order_number,
    status,
    payment_status
);  -- For order number searches

-- Order Items Indices
CREATE INDEX idx_order_items_lookup ON order_item(
    order_id,
    item_id,
    category_id
);  -- For order items lookup

-- Stock Transfer Indices
CREATE INDEX idx_stock_transfer_lookup ON stock_transfer(
    from_location_id,
    to_location_id,
    status,
    transfer_date
);  -- For transfer tracking

-- Subscription Management Indices
CREATE INDEX idx_subscription_tracking ON subscription(
    store_id,
    payment_status,
    end_date
);  -- For subscription status tracking

-- Order History Tracking Index
CREATE INDEX idx_order_history_lookup ON order_history(
    order_id,
    user_id,
    created_at
);  -- For order history tracking


-- Create Event Scheduler for temporary items
DELIMITER //

CREATE EVENT reset_temporary_items_quantity
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    UPDATE item 
    SET 
        quantity = 0,
        last_quantity_reset = CURRENT_TIMESTAMP
    WHERE 
        is_temporary = true 
        AND auto_reset_quantity = true
        AND last_quantity_reset IS NOT NULL
        AND DATE_ADD(last_quantity_reset, INTERVAL expiry_hours HOUR) <= CURRENT_TIMESTAMP;
END //

DELIMITER ;


-- Create stored procedure for subscription reset
DELIMITER //
CREATE PROCEDURE reset_expired_subscriptions()
BEGIN
    -- Update expired subscriptions
    UPDATE subscription 
    SET 
        payment_status = 'EXPIRED',
        subscription_status = 'INACTIVE'
    WHERE 
        end_date < CURDATE() 
        AND subscription_status = 'ACTIVE';

    -- Create new subscription entries for the next period
    INSERT INTO subscription (
        store_id, 
        start_date, 
        end_date, 
        amount, 
        payment_status,
        subscription_status, 
        next_billing_date
    )
    SELECT 
        store_id,
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 30 DAY),
        amount,
        'PENDING',
        'INACTIVE',
        DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    FROM subscription 
    WHERE 
        end_date < CURDATE() 
        AND subscription_status = 'ACTIVE';
END //
DELIMITER ;

-- Create event scheduler to run the reset procedure
DELIMITER //
CREATE EVENT subscription_reset_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL reset_expired_subscriptions();
END //
DELIMITER ;

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;