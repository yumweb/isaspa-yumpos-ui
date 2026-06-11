import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import clientAdapter from "../../../lib/clientAdapter";

const DropdownLeadstatus = ({ onChange }) => {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };

  const getStatus = async () => {
    try {
      const response = await clientAdapter.getLeadStatus();
      setStatus(response);
    } catch (error) {
      console.log("error from get lead status", error);
    }
  };

  React.useEffect(() => {
    getStatus();
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Lead Status</InputLabel>
      <Select
        className="dropdown-status"
        autoWidth={false}
        disableUnderline={true}
        variant="outlined"
        labelId="demo-select-small"
        id="demo-select-small"
        value={value}
        label="Lead status"
        onChange={handleChange}
      >
        {status.map((item, index) => (
          <MenuItem key={index} value={item.id}>
            {item.status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownLeadstatus;
