import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Order } from "./OverdueOrders";
import { Paginate } from "./Paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const StyledTableList = styled.table`
  width: 100%;
  font-family: "Roboto", sans-serif;
  text-align: left;
  border-collapse: collapse;
  th {
    background-color: #f2f5f9;
    color: #888888;
    font-weight: light;
    font-size: small;
  }
  td, th {
    border: 1px solid #f0f0f0;
    border-left: none;
    border-right: none;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
  .red {
    color: #be0000;
    padding-left: 60px;
  }
  .items {
    padding-left: 35px;
  }
  .sortButton {
    border: none;
    background-color: #f2f5f9;
  }
`;

type OrdersTableProps = {
  orderItems: Order[];
  itemsPerPage: number;
  handleSort: any;
  sortIcon: IconProp;
}

const getFlagEmoji = (country?: string): string => {
  switch (country) {
    case "AUS":
      return '🇦🇺';
    case "GBR":
      return '🇬🇧';
    case "USA":
      return '🇺🇸';
    default:
      return '';
  }
};

export const OrdersTable = ({ orderItems, itemsPerPage, handleSort, sortIcon }: OrdersTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [subset, setSubset] = useState<Order[]>([]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    setTotalPages(Math.ceil(orderItems.length / itemsPerPage))
    setSubset(orderItems.slice(startIndex, endIndex));
  }, [itemsPerPage, orderItems, endIndex, startIndex]);

  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <StyledTableList>
        <thead>
          <tr>
            <th>MARKETPLACE</th>
            <th>STORE</th>
            <th>ORDER ID</th>
            <th>ORDER VALUE</th>
            <th>ITEMS</th>
            <th>DESTINATION</th>
            <th>DAYS OVERDUE <button 
                className={"sortButton"}
                data-testid={"sortButton"}
                onClick={handleSort}>
                  <FontAwesomeIcon icon={sortIcon} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {subset && subset.map(orderItem => (
            <tr key={orderItem.Id}>
              <td>{getFlagEmoji(orderItem.storeCountry)} {orderItem.marketplace}</td>
              <td>{orderItem.storeName}</td>
              <td>{orderItem.orderId}</td>
              <td>
                {
                  new Intl.NumberFormat(
                    'en-AU',
                    { style: 'currency', currency: 'AUD' }
                  )
                  .format(Number(orderItem.orderValue))
                }
              </td>
              <td className="items">{orderItem.items}</td>
              <td>{orderItem.destination}</td>
              <td className="red">{orderItem.daysOverdue}</td>
            </tr>
          ))}
        </tbody>
      </StyledTableList>
      <Paginate totalPages={totalPages} onPageChange={handlePageChange} currentPage={currentPage} />
    </>
  );
}