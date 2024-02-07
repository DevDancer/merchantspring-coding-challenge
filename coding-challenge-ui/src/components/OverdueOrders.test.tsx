import React from 'react';
import { render } from '@testing-library/react';
import { OverdueOrders } from './OverdueOrders';

test('renders OverdueOrders without crashing', () => {
  const { getByText } = render(<OverdueOrders />);
  // replace "Order 1" with actual text from your mock order data
  const orderText = getByText("Overdue Orders");
  expect(orderText).toBeInTheDocument();
});