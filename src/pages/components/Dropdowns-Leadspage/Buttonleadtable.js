import { Dropdown } from "@themesberg/react-bootstrap";
import DropdownMenu from "@themesberg/react-bootstrap/lib/esm/DropdownMenu";
import DropdownToggle from "@themesberg/react-bootstrap/lib/esm/DropdownToggle";
import DropdownItem from "@themesberg/react-bootstrap/lib/esm/DropdownItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LeadGenerator from "../Leadpage-Modals/LeadGeneratorModal";

const NewLead = () => {
  return (
    <>
      <Dropdown className="cog-plus">
        <DropdownToggle className="faplus">
          <i>
            <FontAwesomeIcon icon={faPlus} />
          </i>
        </DropdownToggle>
        <DropdownMenu basic>
          <DropdownItem>
            {" "}
            <LeadGenerator />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default NewLead;
