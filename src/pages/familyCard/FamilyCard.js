import { useEffect, useState, useCallback } from "react";
import {
  DatatableWrapper,
  Filter,
  TableHeader,
  TableBody,
  PaginationOptions,
  Pagination,
} from "react-bs-datatable";
import FamilyCardView from "./FamilyCardView";
import { Row, Col, Table, Button } from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";

const FamilyCard = () => {
  const [sortState, setSortState] = useState({});
  const [count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [filterInput, setFilterInput] = useState();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [familyCard, setFamilyCard] = useState({
    isEditing: false,
    editItem: null,
  });

  const header = [
    { title: "Familycard Number", prop: "familycardNumber" },
    { title: "Balance", prop: "balance" },
    { title: "Description", prop: "location" },
    { title: "Customer Name", prop: "firstName" },
    { title: "Active/Inactive", prop: "inactive" },
    { title: "Edit", prop: "edit" },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.

  const getFamilyCard = async (page, limit, sortState, number) => {
    setLoading(true);
    const FamilycardRes = await clientAdapter.getFamilyCardbyLocation(
      page,
      limit,
      number || null
    );
    FamilycardRes.familycards.map((f) => {
      f.familycardNumber = f.familycardNumber;
      f.balance = `${Number(f.value).toFixed(2)}`;
      f.description = `${f.description}`;
      f.firstName = f.person ? f.person.firstName : "NA";
      f.inactive = f.inactive ? "Inactive" : "Active";
      f.edit = (
        <div
          onClick={() => {
            setFamilyCard({ isEditing: true, editItem: f });
            setCurrentScreen(1);
          }}
          data={f}
          style={{ color: "skyblue" }}
        >
          Edit
        </div>
      );
    });
    setFilteredDataLength(rowsPerPage);
    setData(FamilycardRes.familycards);
    setFilteredData(FamilycardRes.familycards);
    setCount(FamilycardRes.count);
    setMaxPage(Math.round(FamilycardRes.count / rowsPerPage));
    setLoading(false);
  };

  const handleSearch = () => {
    getFamilyCard(currentPage, rowsPerPage, sortState, filterInput);
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
    getFamilyCard(currentPage, rowsPerPage, sortState, filterInput);
  }, [sortState, currentPage, rowsPerPage]);

  const onClickBack = () => {
    setCurrentScreen(0);
    setFamilyCard({ isEditing: false, editItem: null });
    getFamilyCard(currentPage, rowsPerPage, sortState, filterInput);
  };

  const onFilter = () => {
    setFilter(filter);
  };

  return (
    <>
      <hr />
      {currentScreen === 0 && (
        <>
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
            <Col className="d-block mb-4 mb-md-0 col-6">
              <div className="">
                <h6 className="h6">
                  Family Card{" "}
                  {count ? (
                    <span
                      style={{
                        backgroundColor: "lightgray",
                        color: "black",
                        border: "1px solid gray",
                        padding: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        borderRadius: "50%",
                        marginLeft: "10px",
                      }}
                    >
                      {count}
                    </span>
                  ) : null}
                </h6>
              </div>
            </Col>
          </Row>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <DatatableWrapper body={filteredData} headers={header} isControlled>
              <Row>
                <Filter
                  controlledProps={{
                    filter: "searchbar",
                    onFilter,
                  }}
                />
                <input
                  type="text"
                  name="searchbar"
                  className="input-search"
                  placeholder="Search"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  style={{ marginLeft: "1rem" }}
                />
                <Button
                  className="btn btn-primary"
                  style={{ width: "10%", marginLeft: "1rem" }}
                  onClick={() => handleSearch()}
                >
                  Search
                </Button>
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
                    controlledProps={{
                      currentPage,
                      maxPage,
                      onPaginationChange,
                    }}
                  />
                </Col>
              </Row>
            </DatatableWrapper>
          )}
        </>
      )}
      {currentScreen === 1 && (
        <FamilyCardView onClickBack={onClickBack} familyCard={familyCard} />
      )}
    </>
  );
};
export default FamilyCard;
