import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OrdersTable } from './OrdersTable';
import { Order } from './OverdueOrders';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSort } from '@fortawesome/free-solid-svg-icons';

const mockOrders: Order[] = [
  {
    Id: "4",
    storeId: "1",
    orderId: "OROL1GX1Z7",
    latest_ship_date: "26/10/2022",
    shipment_status: "Pending",
    destination: "VIC AU, 3140",
    items: "3",
    orderValue: "69.99",
    storeName: "Shoes Plus",
    marketplace: "Amazon",
    storeCountry: "AUS",
    daysOverdue: 470
  },
  {
    Id: "5",
    storeId: "3",
    orderId: "OR9JYZ6D9T",
    latest_ship_date: "20/04/2023",
    shipment_status: "Pending",
    destination: "NY US, 10037",
    items: "2",
    orderValue: "30.0",
    storeName: "Great Jeans",
    marketplace: "Amazon",
    storeCountry: "USA",
    daysOverdue: 294
  },
  {
    Id: "6",
    storeId: "2",
    orderId: "OR4HV84XJP",
    latest_ship_date: "4/05/2023",
    shipment_status: "Shipped",
    destination: "LON UK, E1 6AN",
    items: "2",
    orderValue: "32.0",
    storeName: "Snack Co.",
    marketplace: "Ebay",
    storeCountry: "GBR",
    daysOverdue: 280
  },
];

const mockHandleSort = jest.fn();
const mockSortIcon: IconProp = faSort;

test('renders OrdersTable without crashing', () => {
  const { getByText } = render(<OrdersTable orderItems={mockOrders} itemsPerPage={5} handleSort={mockHandleSort} sortIcon={mockSortIcon} />);
  const orderText = getByText("Shoes Plus");
  expect(orderText).toBeInTheDocument();
});

test('pagination works correctly', () => {
  const { getByText } = render(<OrdersTable orderItems={mockOrders} itemsPerPage={1} handleSort={mockHandleSort} sortIcon={mockSortIcon} />);
  const nextPageButton = getByText('>');
  fireEvent.click(nextPageButton);
  const orderText = getByText("Great Jeans");
  expect(orderText).toBeInTheDocument();
});

test('handleSort is called when table header is clicked', () => {
  const { getByTestId } = render(<OrdersTable orderItems={mockOrders} itemsPerPage={5} handleSort={mockHandleSort} sortIcon={mockSortIcon} />);
  const tableHeader = getByTestId('sortButton');
  fireEvent.click(tableHeader);
  expect(mockHandleSort).toHaveBeenCalled();
});