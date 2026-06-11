import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  InputLabel,
  FormGroup
} from "@mui/material";
import { useEffect, useState } from "react";
import clientAdapter from "../lib/clientAdapter";

const ItemsViewPage = ({toggleOffcanvas}) => {
  const [isbnField, setIsbnField] = useState("");
  const [productId, setProductId] = useState("");
  const [additionalItems, setAdditionalItems] = useState([]);
  const [itemName, setItemName] = useState([]);
  const [categoryField, setCategoryField] = useState(null);
  const [tagsField, setTagsField] = useState([]);
  const [sizeField, setSizeField] = useState("");
  const [supplierField, setSupplierField] = useState("");
  const [orderLevel, setOrderLevel] = useState("");
  const [daysExpiration, setDaysExpiration] = useState("");
  const [description, setDescription] = useState("");
  const [includeTax, setIncludeTax] = useState(true);
  const [onwardsPrice, setOnwardsPrice] = useState(false);
  const [serviceItem, setServiceItem] = useState(true);
  const [altDescription, setAltDescription] = useState(false);
  const [NonSaleableField, setNonSaleableField] = useState(false);
  const [additionalServiceItems, setAdditionalServiceItems] = useState([]);
  const [serialNumber, setSerialNumber] = useState(false);
  const [costPriceWithoutTax, setCostPriceWithoutTax] = useState("");
  const [costPriceDuringSale, setCostPriceDuringSale] = useState(false);
  const [sellingprice, setSellishingPrice] = useState("");
  const [PromoPrice, setPromoPrice] = useState("");
  const [promoStartDate, setPromoStartDate] = useState("");
  const [promoEndDate, setPromoEndDate] = useState("");
  const [defaultCommission, setDefaultCommission] = useState(false);
  const [defaultTax, setDefaultTax] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [inventoryField, setInventoryField] = useState("");
  const [reorderLevelField, setReorderLevelField] = useState("");
  const [locationStore, setLocationStore] = useState("");
  const [overidePrices, setOveridePrices] = useState(false);
  const [overideDefaultTax, setOverideDefaultTax] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [itemNameError, setItemNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [supplierError, setSupplierError] = useState("");
  const [costPriceError, setCostPriceError] = useState("");
  const [sellingPriceError, setsellingPriceError] = useState("");
  const locationInfo = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );
  const [categoriesData, setCategoriesData] = useState([]);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryItem = (event, newValue) => {
    setCategoryField(newValue);
  }

  // --- Create New Item --- //

  const createItemInformation = async () => {
    if (!itemName) {
      setItemNameError("Item Name is Required");
      focusInputById("itemName");
      return;
    }
    setItemNameError("");

    if (!categoryField) {
      setCategoryError("Category is Required");
      focusInputById("categories");
      return;
    }
    setCategoryError("");

    if (!supplierField) {
      setSupplierError("Supplier is Required");
      focusInputById("supplier");
      return;
    }
    setSupplierError("");

    if (!costPriceWithoutTax) {
      setCostPriceError("Cost Price is Required");
      focusInputById("costPrice");
      return;
    }
    setCostPriceError("");

    if (!sellingprice) {
      setsellingPriceError("Selling Price is Required");
      focusInputById("sellingPrice");
      return;
    }
    setsellingPriceError("");

    const data = {
      isbnField,
      productId,
      additionalItems,
      itemName,
      categoryField,
      tagsField,
      sizeField,
      supplierField,
      orderLevel,
      daysExpiration,
      description,
      includeTax,
      onwardsPrice,
      serviceItem,
      altDescription,
      NonSaleableField,
      additionalServiceItems,
      serialNumber,
      costPriceDuringSale,
      costPriceWithoutTax,
      sellingprice,
      PromoPrice,
      promoStartDate,
      promoEndDate,
      defaultCommission,
      defaultTax,
      currentQuantity,
      inventoryField,
      reorderLevelField,
      locationStore,
      overidePrices,
      overideDefaultTax,
    };
  };

  const handleCancelItem = () => {
    toggleOffcanvas();
  };

  const focusInputById = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const getCategoriesItems = async () => {
    const res = await clientAdapter.getItemCategories(0);
    setCategoriesData(res);
  };

  useEffect(() => {
    getCategoriesItems();
  }, []);

  return (
    <>
      <Container
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "3px",
        }}
      >
        <Box>
          <Typography variant="h6">
            Item Information{" "}
            <span
              style={{ fontSize: "12px", fontWeight: "lighter", color: "red" }}
            >
              (Fields in red are required)
            </span>
          </Typography>
        </Box>
        <Box>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "7rem" }}>
                UPC/EAN/ISBN :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "75%",
                  padding: "2px",
                }}
                onChange={(e) => setIsbnField(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "8.2rem" }}>
                PRODUCT ID :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setProductId(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "2.4rem" }}>
                Additional Item Numbers :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setAdditionalItems([e.target.value])}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "red",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "8.9rem" }}>
                Item Name :
              </Typography>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                id="itemName"
                onChange={(e) => setItemName(e.target.value)}
              ></Input>
            </InputLabel>
            <div
              style={{
                color: "red",
                fontFamily: "Russo One, sans-serif",
                marginLeft: "14.2rem",
              }}
            >
              {itemNameError}
            </div>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "red",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginBottom: '0.25rem',
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "9.6rem" }}>
                Category :
              </Typography>
              <Autocomplete
                id="categories"
                disableClearable
                size="small"
                style={{width: "100%"}}
                options={categoriesData}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    variant="outlined"
                    value={categoryField}
                    onChange={handleCategoryItem}
                  />
                )}
                renderOption={(props, option) => (
                  <div 
                    {...props}
                    key={option.id}
                    style={{ paddingLeft: option.level * 20 }} 
                  >
                    {option.name}
                  </div>
                )}
              />
            </InputLabel>
            <a 
              marginTop="0.5rem"
              href="#"
              style={{
                marginLeft: "14.8rem",
                fontWeight: 'normal',
              }}
            >
              Manage Categories
            </a>
            <div
              style={{
                color: "red",
                fontFamily: "Russo One, sans-serif",
                marginLeft: "14.8rem",
              }}
            >
              {categoryError}
            </div>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "11.8rem" }}>Tags :</Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setTagsField([e.target.value])}
              ></Input>
            </InputLabel>
            <a 
              href="#"
              style={{
                marginLeft: "14.8rem",
                fontWeight: 'normal',
              }}
            >
              Manage Tags
            </a>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginTop: '0.25rem',
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{ marginRight: "12rem" }}>
                Size :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setSizeField(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "red",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '10rem'}}>
                Supplier :
              </Typography>
              <Select
                required
                id="supplier"
                variant="standard"
                disableUnderline={true}
                style={{
                  width: "80%",
                  border: "1px solid Gray",
                }}
                onChange={(e) => setSupplierField(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
              </Select>
            </InputLabel>
            <div
              style={{
                color: "red",
                fontFamily: "Russo One, sans-serif",
                marginLeft: "14.2rem",
              }}
            >
              {supplierError}
            </div>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '7.6rem'}}>
                Reorder Level :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setOrderLevel(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '5.4rem'}}>
                Days to Expiration :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setDaysExpiration(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '8.5rem'}}>
                Description :
              </Typography>
              <textarea
                disableUnderline={true}
                size="small"
                rows="2"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.5rem'}}>
                Price Include Tax :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeTax}
                    onChange={(e) => setIncludeTax(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "5.1rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.5rem'}}>
                Has Onwards Price :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={onwardsPrice}
                    onChange={(e) => setOnwardsPrice(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "4.3rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '-1.2rem'}}>
                Is Service Item (Does Not <br />Have Quantity)? :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={serviceItem}
                    onChange={(e) => setServiceItem(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "3.5rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.3rem'}}>
                Non Saleable :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={NonSaleableField}
                    onChange={(e) => setNonSaleableField(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "6.8rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '2.6rem'}}>
                Additional Service Items :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                onChange={(e) => setAdditionalServiceItems([e.target.value])}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.4rem'}}>
                Allow Alt Description :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={altDescription}
                    onChange={(e) => setAltDescription(e.target.checked)}
                  />
                }
                style={{ marginLeft: "3.2rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.4rem'}}>
                Item Has Serial Number :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.checked)}
                  />
                }
                style={{ marginLeft: "2rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0.3rem'}}>
                Choose Avatar :
              </Typography>
              <Input
                readOnly
                value={selectedImageName}
                accept="image/*"
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                  cursor: "no-drop",
                  marginLeft: "6.6rem",
                }}
              />
              <Button 
                variant="contained" 
                size="medium" 
                component="label"
                sx={{ textTransform: "capitalize" }}
              >
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
              </Button>
            </InputLabel>
            <Avatar
              variant="square"
              src={selectedImage}
              alt="Avatar"
              style={{
                width: "100px",
                height: "100px",
                marginLeft: "15rem",
              }}
            >
              Avatar
            </Avatar>
          </FormGroup>
        </Box>
      </Container>
      <Container
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "3px",
        }}
      >
        <Box>
          <Typography variant="h6">
            Pricing and Inventory{" "}
            <span
              style={{ fontSize: "12px", fontWeight: "lighter", color: "red" }}
            >
              (Fields in red are required)
            </span>
          </Typography>
        </Box>
        <Box>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "red",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '2.4rem'}}>
                Cost Price (Without Tax) :
              </Typography>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                id="costPrice"
                onChange={(e) => setCostPriceWithoutTax(e.target.value)}
              ></Input>
            </InputLabel>
            <div
              style={{
                color: "red",
                fontFamily: "Russo One, sans-serif",
                marginLeft: "14rem",
              }}
            >
              {costPriceError}
            </div>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '-3.4rem'}}>
                Change Cost Price During <br />Sale :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={costPriceDuringSale}
                    onChange={(e) => setCostPriceDuringSale(e.target.checked)}
                  />
                } 
                sx={{ marginLeft: "5rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "red",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '7.6rem'}}>
                Selling Price :
              </Typography>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "3px",
                }}
                id="sellingPrice"
                onChange={(e) => setSellishingPrice(e.target.value)}
              ></Input>
            </InputLabel>
            <div
              style={{
                color: "red",
                fontFamily: "Russo One, sans-serif",
                marginLeft: "14.2rem",
              }}
            >
              {sellingPriceError}
            </div>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '7.7rem'}}>
                Promo Price :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  width: "80%",
                  border: "1px solid black",
                  padding: "3px",
                }}
                onChange={(e) => setPromoPrice(e.target.value)}
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
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '5.7rem'}}>
                Promo Start Date :
              </Typography>
              <Input
                type="date"
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
                onChange={(e) => setPromoStartDate(e.target.value)}
              />
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
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '5.9rem'}}>
                Promo End Date :
              </Typography>
              <Input
                type="date"
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
                onChange={(e) => setPromoEndDate(e.target.value)}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '-0.2rem'}}>
                Override Default <br />Commission :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={defaultCommission}
                    onChange={(e) => setDefaultCommission(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "5.8rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '-0.3rem'}}>
                Override Default Tax :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={defaultTax}
                    onChange={(e) => setDefaultTax(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "3.6rem" }}
              />
            </InputLabel>
          </FormGroup>
        </Box>
      </Container>
      <Container
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "3px",
        }}
      >
        <Box>
          <Typography variant="h6">
            {locationInfo.name} (Current Location)
          </Typography>
        </Box>
        <Box>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0rem'}}>
                Current Quantity :
              </Typography>
              <Typography
                sx={{ marginLeft: "5.9rem" }}
                onChange={(e) => setCurrentQuantity(e.target.value)}
              >
                {currentQuantity}
              </Typography>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '1.2rem'}}>
                Inventory To Add/Subtract :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  width: "80%",
                  border: "1px solid black",
                  padding: "3px",
                }}
                onChange={(e) => setInventoryField(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '7rem'}}>
                Reorder Level :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  width: "80%",
                  border: "1px solid black",
                  padding: "3px",
                }}
                onChange={(e) => setReorderLevelField(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: "10px",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '5.3rem'}}>
                Location At Store :
              </Typography>
              <Input
                disableUnderline={true}
                size="small"
                style={{
                  display: "flex",
                  width: "80%",
                  border: "1px solid black",
                  padding: "3px",
                }}
                onChange={(e) => setLocationStore(e.target.value)}
              ></Input>
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0rem'}}>
                Override Prices :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={overidePrices}
                    onChange={(e) => setOveridePrices(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "5.8rem" }}
              />
            </InputLabel>
          </FormGroup>
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
            }}
          >
            <InputLabel
              style={{
                gap: 5,
                width: "100%",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontFamily: "Russo One, sans-serif",
              }}
            >
              <Typography sx={{marginRight: '0rem'}}>
                Override Default Tax :
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={overideDefaultTax}
                    onChange={(e) => setOverideDefaultTax(e.target.checked)}
                  />
                }
                sx={{ marginLeft: "3.4rem" }}
              />
            </InputLabel>
          </FormGroup>
          <div className="modal-footer">
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => handleCancelItem()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="submit"
              onClick={() => createItemInformation()}
            >
              Submit
            </button>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default ItemsViewPage;