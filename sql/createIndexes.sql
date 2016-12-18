#Index name, id
CREATE INDEX itemNameIndex
  ON amazon_items (name);

CREATE INDEX itemIdIndex
  ON amazon_items (item_id);

#Index id
CREATE INDEX customerIdIndex
  ON amazon_customers(customer_id);

#index id, customer_id, state
CREATE INDEX customerAddressIdIndex
  ON amazon_customer_addresses(customer_address_id);

CREATE INDEX customerAddressCustomerIdIndex
  ON amazon_customer_addresses(customer_id);

CREATE INDEX customerAddressStateIndex
  ON amazon_customer_addresses(state);

#index id
CREATE INDEX warehouseStockIdIndex
  ON amazon_warehouse_stock (stock_id);

#index id, state
CREATE INDEX warehouseShippingIdIndex
  ON amazon_warehouse_ships (ship_id);

CREATE INDEX warehouseShippingStateIndex
  ON amazon_warehouse_ships (state);

#index id, customer id, item id
CREATE INDEX transactionIdIndex
  ON amazon_transactions (transaction_id);

CREATE INDEX transactionCustomerIdIndex
  ON amazon_transactions (customer_id);

CREATE INDEX transactionItemIdIndex
  ON amazon_transactions (item_id);
