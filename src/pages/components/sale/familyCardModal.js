import {
  Button,
  Container,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  familyCardDefaultPackage,
  familyCardTimePackage,
} from "../../../data/sale";

const FamilyCardModal = ({
  setFamilyCardNumber,
  description,
  handleSelect,
  value,
  balance,
  handlefamilyCardValue,
  setBalance,
  setValue,
  setValdityDate,
  submitFamilyCard,
  serviceTime,
  handleTimePackage,
}) => {
  return (
    <Container
      style={{
        backgroundColor: "white",
        padding: "20px",
        paddingTop: "0px",
        borderRadius: "3px",
      }}
    >
      <FormGroup
        style={{
          display: "inline-block",
          width: "100%",
          fontFamily: "Russo One, sans-serif",
          marginTop: "10px",
        }}
      >
        <InputLabel
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
            color: "black",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Familycard <br />
          Number :
          <Input
            disableUnderline={true}
            required
            size="small"
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              borderRadius: "3px",
              backgroundColor: "white",
            }}
            onChange={(e) => setFamilyCardNumber(e.target.value)}
          ></Input>
        </InputLabel>
      </FormGroup>
      <FormGroup
        style={{
          display: "inline-block",
          width: "100%",
          fontFamily: "Russo One, sans-serif",
          marginTop: "10px",
        }}
      >
        <InputLabel
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
            color: "black",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Package Type :
          <select
            value={description}
            onChange={handleSelect}
            style={{
              width: "80%",
              border: "1px solid Gray",
              borderRadius: "3px",
              padding: "6px",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <option value="">Select Package Type</option>
            <option value="time">Time Package (minutes)</option>
            <option value="custom">Custom Package</option>
          </select>
        </InputLabel>
      </FormGroup>
      {description === "default" && (
        <FormGroup
          style={{
            display: "inline-block",
            width: "100%",
            fontFamily: "Russo One, sans-serif",
            marginTop: "10px",
          }}
        >
          <InputLabel
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
              color: "black",
              fontFamily: "Russo One, sans-serif",
              width: "100%",
            }}
            placeholder="Select Package"
          >
            Family Card <br /> Value :
            <Select
              value={value}
              IconComponent={false}
              variant="standard"
              disableUnderline={true}
              style={{
                width: "80%",
                border: "1px solid Gray",
                borderRadius: "3px",
              }}
              onChange={handlefamilyCardValue}
            >
              {familyCardDefaultPackage?.map((f, x) => (
                <MenuItem key={x} value={f.value}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </InputLabel>
        </FormGroup>
      )}
      {description === "time" && (
        <FormGroup
          style={{
            display: "inline-block",
            width: "100%",
            fontFamily: "Russo One, sans-serif",
            marginTop: "10px",
          }}
        >
          <InputLabel
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
              color: "black",
              fontFamily: "Russo One, sans-serif",
              width: "100%",
            }}
          >
            Time Package :
            <select
              value={value}
              onChange={handleTimePackage}
              style={{
                width: "80%",
                border: "1px solid Gray",
                borderRadius: "3px",
                padding: "6px",
                backgroundColor: "white",
                color: "black",
              }}
            >
              <option value="">Select Package</option>
              {familyCardTimePackage?.map((f, x) => (
                <option key={x} value={f.value}>
                  {f.name} (Rs. {f.value}/-) | Service Time: {f.serviceTime / 60}{" "}
                  Hours | Validity {f.expiry} Months
                </option>
              ))}
            </select>
          </InputLabel>
          {serviceTime ? (
            <p
              style={{
                textAlign: "right",
                margin: "4px 0 0",
                fontSize: "13px",
                color: "green",
              }}
            >
              Balance: {serviceTime} minutes
            </p>
          ) : null}
        </FormGroup>
      )}
      {description === "custom" && (
        <>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
              marginTop: "10px",
            }}
          >
            <InputLabel
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                color: "black",
                fontFamily: "Russo One, sans-serif",
                width: "100%",
              }}
            >
              Balance <br /> (Minutes) :
              <Input
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid Gray",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Time balance in minutes"
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
              marginTop: "10px",
            }}
          >
            <InputLabel
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                color: "black",
                fontFamily: "Russo One, sans-serif",
                width: "100%",
              }}
            >
              Value <br /> (Rs.) :
              <Input
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid Gray",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Amount paid in Rs."
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
              marginTop: "10px",
            }}
          >
            <InputLabel
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                color: "black",
                fontFamily: "Russo One, sans-serif",
                width: "100%",
              }}
            >
              Expiry Date :
              <Input
                type="date"
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid Gray",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
                onChange={(e) => setValdityDate(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
        </>
      )}
      <Button
        style={{
          color: "white",
          borderRadius: "4px",
          backgroundColor: "black",
          border: "0",
          right: "2%",
          marginTop: "20px",
          float: "right",
        }}
        onClick={submitFamilyCard}
      >
        Submit
      </Button>
    </Container>
  );
};

export default FamilyCardModal;
