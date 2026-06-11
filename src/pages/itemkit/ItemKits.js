import React, { useState } from "react";
import { DatatableWrapper } from "react-bs-datatable";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { TableHeader } from "react-bs-datatable";
import { TableBody } from "react-bs-datatable";
import { PaginationOptions } from "react-bs-datatable";
import { useCallback } from "react";
import { Pagination } from "react-bs-datatable";
import clientAdapter from "../../lib/clientAdapter";
import { useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ItemKits = () => {
  const navigate = useNavigate();
  const [sortState, setSortState] = useState({});
  const [count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState({});
  const [show, setShow] = useState(false);
  const [items, setItems] = useState("");

  const handleClose = () => setShow(false);

  const header = [
    { title: "Item Kit Name", prop: "name" },
    { title: "Cost Price", prop: "costPrice" },
    { title: "Selling Price", prop: "unitPrice" },
    { title: "Actions", prop: "actions" },
  ];

  const getItems = async (page, limit, name) => {
    const ItemsRes = await clientAdapter.getItemsbyLocation(page, limit, name);

    // Handle empty or null itemkits array
    if (!ItemsRes.itemkits || ItemsRes.itemkits.length === 0) {
      setFilteredDataLength(0);
      setData([]);
      setCount(0);
      setMaxPage(1);
      return;
    }

    ItemsRes.itemkits
      .filter((i) => i && i.itemkit) // Filter out null or invalid items
      .map((i) => {
        i.name = (
          <a href="#" onClick={() => getItemDetails(i.itemKitId)}>
            {i.itemkit.name}
          </a>
        );
        i.costPrice = `Rs. ${i.itemkit.costPrice}`;
        i.unitPrice = `Rs. ${i.itemkit.unitPrice}`;
        i.actions = (
          <MuiButton
            size="small"
            variant="contained"
            onClick={() => navigate(`/item-kits/edit/${i.itemKitId}`)}
            style={{ backgroundColor: "#262B40", color: "#fff" }}
          >
            Edit
          </MuiButton>
        );
        return i;
      });

    setFilteredDataLength(rowsPerPage);
    setData(ItemsRes.itemkits);
    setCount(ItemsRes.count);
    setMaxPage(Math.ceil(ItemsRes.count / rowsPerPage));
  };

  const getItemDetails = async (id) => {
    const itemDetails = await clientAdapter.getItemDetails(id);
    setItemData(itemDetails.itemkit.itemkitItems);
    setShow(true);
  };

  const onSortChange = useCallback((nextProp) => {
    setSortState(nextProp);
  }, []);

  const onPaginationChange = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  const onRowsPerPageChange = useCallback((rowsPerPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    getItems(currentPage, rowsPerPage, items);
  }, [currentPage, rowsPerPage]);

  const handleFilter = (page, limit, value) => {
    setItems(value);
    getItems(page, limit, value);
  }

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="modal-2"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Items</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body className="appointment-content">
          {itemData.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {itemData.map((i) => (
                  <tr>
                    <td>{i.item.name}</td>
                    <td>{parseInt(i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <></>
          )}
          <div className="modal-footer">
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              Close
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <hr />
      <>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
          <Col className="d-block mb-4 mb-md-0 col-6">
            <div className="">
              <h6 className="h6">
                Item Kits{" "}
                <span
                  style={{
                    backgroundColor: "lightgray",
                    color: "black",
                    border: " 1px solid gray",
                    padding: "5px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                >
                  {count}
                </span>{" "}
              </h6>
            </div>
          </Col>
        </Row>
        <DatatableWrapper body={data} headers={header} isControlled>
          <Row>
            <input
              className="input-search"
              type="text"
              style={{ marginLeft: "10px" }}
              placeholder="Search Item Kits"
              name="searchbar"
              onChange={(e) => handleFilter(currentPage, rowsPerPage, e.target.value)}
            />
          </Row>
          <hr />
          <Table
            className="data-tables shadow-lg"
            hover="true"
            responsive="true"
            width="auto"
            striped="true"
            style={{
              cursor: "pointer",
              borderBottom: "1px solid lightGray",
              borderRadius: "10px",
              marginTop: "15px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            <TableHeader
              controlledProps={{
                sortState,
                onSortChange,
                filteredDataLength,
              }}
            />
            <TableBody />
          </Table>
          <Row>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-lg-start align-items-center justify-content-sm-end mb-2 mb-sm-0"
            >
              <PaginationOptions
                controlledProps={{
                  filteredDataLength,
                  onRowsPerPageChange,
                  rowsPerPageOptions: [5, 10, 15, 20],
                  rowsPerPage,
                }}
              />
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <Pagination
                controlledProps={{ currentPage, maxPage, onPaginationChange }}
              />
            </Col>
          </Row>
        </DatatableWrapper>
      </>
    </>
  );
};
export default ItemKits;
