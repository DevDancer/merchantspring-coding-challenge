import React from 'react';
import styled from "styled-components";

const PaginateList = styled.ul`
  display: flex;
  justify-content: right;
  list-style: none;
  font-family: "Roboto", sans-serif;
  li {
    margin: 5px;
    padding: 5px;
  }
  button {
    width: 100%;
    height: 100%;
    background-color: white;
    border: 2px solid white;
    border-radius: 5px;
  }
  .pageNumber {
    padding: 7px;
    border: 2px solid #cacaca;
  }
  .active {
    background-color: aliceblue;
    width: 40px;
  }
`;

type PaginateProps = {
  totalPages: number;
  onPageChange: any;
  currentPage: number;
};

export const Paginate = ({
  totalPages,
  onPageChange,
  currentPage
}: PaginateProps) => {
  return (
    <PaginateList>
      <li>
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange({ selected: 0 })}
        >
          {"<<"}
        </button>
      </li>
      <li>
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={() => onPageChange({ selected: currentPage - 1 })}
        >
          {"<"}
        </button>
      </li>
      {Array.from({ length: totalPages })
        .map((_item, i) => (
          <li key={i}>
            <button
              className={`pageNumber ${currentPage === i && 'active'}`}
              type="button"
              onClick={() => onPageChange({ selected: i })}
            >
              {i + 1}
            </button>
          </li>
        ))
      }
      <li>
        <button
          type="button"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange({ selected: currentPage + 1 })}
        >
          {">"}
        </button>
      </li>
      <li>
        <button
          type="button"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange({ selected: totalPages - 1 })}
        >
          {">>"}
        </button>
      </li>
    </PaginateList>
  );
};