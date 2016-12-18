#Highest Sales
DELIMITER //
CREATE PROCEDURE getBestSellers()
  BEGIN
    SELECT amazon_items.item_id AS `Item ID`, name, price, SUM(quantity) AS `Total Sales`, SUM(quantity) * price AS `Total Revenue`
    FROM amazon_transactions AS itemTransactions
    JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
    WHERE itemTransactions.deleted = FALSE
    GROUP BY amazon_items.item_id
    ORDER BY `Total Sales` DESC LIMIT 20;
  END //

CREATE PROCEDURE getWorstSellers()
  BEGIN
    SELECT amazon_items.item_id AS `Item ID`, name, price, SUM(quantity) AS `Total Sales`, SUM(quantity) * price AS `Total Revenue`
    FROM amazon_transactions AS itemTransactions
    JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
    WHERE itemTransactions.deleted = FALSE
    GROUP BY amazon_items.item_id
    ORDER BY `Total Sales` ASC LIMIT 20;
  END //

#Highest Revenue
CREATE PROCEDURE getBestGrossers()
  BEGIN
    SELECT amazon_items.item_id AS `Item ID`, name, price, SUM(quantity) AS `Total Sales`, SUM(quantity) * price AS `Total Revenue`
    FROM amazon_transactions AS itemTransactions
    JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
    WHERE itemTransactions.deleted = FALSE
    GROUP BY amazon_items.item_id
    ORDER BY `Total Revenue` DESC LIMIT 20;
  END //

CREATE PROCEDURE getWorstGrossers()
  BEGIN
    SELECT amazon_items.item_id AS `Item ID`, name, price, SUM(quantity) AS `Total Sales`, SUM(quantity) * price AS `Total Revenue`
    FROM amazon_transactions AS itemTransactions
    JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
    WHERE itemTransactions.deleted = FALSE
    GROUP BY amazon_items.item_id
    ORDER BY `Total Revenue` ASC LIMIT 20;
  END //
#Best Sellers State
CREATE PROCEDURE getBestSellersByState()
  BEGIN
    SELECT
      maxSalesPerState.`Item ID` AS `Item ID`,
      name,
      price,
      maxSalesPerState.`Total Sales` AS `Total Sales`,
      `Total Revenue`,
      maxSalesPerState.state AS state
    FROM
    (SELECT
       `Item ID`,
       MAX(`Total Sales`) AS `Total Sales`,
       state
     FROM
      (SELECT
         amazon_items.item_id AS `Item ID`,
         price,
         SUM(quantity) AS `Total Sales`,
         state
      FROM amazon_transactions AS itemTransactions
        JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
        JOIN amazon_customer_addresses
          ON itemTransactions.customer_address_id = amazon_customer_addresses.customer_address_id
      WHERE itemTransactions.deleted = FALSE
      GROUP BY amazon_items.item_id, state) AS salesPerState
    GROUP BY state) AS maxSalesPerState
    JOIN (
      SELECT
        amazon_items.item_id  AS `Item ID`,
        name,
        price,
        SUM(quantity) * price AS `Total Revenue`,
        state
      FROM amazon_transactions AS itemTransactions
        JOIN amazon_items ON itemTransactions.item_id = amazon_items.item_id
        JOIN amazon_customer_addresses
          ON itemTransactions.customer_address_id = amazon_customer_addresses.customer_address_id
      WHERE itemTransactions.deleted = FALSE
      GROUP BY amazon_items.item_id, state
    ) AS transactionInfo
    ON transactionInfo.`Item ID` = maxSalesPerState.`Item ID` AND transactionInfo.state = maxSalesPerState.state
    ORDER BY state;
  END //


#Biggest Spenders
CREATE PROCEDURE getBiggestSpenders()
  BEGIN
    SELECT `Customer ID`, Customer, COUNT(`Customer ID`) AS `Total Purchases`, SUM(Cost) AS Spendings FROM
      (SELECT amazon_customers.customer_id AS `Customer ID`,  CONCAT(amazon_customers.first_name, ' ', amazon_customers.last_name) AS Customer,
      transaction_id AS `Transaction ID`, price * quantity AS Cost
    FROM amazon_transactions
    JOIN amazon_customers ON amazon_transactions.customer_id = amazon_customers.customer_id
    JOIN amazon_items ON amazon_transactions.item_id = amazon_items.item_id
    WHERE amazon_transactions.deleted = FALSE) AS customerHistory
    GROUP BY `Customer ID`
    ORDER BY Spendings DESC LIMIT 20;
  END //
DELIMITER ;
