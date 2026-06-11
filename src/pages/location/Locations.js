
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";
import clientAdapter from "../../lib/clientAdapter";
import { Col, Row } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

const Locations = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [filterInput, setFilterInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const header = [
    { title: "ID", prop: "locationId" },
    { title: "Name", prop: "name" },
    { title: "Address", prop: "address" },
    { title: "Phone", prop: "phone" },
    { title: "Email", prop: "email" },
    { title: "Action", prop: "action" },
  ];

  const handleFilter = (e) => {
    const searchValue = e.target.value;
    setFilterInput(searchValue);
    const filteredLocations = data.filter((location) =>
      location.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredItems(filteredLocations);
    setCount(filteredLocations.length);
  };

  const getLocations = async (data) => {
    const locations = await clientAdapter.storeLocations(data);
    setData(locations)
    setFilteredItems(locations);
    setCount(locations.length);
  };

  const handleButtonClick = (id) => {
    navigate(`/locations-view?id=${id}`)
  }

  useEffect(() => {
    getLocations(data)
    setData(data);
  }, []);

  const onClickNewLocation = () => {
    navigate(AppRoutes.LocationsView.path);
  };

  return (
    <>
      <hr />
      <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
        <Col className="d-block mb-4 mb-md-0 col-6">
          <div className="">
            <h6 className="h6">
              List of Locations {" "}
              <span
                className="location-badge"
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
            </h6>
          </div> 
        </Col>
        <Col className="d-flex flex-column justify-content-end align-items-end leadpage-Btn">
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{
              textTransform: "capitalize",
              background: "black",
              color: "#fff",
              fontSize: 14,
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            className="customer-title"
            onClick={onClickNewLocation} 
          >
            New Location
          </Button>
        </Col>
      </Row>

      <Box
        sx={{
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          marginTop:"1rem"
        }}
      >
        <input
          className="input-search"
          placeholder="Search Locations"
          name="searchbar"
          value={filterInput}
          onChange={(e) => handleFilter(e)}
          variant="contained"
        />
      </Box>
      <hr />

      <TableContainer 
        component={Paper} 
        sx={{borderRadius: "10px"}}
      >
        <Table>
          <TableHead>
            <TableRow >
              {header.map((item) => (
                <TableCell key={item.prop}>{item.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((row, index) => (
              <TableRow key={index}>
                <TableCell> {row.locationId} </TableCell>
                <TableCell> {row.name} </TableCell>
                <TableCell 
                  sx={{ wordBreak:'break-word'}}
                >
                  {row.address}
                </TableCell>
                <TableCell> {row.phone} </TableCell>
                <TableCell 
                  sx={{ wordBreak:'break-word' }}
                >
                  {row.email}
                </TableCell>
                <TableCell>
                  <Typography
                    color="#337ab7"
                    textTransform='capitalize'
                    sx={{
                      cursor:'pointer',
                      ":hover" : {textDecoration:'underline'},
                    }}
                    onClick={() => handleButtonClick(row.locationId)}
                   >
                    Edit
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Locations;
