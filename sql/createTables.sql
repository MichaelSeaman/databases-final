CREATE TABLE amazon_items(
  item_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  description VARCHAR(100),
  price DECIMAL(8,2),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE amazon_warehouses(
  warehouse_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE amazon_customers(
  customer_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(50),
  username VARCHAR(32),
  password VARCHAR(32),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE amazon_customer_addresses(
  customer_address_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED,
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id)
);

CREATE TABLE amazon_warehouse_stock(
  stock_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  item_id INT UNSIGNED,
  quantity INT UNSIGNED,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id),
  FOREIGN KEY (item_id) REFERENCES amazon_items(item_id)
);

CREATE TABLE amazon_warehouse_ships(
  ship_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id)
);

CREATE TABLE amazon_transactions(
  transaction_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED,
  item_id INT UNSIGNED,
  quantity INT UNSIGNED,
  warehouse_id INT UNSIGNED,
  customer_address_id INT UNSIGNED,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id),
  FOREIGN KEY (item_id) REFERENCES amazon_items(item_id),
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id),
  FOREIGN KEY (customer_address_id) REFERENCES amazon_customer_addresses(customer_address_id)
);


INSERT INTO amazon_items(name, description, price, deleted) VALUES ('Apples', 'Granny Smith', 10.20, FALSE );

INSERT INTO amazon_warehouses(name, addr, city, state, deleted) VALUES ('Bob\'s House', '501 Grand St.', 'Topeka', 'KA', FALSE);

INSERT INTO amazon_customers(first_name, last_name, email, username, password, deleted) VALUES ('Bob', 'Saggot', 'sagsby@gmail.com', 'womanizer7', 'boblovesyou89', FALSE);

INSERT INTO amazon_customer_addresses(customer_id, addr, city, state, deleted) VALUES (1, '85 N Griswald', 'Oakland', 'CA', FALSE );

INSERT INTO amazon_warehouse_stock(warehouse_id, item_id, quantity, deleted) VALUES (1, 1, 500000, FALSE );

INSERT INTO amazon_warehouse_ships(warehouse_id, state, deleted) VALUES (1, 'CA', FALSE );

INSERT INTO amazon_warehouse_ships(warehouse_id, state, deleted) VALUES (1, 'KA', FALSE );

INSERT INTO amazon_transactions(customer_id, item_id, quantity, warehouse_id, customer_address_id, deleted) VALUES (1, 1, 10, 1, 1, FALSE );

UPDATE amazon_items SET
  name = "Roll", description = "Delicious bread", price = 2.5
WHERE item_id = 51;

UPDATE amazon_items SET deleted = TRUE

DROP TABLE amazon_transactions;

DROP TABLE amazon_warehouse_ships;

DROP TABLE amazon_warehouse_stock;

DROP TABLE amazon_customer_addresses;

DROP TABLE amazon_customers;

DROP TABLE amazon_items;

DROP TABLE amazon_warehouses;

SELECT * FROM amazon_items;