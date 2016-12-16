# Databases Final

**Author:** Michael Seaman

**Due date:** 12/16/16

---
### Proposal: Amazon Sales Database
#### Premise
The multi-billion dollar e-sales giant Amazon in 2015 alone had over 100 billion
dollars in online sales revenue, 304 million registered users, with another 1.9
billion unregistered site visitors. As the newest hire on Amazon’s US sales
research team, you’re likely scared to be extracting data from the 10 Petabyte flat
file that Amazon notoriously uses to store all of their sales information - but
fear not! The new database administrator Michael Seaman is in the process of
developing a database application to solve all your data needs and make all your
queries incomparably faster.

#### Details
The Amazon Sales Database Application will be an easy to use web applet
communicating with a MySQL database hosted on Microsoft’s Azure cloud. Because it
will be a web application, the UI will be scripted primarily in JavaScript with
windows designed in HTML/CSS.

The backend database will have tables keeping track of all listed items,
warehouses, which warehouses ship where, and the stock for each warehouse.
Additionally, separate tables will be kept for each customer with a registered
account and for their possibly multiple shipping addresses. Finally, a table
containing all transaction history in the US will be accessible.

A casual user will be able to print out and search the tables listed above, as well
as create, delete, and update records. In addition to in-app functionality, the
application will be able to export reports of the national most/least popular
items, the most/least popular items by state, and the customers that generate the
most revenue.

---
### Schema:

#### Tables:
amazon_items :
`item_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
name VARCHAR(50),
description VARCHAR(100),
price DECIMAL(8,2),
deleted BOOLEAN DEFAULT FALSE`

amazon_warehouses :
`warehouse_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
name VARCHAR(50),
addr VARCHAR(50),
city VARCHAR(20),
state VARCHAR(2),
deleted BOOLEAN DEFAULT FALSE`

amazon_customers :
`customer_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
first_name VARCHAR(50),
last_name VARCHAR(50),
email VARCHAR(50),
username VARCHAR(32),
password VARCHAR(32),
deleted BOOLEAN DEFAULT FALSE`

amazon_customer_addresses :
`customer_address_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
customer_id INT UNSIGNED,
addr VARCHAR(50),
city VARCHAR(20),
state VARCHAR(2),
deleted BOOLEAN DEFAULT FALSE,
FOREIGN KEY (customer_id) REFERENCES amazon_customers(customer_id)`


CREATE VIEW `Items` AS
  SELECT item_id AS `Item ID`, amazon_items.name AS `Name`, description AS Description, price AS Price
  FROM amazon_items WHERE deleted = FALSE;

CREATE VIEW `Warehouses` AS
  SELECT warehouse_id AS `Warehouse ID`, amazon_warehouses.name AS `Name`, addr AS Address, city AS City, state AS State
  FROM amazon_warehouses
  WHERE deleted = FALSE;

CREATE VIEW `Customers` AS
  SELECT customer_id AS `Customer ID`, first_name AS `First Name`, last_name AS `Last Name`, email, username, amazon_customers.password
  FROM amazon_customers WHERE deleted = FALSE;

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

CREATE VIEW Transactions AS
  SELECT transaction_id AS `Transaction ID`, CONCAT(amazon_customers.first_name, ' ', amazon_customers.last_name) AS Customer,
  amazon_items.name AS `Item`, quantity AS Quantity, amazon_warehouses.name AS Warehouse,
  CONCAT(amazon_customer_addresses.addr, ' ',amazon_customer_addresses.city, ', ', amazon_customer_addresses.state) AS `Customer Address`
  FROM amazon_transactions
  JOIN amazon_customers ON amazon_transactions.customer_id = amazon_customers.customer_id
  JOIN amazon_items ON amazon_transactions.item_id = amazon_items.item_id
  JOIN amazon_warehouses ON amazon_transactions.warehouse_id = amazon_warehouses.warehouse_id
  JOIN amazon_customer_addresses ON amazon_customer_addresses.customer_address_id = amazon_transactions.customer_address_id;

---
## Usage


To create data:

```

<code>

```

---

### Known Bugs:
* Update by Name menu displays 'Name' twice
* Modals for Create, Update and Delete do not completely encapsulate their contents.

### Overview:
The	UI	can	be	developed	in	the	framework	of	your	choosing	(i.e.	web,	.net,
java),	however	the	backend	database	must	obviously	be	MySQL.

The	final	project	must incorporate at a	minimum	the	following	requirements:

1. - [x]  Print	records	from	your	database/tables.
2. - [x]  Search	for	results	by	various	criteria	given	a	specific	identifier
3. - [x]  Create	a	new	record
4. - [x]  Delete	records	(soft	delete	function	would	be	ideal)
5. - [x]  Update	records
6. - [ ]  Make	use	of	transactions	(commit	&	rollback)
7. - [ ]  Generate	reports	that	can	be	exported	(excel	or	csv	format)
  * One	query	must perform an aggregation	using	a	group-by clause
  * One	query	must be	implemented	with	a	prepared	statement (if	developing in	Java)
  * One	query	must	contain	a	sub-query.
  * Two	queries	must	involve	joins	across	at	least	3	tables
8. - [x]  Enforce	referential	integrality (Constraints)
9. - [x]  Include	Database	Views,	Indexes

---
## Honor Pledge

I pledge that all the work in this repository is my own!


Signed,

Michael Seaman
