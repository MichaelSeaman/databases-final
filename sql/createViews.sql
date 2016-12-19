CREATE VIEW `Items` AS
  SELECT item_id AS `Item ID`, amazon_items.name AS `Name`, description AS Description, price AS Price
  FROM amazon_items WHERE deleted = FALSE;

CREATE VIEW `Warehouses` AS
  SELECT warehouse_id AS `Warehouse ID`, amazon_warehouses.name AS `Name`, addr AS Address, city AS City, state AS State
  FROM amazon_warehouses
  WHERE deleted = FALSE;

CREATE VIEW `Customers` AS
  SELECT customer_id AS `Customer ID`, first_name AS `First Name`, last_name AS `Last Name`, email, username, password
  FROM amazon_customers
  WHERE deleted = FALSE;

CREATE VIEW `Customer Addresses` AS
  SELECT customer_address_id AS `Address ID`, CONCAT(first_name, ' ', last_name) AS Customer , addr AS Address, city, state  FROM
    amazon_customer_addresses JOIN amazon_customers ON
      amazon_customer_addresses.customer_id = amazon_customers.customer_id
        WHERE amazon_customer_addresses.deleted = FALSE;

CREATE VIEW `Warehouse Stock` AS
  SELECT stock_id AS `Stock ID`, amazon_warehouses.name AS `Warehouse Name`, amazon_items.name AS `Item Name`, quantity AS Quantity
  FROM amazon_warehouse_stock
  JOIN amazon_warehouses ON amazon_warehouse_stock.warehouse_id = amazon_warehouses.warehouse_id
  JOIN amazon_items ON amazon_warehouse_stock.item_id = amazon_items.item_id
  WHERE amazon_warehouse_stock.deleted = FALSE;

CREATE VIEW `Warehouse Shipping` AS
  SELECT ship_id AS `Shipping ID`, amazon_warehouses.name AS `Warehouse Name`, amazon_warehouse_ships.state AS `State` FROM
  amazon_warehouse_ships JOIN amazon_warehouses ON amazon_warehouse_ships.warehouse_id = amazon_warehouses.warehouse_id
  WHERE amazon_warehouse_ships.deleted = FALSE;

CREATE VIEW Transactions AS
  SELECT transaction_id AS `Transaction ID`, CONCAT(amazon_customers.first_name, ' ', amazon_customers.last_name) AS Customer,
  amazon_items.name AS `Item`, quantity AS Quantity, amazon_warehouses.name AS Warehouse,
  CONCAT(amazon_customer_addresses.addr, ' ',amazon_customer_addresses.city, ', ', amazon_customer_addresses.state) AS `Customer Address`
  FROM amazon_transactions
  JOIN amazon_customers ON amazon_transactions.customer_id = amazon_customers.customer_id
  JOIN amazon_items ON amazon_transactions.item_id = amazon_items.item_id
  JOIN amazon_warehouses ON amazon_transactions.warehouse_id = amazon_warehouses.warehouse_id
  JOIN amazon_customer_addresses ON amazon_customer_addresses.customer_address_id = amazon_transactions.customer_address_id
  WHERE amazon_transactions.deleted = FALSE
  ORDER BY `Transaction ID`;
