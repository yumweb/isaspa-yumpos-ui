import { 
  useEffect, 
  useState, 
  useCallback 
} from "react";
import { 
  DatatableWrapper, 
  Filter, 
  TableHeader, 
  TableBody, 
  PaginationOptions,
  Pagination 
} from "react-bs-datatable";
import GiftcardView from "./GiftcardView";
import { Row, Col, Table } from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";

const GiftCard = () => {
  const [sortState, setSortState] = useState({});
  const [count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [filterInput, setFilterInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [giftCard, setGiftCard] = useState({
    isEditing: false,
    editItem: null,
  });

  const header = [
    { title: "GiftCard Number", prop: "giftcardNumber" },
    { title: "Value", prop: "value" },
    { title: "Description", prop: "description" },
    { title: "Customer Name", prop: "firstName" },
    { title: "Active/Inactive", prop: "inactive" },
    { title: "Edit", prop: "edit" },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.

  const getGiftCard = async (page, limit, sortState, number) => {
    setLoading(true);
    const GiftcardRes = await clientAdapter.getGiftCardbyLocation(
      page,
      limit,
      number || null
    );
    GiftcardRes.giftcards.map((g) => {
      g.value = `${Number(g.value).toFixed(2)}`;
      g.description = `${g.description}`;
      g.firstName = g.person?.firstName;
      g.inactive = g.inactive ? "Inactive" : "Active";
      g.edit = (
        <div
          onClick={() => {
            setGiftCard({ isEditing: true, editItem: g });
            setCurrentScreen(1);
          }}
          data={g}
          style={{ color: "skyblue" }}
        >
          Edit
        </div>
      );
    });
    setFilteredDataLength(rowsPerPage);
    setData(GiftcardRes.giftcards);
    setCount(GiftcardRes.count);
    setFilteredData(GiftcardRes.giftcards);
    setMaxPage(Math.ceil(GiftcardRes.count / rowsPerPage));
    setLoading(false);
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
    getGiftCard(currentPage, rowsPerPage, sortState, filterInput);
  }, [sortState, currentPage, rowsPerPage]);

  const handleSearch = (e) => {
    const searchCard = e.target.value;
    setFilterInput(searchCard);

    const GiftCard = data.filter(giftCard => 
      giftCard.giftcardNumber.toLowerCase().includes(searchCard.toLowerCase())
    );
    setFilteredData(GiftCard);
    setCount(GiftCard.length);
  };

  const onClickBack = () => {
    setCurrentScreen(0);
    setGiftCard({ isEditing: false, editItem: null });
    getGiftCard(currentPage, rowsPerPage, sortState, filterInput);
  };

  const onFilter = () => {
    setFilter(filter);
  }

  return (
    <>
      <hr />
      {currentScreen === 0 && (
        <>
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
            <Col className="d-block mb-4 mb-md-0 col-6">
              <div className="">
                <h6
                  className="h6"
                  style={{ fontFamily: "Russo One, sans-serif" }}
                >
                  List of Gift Cards{" "}
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
                  className="input-search"
                  type="text"
                  width="25%"
                  placeholder="Search"
                  name="searchbar"
                  style={{ marginTop: "4px", marginLeft:'1rem'}}
                  value={filterInput}
                  onChange={handleSearch}
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
          )}
        </>
      )}
      {currentScreen === 1 && (
        <GiftcardView onClickBack={onClickBack} giftCard={giftCard} />
      )}
    </>
  );
};
export default GiftCard;
