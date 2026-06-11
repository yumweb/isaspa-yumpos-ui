import { useState } from "react";
import { DatatableWrapper } from "react-bs-datatable";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { TableHeader } from "react-bs-datatable";
import { TableBody } from "react-bs-datatable";
import { PaginationOptions } from "react-bs-datatable";
import { useCallback } from "react";
import { Pagination } from "react-bs-datatable";
import { Filter } from "react-bs-datatable";
import clientAdapter from "../../lib/clientAdapter";
import { useEffect } from "react";
import CouponsView from "./CouponsView";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Tooltip } from "@mui/material";
import moment from "moment";

const Coupons = () => {
  const [sortState, setSortState] = useState({});
  const [Count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [filterInput, setFilterInput] = useState("");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cupon, setCupon] = useState({
    isEditing: false,
    editItem: null,
  });

  const header = [
    { title: "Coupon Number", prop: "couponNumber" },
    { title: "Value", prop: "value" },
    { title: "Discount Type", prop: "discountType" },
    { title: "Coupon Type", prop: "couponType" },
    { title: "Customer Name", prop: "firstName" },
    { title: "Created Date", prop: "createdDate" },
    { title: "Status", prop: "inactive" },
    {
      title: "Actions",
      prop: "actions",
      cell: (row) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCoupon(row);
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ color: "#262b40" }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const getCoupons = async (page, limit, sortState, number) => {
    setLoading(true);
    const CouponRes = await clientAdapter.getCouponbyLocation(
      page,
      limit,
      number || null,
      true // Include redeemed coupons
    );
    const couponTypeLabels = {
      manual: "Manual",
      referral: "Referral",
      bounce_back: "Bounce Back",
    };
    const formattedCoupons = CouponRes.coupons.map((c) => ({
      ...c,
      couponNumber: `${c.couponNumber}`,
      value: c.couponOption === "percentage" ? `${c.value}%` : `Rs. ${c.value}`,
      discountType: c.couponOption === "percentage" ? "Percent Discount" : "Price Value",
      couponType: couponTypeLabels[c.couponType] || "Manual",
      firstName: c.person ? c.person.firstName : "",
      createdDate: c.startDate ? moment(c.startDate).format("DD/MM/YYYY") : "",
      inactive: c.deleted ? "Redeemed" : c.inactive ? "Inactive" : "Active",
      // Preserve original data for view
      originalData: { ...c },
    }));
    setFilteredDataLength(rowsPerPage);
    setData(formattedCoupons);
    setCount(CouponRes.count);
    setMaxPage(Math.ceil(CouponRes.count / rowsPerPage));
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
    getCoupons(currentPage, rowsPerPage, sortState, filterInput);
  }, [sortState, currentPage, rowsPerPage]);

  const onFilter = () => {
    setFilter(filter);
  };

  const handleSearch = () => {
    getCoupons(currentPage, rowsPerPage, sortState, filterInput);
  };

  const handleFilter = (e) => {
    setFilterInput(e.target.value);
  };

  const onClickCreateNewCoupon = () => {
    setCupon({ isEditing: false, editItem: null });
    setCurrentScreen(1);
  };

  const handleViewCoupon = (coupon) => {
    setCupon({ isEditing: true, editItem: coupon });
    setCurrentScreen(1);
  };

  const downloadCoupons = async () => {
    try {
      // Fetch all coupons (using a large limit to get all)
      // Include deleted (redeemed) coupons in download
      const CouponRes = await clientAdapter.getCouponbyLocation(1, 10000, null, true);

      if (!CouponRes.coupons || CouponRes.coupons.length === 0) {
        alert("No coupons to download");
        return;
      }

      // CSV headers
      const headers = [
        "Coupon Number",
        "Value",
        "Discount Type",
        "Coupon Type",
        "Customer Number",
        "Customer Name",
        "Created Date",
        "Status",
      ];

      const couponTypeLabels = {
        manual: "Manual",
        referral: "Referral",
        bounce_back: "Bounce Back",
      };

      // Format data for CSV
      const csvData = CouponRes.coupons.map((c) => [
        c.couponNumber,
        c.couponOption === "percentage" ? `${c.value}%` : `Rs. ${c.value}`,
        c.couponOption === "percentage" ? "Percent Discount" : "Price Value",
        couponTypeLabels[c.couponType] || "Manual",
        c.person?.phoneNumber || "",
        c.person ? `${c.person.firstName || ""} ${c.person.lastName || ""}`.trim() : "",
        c.startDate ? moment(c.startDate).format("DD/MM/YYYY") : "",
        c.deleted ? "Redeemed" : c.inactive ? "Inactive" : "Active",
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `coupons_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading coupons:", error);
      alert("Failed to download coupons");
    }
  };

  const onClickBack = () => {
    setCurrentScreen(0);
    setCupon({ isEditing: false, editItem: null });
    getCoupons(currentPage, rowsPerPage, sortState, filterInput);
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
                  List of Coupons{" "}
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
                    {Count}
                  </span>
                </h6>
              </div>
            </Col>
            <Col className="d-flex flex-row justify-content-end align-items-center gap-2 leadpage-Btn">
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faDownload} />}
                sx={{
                  borderColor: "black",
                  color: "black",
                  fontSize: 14,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "black",
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
                onClick={downloadCoupons}
              >
                Download Coupons
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: "black",
                  color: "#fff",
                  fontSize: 14,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                className="customer-title"
                onClick={onClickCreateNewCoupon}
              >
                New Coupon
              </Button>
            </Col>
          </Row>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <DatatableWrapper body={data} headers={header} isControlled>
              <div className="d-flex flex-wrap flex-md-wrap align-items-center ">
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
                  placeholder="Search Coupons"
                  name="searchbar"
                  style={{ marginLeft: "10px" }}
                  value={filterInput}
                  onChange={(e) => handleFilter(e)}
                />

                <div className="w-8 h-5 " style={{ marginLeft: "4px" }}>
                  <Button
                    className=" search-leads"
                    style={{ border: "1px solid lightGray" }}
                    onClick={handleSearch}
                    sx={{ height: "34px" }}
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ color: "black" }}
                    />
                  </Button>
                </div>
              </div>
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
        <CouponsView onClickBack={onClickBack} cupon={cupon} />
      )}
    </>
  );
};
export default Coupons;
