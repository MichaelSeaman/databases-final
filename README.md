# Databases Final

**Author:** Michael Seaman

**Due date:** 12/16/16

---
## Proposal: Amazon Sales Database
---

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

### Schema:

Customers ->  `railCoCustomers( customer_id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT, first_name VARCHAR(25), last_name VARCHAR(25) )`



---
## Usage


To create data:

```

<code>

```


###Overview:
The	UI	can	be	developed	in	the	framework	of	your	choosing	(i.e.	web,	.net,
java),	however	the	backend	database	must	obviously	be	MySQL.

The	final	project	must incorporate at a	minimum	the	following	requirements:

1.  Print	records	from	your	database/tables.
2.  Search	for	results	by	various	criteria	given	a	specific	identifier
3.  Create	a	new	record
4.  Delete	records	(soft	delete	function	would	be	ideal)
5.  Update	records
6.  Make	use	of	transactions	(commit	&	rollback)
7.  Generate	reports	that	can	be	exported	(excel	or	csv	format)
  * One	query	must perform an aggregation	using	a	group-by clause
  * One	query	must be	implemented	with	a	prepared	statement (if	developing in	Java)
  * One	query	must	contain	a	sub-query.
  * Two	queries	must	involve	joins	across	at	least	3	tables
8.  Enforce	referential	integrality (Constraints)
9.  Include	Database	Views,	Indexes


## Honor Pledge

I pledge that all the work in this repository is my own!


Signed,

Michael Seaman
