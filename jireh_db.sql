-- Create database
CREATE DATABASE IF NOT EXISTS jireh_db;
USE jireh_db;

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
    admin_id INT NOT NULL,
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

-- Create SUBSCRIPTION table
CREATE TABLE subscription (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    last_payment_date DATETIME,
    next_billing_date DATETIME NOT NULL,
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

-- Create EXPENSE table
CREATE TABLE expense (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Create ORDER table
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    user_id INT NOT NULL,
    employee_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- Create ORDER_ITEM table
CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
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

-- Add all indexes
CREATE INDEX idx_store_admin ON store(admin_id);
CREATE INDEX idx_user_store ON user(store_id);
CREATE INDEX idx_user_location ON user(location_id);
CREATE INDEX idx_user_role ON user(role);
CREATE INDEX idx_employee_position ON employee(position);
CREATE INDEX idx_employee_store ON employee(store_id);
CREATE INDEX idx_employee_location ON employee(location_id);
CREATE INDEX idx_item_name ON item(name);
CREATE INDEX idx_item_category ON item(category_id);
CREATE INDEX idx_order_date ON `order`(order_date);
CREATE INDEX idx_order_status ON `order`(status);
CREATE INDEX idx_order_store ON `order`(store_id);
CREATE INDEX idx_order_location ON `order`(location_id);
CREATE INDEX idx_order_user ON `order`(user_id);
CREATE INDEX idx_order_employee ON `order`(employee_id);
CREATE INDEX idx_order_item_order ON order_item(order_id);
CREATE INDEX idx_order_item_item ON order_item(item_id);