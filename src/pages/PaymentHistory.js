// import React, { useState } from "react";
// import { DatatableWrapper } from "react-bs-datatable";
// import { Row } from "react-bootstrap";
// import { Col } from "react-bootstrap";
// import { Table } from "react-bootstrap";
// import { TableHeader } from "react-bs-datatable";
// import { TableBody } from "react-bs-datatable";
// import { PaginationOptions } from "react-bs-datatable";
// import { useCallback } from "react";
// import { Pagination } from "react-bs-datatable";
// import { Button } from "react-bootstrap";

// const PaymentHistory = () => {
//   const [sortState, setSortState] = useState({});

//   const [filteredDataLength, setFilteredDataLength] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [maxPage, setMaxPage] = useState(1);
//   const [data, setData] = useState([]);

//   const header = [
//     { title: "Payment Id", prop: "username" },
//     { title: "Amount Paid", prop: "realname" },
//     { title: "Payment Date", prop: "location" },
//     { title: "Subscription Period", prop: "location" },
//     { title: "Mode of Payment", prop: "location" },
//   ];

//   // Randomize data of the table columns.
//   // Note that the fields are all using the `prop` field of the headers.

//   const onSortChange = useCallback((nextProp) => {
//     setSortState(nextProp);
//   }, []);

//   const onPaginationChange = useCallback((nextPage) => {
//     setCurrentPage(nextPage);
//   }, []);

//   const onRowsPerPageChange = useCallback((rowsPerPage) => {
//     setRowsPerPage(rowsPerPage);
//     setCurrentPage(1);
//   }, []);

//   return (
//     <>
//       <hr />
//       <DatatableWrapper body={data} headers={header} isControlled>
//         <Row>
//           <div className="col-4">
//             <h6 className="h6">List of Payment History</h6>
//           </div>
//           <div className="col-2 flex-end">
//             <Button className="new-payment" href="/payments-view">
//               {" "}
//               New Payment{" "}
//             </Button>
//           </div>
//         </Row>
//         <hr />
//         <Table className="data-tables shadow-lg">
//           <TableHeader
//             controlledProps={{
//               sortState,
//               onSortChange,
//               filteredDataLength,
//             }}
//           />
//           <TableBody />
//         </Table>
//         <Row>
//           <Col
//             xs={12}
//             sm={6}
//             lg={4}
//             className="d-flex flex-col justify-content-lg-start align-items-center justify-content-sm-end mb-2 mb-sm-0"
//           >
//             <PaginationOptions
//               controlledProps={{
//                 filteredDataLength,
//                 onRowsPerPageChange,
//                 rowsPerPageOptions: [5, 10, 15, 20],
//                 rowsPerPage,
//               }}
//             />
//           </Col>
//           <Col
//             xs={12}
//             sm={6}
//             lg={4}
//             className="d-flex flex-col justify-content-end align-items-end"
//           >
//             <Pagination
//               controlledProps={{ currentPage, maxPage, onPaginationChange }}
//             />
//           </Col>
//         </Row>
//       </DatatableWrapper>
//     </>
//   );
// };
// export default PaymentHistory;
