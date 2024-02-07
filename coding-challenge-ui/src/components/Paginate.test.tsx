import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Paginate } from './Paginate';

const mockHandlePageChange = jest.fn();

test('renders Paginate without crashing', () => {
  const { getByText } = render(<Paginate totalPages={5} onPageChange={mockHandlePageChange} currentPage={0} />);
  const pageText = getByText("1");
  expect(pageText).toBeInTheDocument();
});

test('handlePageChange is called when page number is clicked', () => {
  const { getByText } = render(<Paginate totalPages={5} onPageChange={mockHandlePageChange} currentPage={0} />);
  const pageNumber = getByText('2');
  fireEvent.click(pageNumber);
  expect(mockHandlePageChange).toHaveBeenCalled();
});

test('correct page number is active', () => {
  const { getByText } = render(<Paginate totalPages={5} onPageChange={mockHandlePageChange} currentPage={2} />);
  const activePageNumber = getByText('3');
  expect(activePageNumber).toHaveClass('active');
});