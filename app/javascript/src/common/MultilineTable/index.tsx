import React from "react";
import { useTable, useRowSelect } from "react-table";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const IndeterminateCheckbox = React.forwardRef( // eslint-disable-line react/display-name
  ({ cssClass, indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef: any = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div className="flex items-center relative">
        <input type="checkbox" ref={resolvedRef} {...rest} className="opacity-0 absolute h-8 w-8 custom__checkbox" />
        <div className={`bg-white border-2 border-miru-han-purple-1000 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500 ${cssClass}`}>
          <svg className="custom__checkbox-tick fill-current hidden w-2 h-2 text-miru-han-purple-1000 pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <g transform="translate(-9 -11)" fill="#5B34EA" fillRule="nonzero">
                <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }
);

const getTableCheckbox = checkboxCss => hooks => {
  hooks.visibleColumns.push(columns => [
    {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox cssClass={checkboxCss} {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      Cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox cssClass={checkboxCss} {...row.getToggleRowSelectedProps()} />
        </div>
      )
    },
    ...columns
  ]);
};


const Table = ({
  tableHeader,
  checkboxCss = "",
  RowCss = "",
  tableCss = "",
  getselectedRow = (selectedRows) => { }, // eslint-disable-line
  loadMoreItems,
  lineItems,
  pageNumber,
  tableData
}) => {

  const columns = React.useMemo(() => tableHeader, []);
  const data = React.useMemo(() => tableData, [tableData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    getRowId,
    state: { selectedRowIds },
    useControlledState
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect,
    getTableCheckbox(checkboxCss)
  );

  // useEffect(() => {
  //   getselectedRow(selectedFlatRows);
  // }, [selectedFlatRows]);

  return (
    <>
      <InfiniteScroll
        dataLength={pageNumber * 10}
        next={loadMoreItems}
        hasMore={true}
        height={440}
        loader={<h4>Please wait loading more...</h4>}
      >
        <table className={`min-w-full ${tableCss}`} {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={`table__header px-0 py-3 ${column.cssClass}`} {...column.getHeaderProps()}>{column.render("Header")}</th>
                )
                )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.slice(0, 10).map((row, index) => {
              prepareRow(row);
              const cssClassLastRow = rows.length - 1 !== index ? "border-b" : "";
              return (
                <tr {...row.getRowProps()} className={cssClassLastRow}>
                  {row.cells.map(cell => {
                    if (cell.column.id !== "id") {
                      return (<td className={`table__cell ${RowCss}`} {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    </>
  );
};

export default Table;

Table.proptypes = {
  tableHeader: PropTypes.array,
  tableRowArray: PropTypes.array,
  hasCheckbox: PropTypes.bool,
  hasRowIcons: PropTypes.bool,
  handleDeleteClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  rowOnClick: PropTypes.func,
  tableCss: PropTypes.string
};
