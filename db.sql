-- Create database with proper encoding
CREATE DATABASE jireh_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jireh_dashboard;

-- Admin table
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store table
CREATE TABLE store (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    registration_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (admin_id) REFERENCES admin(id)
);

-- Subscription table
CREATE TABLE subscription (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'cancelled') NOT NULL,
    last_payment_date DATETIME,
    next_billing_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Location table
CREATE TABLE location (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Employee table
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    base_salary DECIMAL(10,2) NOT NULL,
    employment_status ENUM('full-time', 'part-time', 'contract', 'probation') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- User table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'sales', 'warehouse') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- Category table
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- Item table
CREATE TABLE item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Inventory table
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    location_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

-- Order table
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    location_id INT NOT NULL,
    user_id INT NOT NULL,
    employee_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- Order Item table
CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);

-- Add indexes for better performance
CREATE INDEX idx_store_admin ON store(admin_id);
CREATE INDEX idx_user_store ON user(store_id);
CREATE INDEX idx_user_location ON user(location_id);
CREATE INDEX idx_employee_store ON employee(store_id);
CREATE INDEX idx_employee_location ON employee(location_id);
CREATE INDEX idx_item_category ON item(category_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_order_store ON `order`(store_id);
CREATE INDEX idx_order_location ON `order`(location_id);
CREATE INDEX idx_order_user ON `order`(user_id);
CREATE INDEX idx_order_employee ON `order`(employee_id);
CREATE INDEX idx_order_item_order ON order_item(order_id);
CREATE INDEX idx_order_item_item ON order_item(item_id);