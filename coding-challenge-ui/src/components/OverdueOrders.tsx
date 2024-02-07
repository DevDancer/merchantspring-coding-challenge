import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OrdersTable } from "./OrdersTable";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const OrdersBackground = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: #cccccc;
`;

const OrdersWrapper = styled.div`
  margin-top: 5rem;
  width: 80vw;
  min-height: auto;
  max-height: fit-content;
  background-color: white;
  display: block;
  overflow: auto;
`;

const OrdersHeader = styled.header`
  padding: 1.5rem 1.5rem;
  font-family: "Roboto", sans-serif;
`;

export type Order = {
  Id: string;
  storeId: string;
  storeName: string;
  storeCountry: string;
  orderId: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: string;
  orderValue: string;
  marketplace: string;
  daysOverdue: number;
}

export const OverdueOrders = () => {
  const [overdueOrders, setOverdueOrders] = useState<Order[]>([]);
  const [filterToggle, setFilterToggle] = useState(1);
  const [sortIcon, setSortIcon] = useState<IconProp>(faSort)

  useEffect(() => {
    fetch("http://localhost:8080/orders")
      .then(results => results.json())
      .then(data => setOverdueOrders(data));
  }, []);

  const handleSort = () => {
    if (filterToggle % 2 === 0) {
      setOverdueOrders(overdueOrders?.slice(0).sort((a, b) => b.daysOverdue - a.daysOverdue));
      setSortIcon(faSortDown);
    } else {
      setOverdueOrders(overdueOrders?.slice(0).sort((a, b) => a.daysOverdue - b.daysOverdue));
      setSortIcon(faSortUp);
    }
    setFilterToggle(filterToggle + 1);
  };

  return (
    <OrdersBackground>
      <OrdersWrapper>
        <OrdersHeader>Overdue Orders</OrdersHeader>
        <OrdersTable orderItems={overdueOrders} itemsPerPage={5} handleSort={handleSort} sortIcon={sortIcon} />
      </OrdersWrapper>
    </OrdersBackground>
  );

}