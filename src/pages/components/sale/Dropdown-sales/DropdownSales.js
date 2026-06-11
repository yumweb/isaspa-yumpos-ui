import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { faTv } from "@fortawesome/free-solid-svg-icons";
import Toggles from "./Toggles";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../routes";
const DropdownSales = ({ handleGiftCard, handlefamilyCard, lastSale }) => {
  const navigate = useNavigate();
  return (
    <>
      <Dropdown className="fa-ellipsis">
        <Tooltip title="More Options" placement="top">
          <DropdownToggle
            style={{
              marginLeft: "100px",
              backgroundColor: "black",
              border: "1px solid white",
              color: "white",
              margin: "5px",
              width: "65px",
              height: "30px",
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsisH}
              style={{ marginBottom: "2px" }}
            />
          </DropdownToggle>
        </Tooltip>
        <DropdownMenu basic>
          <DropdownItem className="icons-dropdown" onClick={handleGiftCard}>
            {" "}
            <FontAwesomeIcon icon={faCreditCard} /> Sell GiftCard
          </DropdownItem>
          <DropdownItem className="icons-dropdown" onClick={handlefamilyCard}>
            {" "}
            <FontAwesomeIcon icon={faCreditCard} /> Sell FamilyCard
          </DropdownItem>
          <DropdownItem
            className="icons-dropdown"
            onClick={() => navigate(AppRoutes.SuspendSales.path)}
          >
            {" "}
            <FontAwesomeIcon icon={faWpforms} /> Suspend Sales
          </DropdownItem>
          <DropdownItem
            className="icons-dropdown"
            onClick={() => navigate(AppRoutes.PackageSale.path)}
          >
            {" "}
            <FontAwesomeIcon icon={faGoogleDrive} /> Packages Sale
          </DropdownItem>
          <DropdownItem className="icons-dropdown">
            {" "}
            <FontAwesomeIcon icon={faFile} /> <Toggles />
          </DropdownItem>
          <DropdownItem
            className="icons-dropdown"
            href={`/sales/last-sale-receipt?lastSaleId=${lastSale.id}`}
          >
            {" "}
            <FontAwesomeIcon icon={faFile} /> Show last sale receipt
          </DropdownItem>
          <DropdownItem className="icons-dropdown" href="/customer-display">
            {" "}
            <FontAwesomeIcon icon={faTv} /> Customer Facing Display
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default DropdownSales;
