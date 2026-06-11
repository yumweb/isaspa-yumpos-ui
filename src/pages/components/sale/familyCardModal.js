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
          <Select
            value={description}
            IconComponent={false}
            variant="standard"
            disableUnderline={true}
            onChange={handleSelect}
            style={{
              width: "80%",
              border: "1px solid Gray",
              borderRadius: "3px",
            }}
          >
            <MenuItem selected value="package">
              Select Package Type
            </MenuItem>
            <MenuItem value="default">Default Package</MenuItem>
            <MenuItem value="time">Time Package (minutes)</MenuItem>
            <MenuItem value="custom">Custom Package</MenuItem>
          </Select>
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
              onChange={handleTimePackage}
            >
              {familyCardTimePackage?.map((f, x) => (
                <MenuItem key={x} value={f.value}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
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
              Familycard <br /> Balance :
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
                placeholder="Amount in numbers only"
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
              Familycard <br /> Value :
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
