import { 
  useState,
  useEffect,
  useCallback,
 } from "react";
 import {
  TableHeader,
  TableBody,
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
} from "react-bs-datatable";
import { Row, Col, Table } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";
import ServiceBomModal from "./ServiceBomModal";

const Items = () => {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState();
  const [sortState, setSortState] = useState({});
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [services, setServices] = useState('');

  const header = [
    { title: "Name", prop: "name" },
    { title: "Category", prop: "categoryId" },
    { title: "Cost Price", prop: "costPrice" },
    { title: "Selling Price", prop: "unitPrice" },
    { title: "Components", prop: "componentsSummary" },
    { title: "Linked Product", prop: "actions" },
  ];

  const getServices = async (page, limit, name) => {
    const ServiceRes = await clientAdapter.getServicesbyLocation(
      page,
      limit,
      name
    );
    // decorate base fields for table
    ServiceRes.items.map((s) => {
      s.name = s.item.name;
      s.categoryId = s.item.category.name || "Uncategorized";
      s.size = s.item.size;
      s.costPrice = `Rs. ${s.item.costPrice}`;
      s.unitPrice = `Rs. ${s.item.unitPrice}`;
      s.componentsSummary = "—";
      s.actions = s.item?.isService ? (
        <MuiButton
          size="small"
          variant="contained"
          onClick={() => openBomModal(s)}
          style={{ backgroundColor: "#262B40", color: "#fff" }}
        >
          Edit Linked Product
        </MuiButton>
      ) : null;
    });
    setFilteredDataLength(rowsPerPage);
    setData(ServiceRes.items);
    setCount(ServiceRes.count);
    setMaxPage(Math.ceil(ServiceRes.count / rowsPerPage));

    // asynchronously populate BOM summaries for current page
    populateBomSummary(ServiceRes.items);
  };

  const populateBomSummary = async (rows) => {
    try {
      const updated = await Promise.all(
        rows.map(async (r) => {
          try {
            const bom = await clientAdapter.getServiceBom(r.itemId);
            const comps = Array.isArray(bom) ? bom : [];
            if (comps.length === 0) {
              return { ...r, componentsSummary: '0' };
            }
            const names = comps
              .map((c) => c.componentItem?.name || c.componentItemId)
              .filter(Boolean);
            const firstTwo = names.slice(0, 2);
            const remaining = Math.max(0, names.length - 2);
            const node = (
              <div className="components-summary">
                {firstTwo.map((n, i) => (
                  <div key={`${r.itemId}-comp-${i}`}>{n}</div>
                ))}
                {remaining > 0 && (
                  <div style={{ color: '#6c757d' }}>+{remaining} more</div>
                )}
              </div>
            );
            return { ...r, componentsSummary: node };
          } catch (_) {
            return { ...r, componentsSummary: '—' };
          }
        })
      );
      setData(updated);
    } catch (e) {
      // ignore errors in summary fetch
    }
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

  const onFilter = () => {
    setFilter(filter);
  };
  
  useEffect(() => {
    getServices(currentPage, rowsPerPage, services);
  }, [currentPage, rowsPerPage]);

  const handleFilter = (page, limit, value) => {
    setServices(value);
    getServices(page, limit, value);
  }

  const [showBom, setShowBom] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openBomModal = (row) => {
    setSelectedService(row);
    setShowBom(true);
  };

  const handleCloseBom = (saved) => {
    setShowBom(false);
    setSelectedService(null);
    if (saved) {
      // refresh current page
      getServices(currentPage, rowsPerPage, services);
    }
  };

  return (
    <>
      <hr />
      <>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
          <Col className="d-block mb-4 mb-md-0 col-6">
            <div className="">
              <h6 className="h6">
                List of Items{" "}
                {count ? (
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
                  </span>
                ) : null }
              </h6>
            </div>
          </Col>
        </Row>
        <DatatableWrapper body={data} headers={header} isControlled>
          <Row>
            <Filter
              controlledProps={{
                filter: "searchbar",
                onFilter,
              }}
            />
            <input
              className="input-search"
              type="text"
              placeholder="Search Items"
              name="searchbar"
              style={{ marginLeft: "10px" }}
              onChange={(e) =>
                handleFilter(currentPage, rowsPerPage, e.target.value)
              }
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
      <ServiceBomModal show={showBom} onHide={handleCloseBom} serviceRow={selectedService} />
    </>
  );
};
export default Items;
