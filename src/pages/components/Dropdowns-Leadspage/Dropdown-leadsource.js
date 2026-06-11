import React, { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import clientAdapter from "../../../lib/clientAdapter";
import { MenuProps } from "../../../style/globalStyle";

export default function SelectSmall({ onChange, setLeadSources }) {
  const [selectedSource, setSelectedSource] = React.useState("");
  const [sources, setSources] = React.useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSource(selectedValue);
    onChange(selectedValue);
  };

  const getSources = async () => {
    const response = await clientAdapter.getLeadSource();
    if (response) {
      setSources(response);
      setLeadSources && setLeadSources(response);
    }
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Lead Source</InputLabel>
      <Select
        variant="outlined"
        labelId="demo-select-small"
        id="demo-select-small"
        value={selectedSource}
        label="Lead Source"
        onChange={handleChange}
        autoWidth={true}
        MenuProps={MenuProps}
      >
        {sources?.length > 0 &&
          sources?.map((Sources) => (
            <MenuItem key={Sources?.id} value={Sources?.id}>
              {Sources?.source}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
