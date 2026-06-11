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
// import { Filter } from "react-bs-datatable";
// import { Button } from "@themesberg/react-bootstrap";

// const Expenses = () => {
//   const [sortState, setSortState] = useState({});
//   const [leadCount, setLeadCount] = useState(0);
//   const [filteredDataLength, setFilteredDataLength] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [maxPage, setMaxPage] = useState(1);
//   const [data, setData] = useState([]);
//   const [filter, onFilter] = useState();

//   const header = [
//     { title: "Id", prop: "username" },
//     { title: "Type", prop: "realname" },
//     { title: "Description", prop: "location" },
//     { title: "Category", prop: "location" },
//     { title: "Amount", prop: "location" },
//     { title: "Tax", prop: "location" },
//     { title: "Recipient Name", prop: "location" },
//     { title: "Approved by", prop: "location" },
//   ];

//   // Randomize data of the table columns.
//   // Note that the fields are all using the `prop` field of the headers.
//   const body = Array.from(new Array(57), () => {
//     const rd = (Math.random() * 10).toFixed(1);

//     if (rd > 0.5) {
//       return {
//         username: "i-am-billy",
//         realname: `Billy ${rd}`,
//         location: "Mars",
//       };
//     }

//     return {
//       username: "john-nhoj",
//       realname: `John ${rd}`,
//       location: "Saturn",
//     };
//   });

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
//       <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
//         <Col className="d-block mb-4 mb-md-0 col-6">
//           <div className="">
//             <h6 className="h6">
//               List of Expenses <span className="badge">{leadCount}</span>
//             </h6>
//           </div>
//         </Col>
//       </Row>
//       <DatatableWrapper body={data} headers={header} isControlled>
//         <Row>
//           <div className="col-2">
//             <Filter
//               controlledProps={{
//                 filter: "searchbar",
//                 onFilter,
//               }}
//             />
//             <input
//               className="input-search"
//               type="text"
//               placeholder="Search Expenses"
//               name="searchbar"
//             />
//           </div>
//           <div className="col-2 ">
//             <Button className="new-expense" href="/expenses-view">
//               {" "}
//               New Expense{" "}
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
// export default Expenses;
