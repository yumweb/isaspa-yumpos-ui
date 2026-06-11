import {
  useState,
  useEffect,
  useCallback,
  Fragment
} from "react";
import {
  TableHeader,
  TableBody,
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
} from "react-bs-datatable";
import { Row, Col, Table, Form } from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import { Button } from "@mui/material";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const renderSelectOptions=(categories,stage=0)=>{
  const spaces=Array(stage).fill()
  return categories.map((category)=>(
    <Fragment key={category.id}>
    <option value={category.id} key={category.id} style={{maxWidth:'15rem' }}>
      {spaces.map((_,index)=>(
        <Fragment key={index}>&nbsp;</Fragment>
      ))}
      {category.name}
    </option>
    {(category.children && category.children.length>0) && renderSelectOptions(category.children,stage+3)}
    </Fragment>
  ))
}

const RetailProduct = () => {
  const [sortState, setSortState] = useState({});
  const [count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [searchProduct, setSearchProduct] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [categories, setCategories] = useState([])

  const header = [
    { title: "Name", prop: "name" },
    { title: "Category", prop: "category" },
    { title: "Cost Price", prop: "costPrice" },
    { title: "Selling Price", prop: "unitPrice" },
    { title: "Quantity", prop: "quantity" },
  ];

  const getRetailProduct = async (page, limit, name, category) => {
    const RetailProductRes = await clientAdapter.getRetailProductbyLocation(
      page,
      limit,
      name,
      category
    );
    RetailProductRes.items.map((r) => {
      r.name = r.item.name;
      r.size = r.item.size;
      r.quantity = r.quantity || 0;
      r.category = r.item.category.name || "Uncategorized";
      r.costPrice = `Rs. ${r.item.costPrice}`;
      r.unitPrice = `Rs. ${r.item.unitPrice}`;
    });
    setFilteredDataLength(rowsPerPage);
    setData(RetailProductRes.items);
    setCount(RetailProductRes.count);
    setMaxPage(Math.ceil(RetailProductRes.count / rowsPerPage));
  };

  const getAllCategories = async () => {
    const allCategories = await clientAdapter.getAllCategories()
    setCategories(allCategories)
  }

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
    getRetailProduct(currentPage, rowsPerPage, searchProduct, searchCategory);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getAllCategories()
  }, [])

  const handleSearchProduct = (value) => {
    setSearchProduct(value);
  };

  const onFilter = () => {
    setFilter(filter);
  };

  const handleClickFilter = (page, limit) => {
    getRetailProduct(page, limit, searchProduct, searchCategory);
  };

  return (
    <>
      <hr />
      <>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
          <Col className="d-block mb-4 mb-md-0 col-6">
            <div className="">
              <h6 className="h6" style={{ fontFamily: "Russo One, sans-serif" }}>
                List of Retail Products{" "}
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
                ) : null}
              </h6>
            </div>
          </Col>
        </Row>
        <DatatableWrapper body={data} headers={header} isControlled>
          <section className="m-0">
            <div className="d-flex justify-content-start w-100 mt-3">
              <Filter
                controlledProps={{
                  filter: "searchbar",
                  onFilter,
                }}
              />
              <input
                className="input-search"
                type="text"
                placeholder="Search Retail Product"
                name="searchbar"
                style={{ marginLeft: "10px" }}
                onChange={(e) =>
                  handleSearchProduct(currentPage, rowsPerPage, e.target.value)
                }
              />
              <Form.Select aria-label="Select Category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                style={{ 
                  color: 'gray', 
                  marginLeft: '1rem', 
                  maxWidth:'15rem', 
                  maxHeight: '50vh !important', 
                  overflowY: 'auto !important'
                }}               
              >
                <option value=''>Select Category</option>
                {renderSelectOptions(categories)}
              </Form.Select>
              <Button
                className="search-leads"
                style={{ border: "1px solid lightGray", marginLeft: "1rem" }}
                onClick={() => handleClickFilter(currentPage, rowsPerPage)}
              >
                <FontAwesomeIcon icon={faSearch} style={{ color: "black" }} />
              </Button>
            </div>
          </section>
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
export default RetailProduct;
