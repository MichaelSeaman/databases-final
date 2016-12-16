CREATE TABLE amazon_items(
  item_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  description VARCHAR(100),
  price DECIMAL(8,2),
  deleted BOOLEAN DEFAULT FALSE
);

#Index name, id
CREATE INDEX itemNameIndex
  ON amazon_items (name);

CREATE INDEX itemIdIndex
  ON amazon_items (item_id);


CREATE VIEW `Items` AS
  SELECT item_id AS `Item ID`, amazon_items.name AS `Name`, description AS Description, price AS Price
  FROM amazon_items WHERE deleted = FALSE;

CREATE TABLE amazon_warehouses(
  warehouse_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE VIEW `Warehouses` AS
  SELECT warehouse_id AS `Warehouse ID`, amazon_warehouses.name AS `Name`, addr AS Address, city AS City, state AS State
  FROM amazon_warehouses
  WHERE deleted = FALSE;

CREATE TABLE amazon_customers(
  customer_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(50),
  username VARCHAR(32),
  password VARCHAR(32),
  deleted BOOLEAN DEFAULT FALSE
);
#Index id
CREATE INDEX customerIdIndex
  ON amazon_customers(customer_id);



CREATE VIEW `Customers` AS
  SELECT customer_id AS `Customer ID`, first_name AS `First Name`, last_name AS `Last Name`, email, username, amazon_customers.password
  FROM amazon_customers WHERE deleted = FALSE;

CREATE TABLE amazon_customer_addresses(
  customer_address_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED,
  addr VARCHAR(50),
  city VARCHAR(20),
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id)
);
#index id, customer_id, state
CREATE INDEX customerAddressIdIndex
  ON amazon_customer_addresses(customer_address_id);

CREATE INDEX customerAddressCustomerIdIndex
  ON amazon_customer_addresses(customer_id);

CREATE INDEX customerAddressStateIndex
  ON amazon_customer_addresses(state);

CREATE VIEW `Customer Addresses` AS
  SELECT customer_address_id AS `Address ID`, CONCAT(first_name, ' ', last_name) AS Customer , addr AS Address, city, state  FROM
    amazon_customer_addresses JOIN amazon_customers ON
      amazon_customer_addresses.customer_id = amazon_customers.customer_id
        WHERE amazon_customer_addresses.deleted = FALSE;

CREATE TABLE amazon_warehouse_stock(
  stock_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  item_id INT UNSIGNED,
  quantity INT UNSIGNED,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id),
  FOREIGN KEY (item_id) REFERENCES amazon_items(item_id)
);
#index id
CREATE INDEX warehouseStockIdIndex
  ON amazon_warehouse_stock (stock_id);

CREATE VIEW `Warehouse Stock` AS
  SELECT stock_id AS `Stock ID`, amazon_warehouses.name AS `Warehouse Name`, amazon_items.name AS `Item Name`, quantity AS Quantity
  FROM amazon_warehouse_stock
  JOIN amazon_warehouses ON amazon_warehouse_stock.warehouse_id = amazon_warehouses.warehouse_id
  JOIN amazon_items ON amazon_warehouse_stock.item_id = amazon_items.item_id
  WHERE amazon_warehouse_stock.deleted = FALSE;

CREATE TABLE amazon_warehouse_ships(
  ship_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  warehouse_id INT UNSIGNED,
  state VARCHAR(2),
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (warehouse_id) REFERENCES amazon_warehouses(warehouse_id)
);
#index id, state
CREATE INDEX warehouseShippingIdIndex
  ON amazon_warehouse_ships (ship_id);

CREATE INDEX warehouseShippingStateIndex
  ON amazon_warehouse_ships (state);

CREATE VIEW `Warehouse Shipping` AS
  SELECT ship_id AS `Shipping ID`, amazon_warehouses.name AS `Warehouse Name`, amazon_warehouse_ships.state AS `State` FROM
  amazon_warehouse_ships JOIN amazon_warehouses ON amazon_warehouse_ships.warehouse_id = amazon_warehouses.warehouse_id
  WHERE amazon_warehouse_ships.deleted = FALSE;

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
#index id, customer id, item id
CREATE INDEX transactionIdIndex
  ON amazon_transactions (transaction_id);

CREATE INDEX transactionCustomerIdIndex
  ON amazon_transactions (customer_id);

CREATE INDEX transactionItemIdIndex
  ON amazon_transactions (item_id);


CREATE VIEW Transactions AS
  SELECT transaction_id AS `Transaction ID`, CONCAT(amazon_customers.first_name, ' ', amazon_customers.last_name) AS Customer,
  amazon_items.name AS `Item`, quantity AS Quantity, amazon_warehouses.name AS Warehouse,
  CONCAT(amazon_customer_addresses.addr, ' ',amazon_customer_addresses.city, ', ', amazon_customer_addresses.state) AS `Customer Address`
  FROM amazon_transactions
  JOIN amazon_customers ON amazon_transactions.customer_id = amazon_customers.customer_id
  JOIN amazon_items ON amazon_transactions.item_id = amazon_items.item_id
  JOIN amazon_warehouses ON amazon_transactions.warehouse_id = amazon_warehouses.warehouse_id
  JOIN amazon_customer_addresses ON amazon_customer_addresses.customer_address_id = amazon_transactions.customer_address_id;


INSERT INTO amazon_items(name, description, price, deleted) VALUES ('Apples', 'Granny Smith', 10.20, FALSE );

INSERT INTO amazon_warehouses(name, addr, city, state, deleted) VALUES ('Bob\'s House', '501 Grand St.', 'Topeka', 'KA', FALSE);

INSERT INTO amazon_customers(first_name, last_name, email, username, password, deleted) VALUES ('Bob', 'Saggot', 'sagsby@gmail.com', 'womanizer7', 'boblovesyou89', FALSE);

INSERT INTO amazon_customer_addresses(customer_id, addr, city, state, deleted) VALUES (1, '85 N Griswald', 'Oakland', 'CA', FALSE );

INSERT INTO amazon_warehouse_stock(warehouse_id, item_id, quantity, deleted) VALUES (1, 1, 500000, FALSE );

INSERT INTO amazon_warehouse_ships(warehouse_id, state, deleted) VALUES (1, 'CA', FALSE );

INSERT INTO amazon_warehouse_ships(warehouse_id, state, deleted) VALUES (1, 'KA', FALSE );

INSERT INTO amazon_transactions(customer_id, item_id, quantity, warehouse_id, customer_address_id, deleted) VALUES (1, 1, 10, 1, 1, FALSE );
