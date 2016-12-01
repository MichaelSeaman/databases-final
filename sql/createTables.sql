CREATE TABLE amazon_items(
  item_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  description VARCHAR(100),
  price DECIMAL(8,2),
  deleted BOOLEAN
);

CREATE TABLE amazon_warehouses(
  warehouse_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN
);

CREATE TABLE amazon_customers(
  customer_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(50),
  username VARCHAR(32),
  password VARCHAR(32),
  deleted BOOLEAN
);

CREATE TABLE amazon_customer_addresses(
  customer_address_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED,
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN,
  FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id)
);

CREATE TABLE amazon_warehouse_stock(
  stock_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  item_id INT UNSIGNED,
  quantity INT UNSIGNED,
  deleted BOOLEAN,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id),
  FOREIGN KEY (item_id) REFERENCES amazon_items(item_id)
);

CREATE TABLE amazon_warehouse_ships(
  ship_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  state VARCHAR(2),
  deleted BOOLEAN,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id)
);

CREATE TABLE amazon_transactions(
  transaction_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED,
  item_id INT UNSIGNED,
  quantity INT UNSIGNED,
  warehouse_id INT UNSIGNED,
  customer_address_id INT UNSIGNED,
  deleted BOOLEAN,
  FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id),
  FOREIGN KEY (item_id) REFERENCES amazon_items(item_id),
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id),
  FOREIGN KEY (customer_address_id) REFERENCES amazon_customer_addresses(customer_address_id)
);
