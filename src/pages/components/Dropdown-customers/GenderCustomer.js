import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const GenderCustomer = ({ gender, setGender }) => {
  const handleChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Gender</InputLabel>
      <Select
        autoWidth={false}
        variant="outlined"
        labelId="demo-select-small"
        id="demo-select-small"
        value={gender}
        label="Gender"
        onChange={handleChange}
      >
        <MenuItem value={"Male"}>Male</MenuItem>
        <MenuItem value={"Female"}>Female</MenuItem>
        <MenuItem value={"Prefer Not to Say"}>Prefer Not to Say</MenuItem>
      </Select>
    </FormControl>
  );
};

export default GenderCustomer;
