import {
  Box,
  Divider,
  FormGroup,
  InputLabel,
  Typography,
  Input,
  Container,
  Button,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { styles } from "./itemkits.styles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clientAdapter from "../../lib/clientAdapter";
import { useParams } from "react-router-dom";

const ItemKitView = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  let abortController;
  const [itemKit, setItemKit] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState("");
  const [upc, setUpc] = useState("");
  const [productId, setProductId] = useState("");
  const [itemKitName, setItemKitName] = useState("");
  const [category, setCatergory] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [priceIncludeTax, setPriceIncludeTax] = useState(true);
  const [onwardsPrice, setOnwardsPrice] = useState(false);
  const [validUpto, setValidUpto] = useState("");
  const [price, setPrice] = useState("");
  const [overrideTax11, setoverrideTax11] = useState("Sales Tax");
  const [overrideTax12, setOverrideTax12] = useState("Sales Tax 2");
  const [overrideTax13, setOverrideTax13] = useState("");
  const [overrideTax14, setOverrideTax14] = useState("");
  const [overrideTax15, setOverrideTax15] = useState("");
  const [taxPercent11, setTaxPercent11] = useState("");
  const [taxPercent12, setTaxPercent12] = useState("");
  const [taxPercent13, setTaxPercent13] = useState("");
  const [taxPercent14, setTaxPercent14] = useState("");
  const [taxPercent15, setTaxPercent15] = useState("");
  const [cumulative1, setCumulative1] = useState(false);
  const [showMoreButton1, setShowMoreButton1] = useState(true);
  const [overrideTax21, setoverrideTax21] = useState("Sales Tax");
  const [overrideTax22, setOverrideTax22] = useState("Sales Tax 2");
  const [overrideTax23, setOverrideTax23] = useState("");
  const [overrideTax24, setOverrideTax24] = useState("");
  const [overrideTax25, setOverrideTax25] = useState("");
  const [taxPercent21, setTaxPercent21] = useState("");
  const [taxPercent22, setTaxPercent22] = useState("");
  const [taxPercent23, setTaxPercent23] = useState("");
  const [taxPercent24, setTaxPercent24] = useState("");
  const [taxPercent25, setTaxPercent25] = useState("");
  const [cumulative2, setCumulative2] = useState(false);
  const [showMoreButton2, setShowMoreButton2] = useState(true);
  const [commission, setCommission] = useState("0");
  const [commissionOptions, setCommissionOptions] = useState("1");
  const [commissionPercents, setCommissionPercents] = useState("1");
  const [catergoryData, setCatergoryData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    itemKitName: "",
    category: "",
    validUpto: "",
    price: "",
  });

  const focusInputById = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
    focusInputById(input);
  };

  const onValidation = () => {
    let isValid = true;
    if (!Object.keys(selectedItems).length) {
      handleError("Atlease 1 or more Item is Required", "selectedItems");
      isValid = false;
      return;
    }

    if (!itemKitName) {
      handleError("Item Kit Name is Required", "itemKitName");
      isValid = false;
      return;
    }

    if (!category) {
      handleError("Category Upto is Required", "category");
      isValid = false;
      return;
    }

    if (!price) {
      handleError("Price is Required", "price");
      isValid = false;
      return;
    }

    if (isValid) {
      return true;
    }
  };

  const locationInfo = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );

  const handleUpc = (e) => {
    setUpc(e.target.value);
  };
  const handleProductId = (e) => {
    setProductId(e.target.value);
  };
  const handleItemKitName = (e) => {
    setItemKitName(e.target.value);
  };
  const handleCategory = (event, newValue) => {
    setCatergory(newValue.id);
  };
  const handleTags = (e) => {
    setTags(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handlePriceIncludeTax = (e) => {
    setPriceIncludeTax(e.target.checked);
  };
  const handleOnwardsPrice = (e) => {
    setOnwardsPrice(e.target.checked);
  };
  const handleValidUpto = (e) => {
    setValidUpto(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleOverrideTax11 = (e) => {
    setoverrideTax11(e.target.value);
  };
  const handleOverrideTax12 = (e) => {
    setOverrideTax12(e.target.value);
  };
  const handleOverrideTax13 = (e) => {
    setOverrideTax13(e.target.value);
  };
  const handleOverrideTax14 = (e) => {
    setOverrideTax14(e.target.value);
  };
  const handleOverrideTax15 = (e) => {
    setOverrideTax15(e.target.value);
  };
  const handleCumulative1 = (e) => {
    setCumulative1(e.target.checked);
  };
  const handleShowMoreTaxes1 = () => {
    setShowMoreButton1(!showMoreButton1);
  };
  const handleTaxPercent11 = (e) => {
    setTaxPercent11(e.target.value);
  };
  const handleTaxPercent12 = (e) => {
    setTaxPercent12(e.target.value);
  };
  const handleTaxPercent13 = (e) => {
    setTaxPercent13(e.target.value);
  };
  const handleTaxPercent14 = (e) => {
    setTaxPercent14(e.target.value);
  };
  const handleTaxPercent15 = (e) => {
    setTaxPercent15(e.target.value);
  };
  const handleOverrideTax21 = (e) => {
    setoverrideTax21(e.target.value);
  };
  const handleOverrideTax22 = (e) => {
    setOverrideTax22(e.target.value);
  };
  const handleOverrideTax23 = (e) => {
    setOverrideTax23(e.target.value);
  };
  const handleOverrideTax24 = (e) => {
    setOverrideTax24(e.target.value);
  };
  const handleOverrideTax25 = (e) => {
    setOverrideTax25(e.target.value);
  };
  const handleTaxPercent21 = (e) => {
    setTaxPercent21(e.target.value);
  };
  const handleTaxPercent22 = (e) => {
    setTaxPercent22(e.target.value);
  };
  const handleTaxPercent23 = (e) => {
    setTaxPercent23(e.target.value);
  };
  const handleTaxPercent24 = (e) => {
    setTaxPercent24(e.target.value);
  };
  const handleTaxPercent25 = (e) => {
    setTaxPercent25(e.target.value);
  };
  const handleCumulative2 = (e) => {
    setCumulative2(e.target.checked);
  };
  const handleShowMoreTaxes2 = () => {
    setShowMoreButton2(!showMoreButton2);
  };
  const handleCommission = (e) => {
    setCommission(e.target.value);
  };
  const handleSelectOption = (e) => {
    setCommissionOptions(e.target.value);
  };
  const handleCommissionPercent = (e) => {
    setCommissionPercents(e.target.value);
  };
  const handleQuantity = (itemId, newQuantity) => {
    setSelectedItems((prevItems) => ({
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        quantity: parseInt(newQuantity) || 0,
      },
    }));
  };

  const getCategoryItemKit = async () => {
    try {
      const res = await clientAdapter.getItemCategories(0);
      setCatergoryData(res[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const kitItems = async (keyword) => {
    try {
      const res = await clientAdapter.searchItems(keyword, null, true);
      console.log(res);
      setItemKit(res);
    } catch (error) {
      setItemKit([]);
    }
  };

  const handleFilter = (e) => {
    const searchValue = e.target.value;
    setFilterInput(searchValue);

    const filteredKits = itemKit.filter((kit) =>
      kit.item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredItems(filteredKits);

    if (searchValue === "") {
      setFilteredItems([]);
    }
  };

  const addItemToTable = (selectedItem) => {
    const existingItem = selectedItems[selectedItem.itemId];

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      setSelectedItems({
        ...selectedItems,
        [selectedItem.itemId]: updatedItem,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [selectedItem.itemId]: { ...selectedItem, quantity: 1 },
      });
    }

    setFilterInput("");
    setFilteredItems([]);
  };

  useEffect(() => {
    kitItems(filterInput);
    getCategoryItemKit();

    // Load existing item kit data in edit mode
    if (isEditMode && id) {
      loadItemKitData(id);
    }
  }, []);

  const loadItemKitData = async (itemKitId) => {
    try {
      const response = await clientAdapter.getItemDetails(itemKitId);
      const itemKitData = response.itemkit;

      // Populate form fields
      setItemKitName(itemKitData.name || "");
      setCatergory(itemKitData.categoryId || "");
      setDescription(itemKitData.description || "");
      setPrice(itemKitData.unitPrice || "");
      setUpc(itemKitData.upc || "");
      setProductId(itemKitData.productId || "");
      setValidUpto(itemKitData.validUpto || "");

      // Populate selected items
      if (itemKitData.itemkitItems && itemKitData.itemkitItems.length > 0) {
        const items = {};
        itemKitData.itemkitItems.forEach((kitItem) => {
          items[kitItem.itemId] = {
            item: kitItem.item, // Keep the nested item structure to match create mode
            itemId: kitItem.itemId,
            quantity: kitItem.quantity,
          };
        });
        setSelectedItems(items);
      }
    } catch (error) {
      console.error("Error loading item kit data:", error);
      toast.error("Failed to load item kit data");
    }
  };

  const deleteItemkit = (itemId) => {
    const itemsArray = Object.values(selectedItems);
    const updatedItems = itemsArray.filter((item) => item.itemId !== itemId);

    const updatedItemsObject = updatedItems.reduce((acc, item) => {
      acc[item.itemId] = item;
      return acc;
    }, {});

    setSelectedItems(updatedItemsObject);
  };

  const createItemKits = async () => {
    if (onValidation()) {
      const data = {
        name: itemKitName,
        categoryId: category,
        taxIncluded: true,
        onwardsPricing: false,
        costPrice: Number(price),
        unitPrice: Number(price),
        description: description || "",
        selectedItems,
      };
      try {
        if (isEditMode) {
          await clientAdapter.updateItemKit(id, data);
          toast.success("Item Kit updated successfully!");
        } else {
          await clientAdapter.createItemKit(data);
          toast.success("Item Kit created successfully!");
        }
        setTimeout(() => {
          window.location.href = "/item-kits";
        }, 1500);
      } catch (error) {
        console.error("error from Item Kit", error);
        // Check if error has response status
        if (error.response && error.response.status) {
          toast.error(`Error ${error.response.status}: Failed to ${isEditMode ? 'update' : 'create'} Item Kit`);
        } else {
          toast.error(`Error ${isEditMode ? 'updating' : 'creating'} Item Kit. Please try again.`);
        }
      }
    }
  };

  const cancelItemKits = () => {
    window.location.href = "/item-kits";
  };

  const SuggestionComponent = ({ filteredItems }) => {
    const ItemKit = ({ kits }) => {
      const onSelectItem = async (itemData) => {
        if (itemData.item) {
          const ires = await clientAdapter.getItemsById(itemData?.itemId);
          if (ires) {
            addItemToTable({
              ...ires,
            });
          }
        }
      };

      return (
        <div className="item" onClick={() => onSelectItem(kits)}>
          {kits.item ? (
            <>
              <div className="item-name">{kits?.item?.name}</div>
              <div className="item-meta">
                {kits?.item?.isService ? "Service" : "Retail Product"} |
                Category:{" "}
                {kits?.item?.category ? kits?.item?.category.name : "NA"}
              </div>
            </>
          ) : null}
        </div>
      );
    };

    return (
      <>
        {filteredItems.length > 0 && (
          <div id="item-search-result" style={{ marginLeft: "14%" }}>
            {filteredItems.map((kits) => (
              <ItemKit kits={kits} key={kits.itemId} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Box style={styles.header}>
        <Typography style={styles.title}>
          {isEditMode ? "Edit Item Kit" : "Item Kit Info"}{" "}
          <span
            style={{
              fontSize: "12px",
              fontWeight: "lighter",
              color: "red",
            }}
          >
            (Fields in red are required)
          </span>
        </Typography>
        <Divider color="black" />
        <Box>
          <Typography fontSize={15} pl={5} pt={1}>
            Item Kits are made up of 1 or more items to see as a group. Add your
            first item using the below field.
          </Typography>
          <Container style={styles.titleHeader}>
            <FormGroup style={styles.formGroup}>
              <InputLabel style={styles.inputlabel}>Add Item :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                value={filterInput}
                onChange={(e) => {
                  abortController && abortController.abort("cleanup");
                  abortController = new AbortController();
                  handleFilter(e, abortController.signal);
                }}
              />
              <div style={styles.errorText}>{errors.selectedItems}</div>
            </FormGroup>
            <SuggestionComponent filteredItems={filteredItems} />
          </Container>
        </Box>
      </Box>
      <Box style={styles.header}>
        <Typography style={styles.title}>
          Items Added{" "}
          <span
            style={{
              fontSize: "12px",
              fontWeight: "lighter",
              color: "red",
            }}
          >
            (Fields in red are required)
          </span>
        </Typography>
        <Divider color="black" />
        <Box>
          <TableContainer sx={{ padding: "1rem" }}>
            <Table style={{ border: "1px solid black" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{
                      border: "1px solid black",
                      width: "50px",
                    }}
                  >
                    Delete
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      border: "1px solid black",
                      width: "180px",
                    }}
                  >
                    Item
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      border: "1px solid black",
                      width: "140px",
                    }}
                  >
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(selectedItems).map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell style={{ border: "1px solid black" }}>
                      <Box
                        style={{
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            cursor: "pointer",
                            color: "red",
                          }}
                          onClick={() => deleteItemkit(item.itemId)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      <Box
                        style={{
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        {item.item.name}
                      </Box>
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      <TextField
                        disableUnderline={true}
                        size="small"
                        type="number"
                        style={{
                          width: "100%",
                        }}
                        value={item?.quantity}
                        onChange={(e) => handleQuantity(item.itemId, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box style={styles.header}>
        <Container style={styles.titleHeader}>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>UPC/EAN/ISBN :</InputLabel>
            <Input
              disableUnderline={true}
              required
              size="small"
              style={styles.inputText}
              value={upc}
              onChange={handleUpc}
            />
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>Product ID :</InputLabel>
            <Input
              disableUnderline={true}
              required
              size="small"
              style={styles.inputText}
              value={productId}
              onChange={handleProductId}
            />
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabelRequired}>
              Item Kit Name :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputTextRequired}
                value={itemKitName}
                onChange={handleItemKitName}
                id="itemKitName"
              />
              <div style={styles.errorText}>{errors.itemKitName}</div>
            </Box>
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabelRequired}>
              Category :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Autocomplete
                id="category"
                disableClearable
                size="small"
                options={catergoryData}
                getOptionLabel={(option) => option.name}
                onChange={handleCategory}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" value={category} />
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
              <div style={styles.errorText}>{errors.category}</div>
            </Box>
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>Tags :</InputLabel>
            <Input
              disableUnderline={true}
              required
              size="small"
              style={styles.inputText}
              value={tags}
              onChange={handleTags}
            />
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>
              Item Kit Description :
            </InputLabel>
            <Input
              disableUnderline={true}
              required
              size="small"
              rows={4}
              multiline
              style={styles.inputText}
              id="itemKitDescription"
              value={description}
              onChange={handleDescription}
            />
          </FormGroup>
          {/* <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>
              Prices Include Tax :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Checkbox
                checked={priceIncludeTax}
                onChange={handlePriceIncludeTax}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </FormGroup> */}
          {/* <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>
              Has Onwards Price :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Checkbox
                checked={onwardsPrice}
                onChange={handleOnwardsPrice}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </FormGroup> */}
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>Valid Upto :</InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Input
                disableUnderline={true}
                required
                size="small"
                type="date"
                style={styles.inputTextRequired}
                value={validUpto}
                onChange={handleValidUpto}
                id="validUpto"
              >
                <span>
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
              </Input>
            </Box>
          </FormGroup>
          <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabelRequired}>
              Price (Tax Inclusive) :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputTextRequired}
                value={price}
                onChange={handlePrice}
                id="price"
                type="number"
                placeholder="Enter price including tax"
              />
              <div style={styles.errorText}>{errors.price}</div>
            </Box>
          </FormGroup>
          {/* <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>
              Override Default Commission :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Checkbox
                checked={overrideDefaultComm}
                onChange={handleOverrideDefaultCommission}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </FormGroup> */}
          {/* {overrideDefaultComm && (
            <>
              <Typography>
                Percent commission is based on the selling price or profit of an
                item
              </Typography>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel}>Commission :</InputLabel>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  value={commission}
                  onChange={handleCommission}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel} />
                <Box sx={styles.inputlabelRequiredWrapper}>
                  <Select
                    IconComponent={false}
                    variant="standard"
                    disableUnderline={true}
                    style={styles.selectInput}
                    value={commissionOptions}
                    onChange={handleSelectOption}
                  >
                    <MenuItem value="1">Percentage</MenuItem>
                    <MenuItem value="2">Fixed Amount</MenuItem>
                  </Select>
                </Box>
              </FormGroup>
              {commissionOptions !== "2" && (
                <>
                  <FormGroup style={styles.formGroup}>
                    <InputLabel style={styles.inputlabel}>
                      Commission Percent Calculation Method :
                    </InputLabel>
                    <Box sx={styles.inputlabelRequiredWrapper}>
                      <Select
                        IconComponent={false}
                        variant="standard"
                        disableUnderline={true}
                        style={styles.selectInput}
                        value={commissionPercents}
                        onChange={handleCommissionPercent}
                      >
                        <MenuItem value="1">Selling Price</MenuItem>
                        <MenuItem value="2">Profit</MenuItem>
                      </Select>
                    </Box>
                  </FormGroup>
                </>
              )}
            </>
          )} */}
          {/* <FormGroup style={styles.formGroup}>
            <InputLabel style={styles.inputlabel}>
              Override Default Tax :
            </InputLabel>
            <Box sx={styles.inputlabelRequiredWrapper}>
              <Checkbox
                checked={overrideDefaultTax}
                onChange={handleOverrideDefaultTax}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </FormGroup> */}
          {/* {overrideDefaultTax && (
            <>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel}>Tax 1 :</InputLabel>
                <Input
                  placeholder="Tax Name"
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  value={overrideTax11}
                  onChange={handleOverrideTax11}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel} />
                <Input
                  placeholder="Tax Percent"
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="taxPercent11"
                  value={taxPercent11}
                  onChange={handleTaxPercent11}
                />
              </FormGroup>
              <FormGroup style={styles.formPercentage}>
                <InputLabel style={styles.inputlabel} />
                <Typography> % </Typography>
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel}>Tax 2 :</InputLabel>
                <Input
                  placeholder="Tax Name"
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  value={overrideTax12}
                  onChange={handleOverrideTax12}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <InputLabel style={styles.inputlabel} />
                <Input
                  placeholder="Tax Percent"
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="taxPercent12"
                  value={taxPercent12}
                  onChange={handleTaxPercent12}
                />
              </FormGroup>
              <FormGroup style={styles.formPercentage}>
                <InputLabel style={styles.inputlabel} />
                <Typography> % </Typography>
              </FormGroup>
              <FormGroup>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "14rem",
                  }}
                >
                  <Checkbox
                    checked={cumulative1}
                    onChange={handleCumulative1}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <Typography>Cumulative?</Typography>
                </Box>
                <Typography
                  color="#005be9"
                  sx={{
                    textTransform: "capitalize",
                    ":hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                    marginLeft: "15rem",
                    marginTop: "0.3rem",
                  }}
                  onClick={handleShowMoreTaxes1}
                >
                  {showMoreButton1 ? "Show More" : null}
                </Typography>
                {!showMoreButton1 && (
                  <>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel}>Tax 3 :</InputLabel>
                      <Input
                        placeholder="Tax Name"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        value={overrideTax13}
                        onChange={handleOverrideTax13}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel} />
                      <Input
                        placeholder="Tax Percent"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        id="taxPercent13"
                        value={taxPercent13}
                        onChange={handleTaxPercent13}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formPercentage}>
                      <InputLabel style={styles.inputlabel} />
                      <Typography> % </Typography>
                    </FormGroup>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel}>Tax 4 :</InputLabel>
                      <Input
                        placeholder="Tax Name"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        value={overrideTax14}
                        onChange={handleOverrideTax14}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel} />
                      <Input
                        placeholder="Tax Percent"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        id="taxPercent14"
                        value={taxPercent14}
                        onChange={handleTaxPercent14}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formPercentage}>
                      <InputLabel style={styles.inputlabel} />
                      <Typography> % </Typography>
                    </FormGroup>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel}>Tax 5 :</InputLabel>
                      <Input
                        placeholder="Tax Name"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        value={overrideTax15}
                        onChange={handleOverrideTax15}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formGroup}>
                      <InputLabel style={styles.inputlabel} />
                      <Input
                        placeholder="Tax Percent"
                        disableUnderline={true}
                        required
                        size="small"
                        style={styles.inputText}
                        id="taxPercent15"
                        value={taxPercent15}
                        onChange={handleTaxPercent15}
                      />
                    </FormGroup>
                    <FormGroup style={styles.formPercentage}>
                      <InputLabel style={styles.inputlabel} />
                      <Typography> % </Typography>
                    </FormGroup>
                  </>
                )}
              </FormGroup>
            </>
          )} */}
        </Container>
      </Box>
      {/* <Box style={styles.header}>
        <Typography style={styles.title}>
          {locationInfo.name} (Current Location)
        </Typography>
        <Divider color="black" />
        <Box>
          <Container style={styles.titleHeader}>
            <FormGroup style={styles.formGroup}>
              <InputLabel style={styles.inputlabel}>
                Override Prices :
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Checkbox
                  checked={overridePrices}
                  onChange={handleOverridePrices}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
            </FormGroup>
            {overridePrices && (
              <>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel}>
                    Cost Price (Without Tax) :
                  </InputLabel>
                  <Input
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    value={costPriceWithoutTax2}
                    onChange={handleCostPriceWithoutTax2}
                  />
                </FormGroup>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel}>
                    Selling Price :
                  </InputLabel>
                  <Input
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    value={sellingPrice2}
                    onChange={handleSellingPrice2}
                  />
                </FormGroup>
              </>
            )}
            <FormGroup style={styles.formGroup}>
              <InputLabel style={styles.inputlabel}>
                Override Default Tax :
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Checkbox
                  checked={overrideDefaultTax2}
                  onChange={handleOverrideDefaultTax2}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
            </FormGroup>
            {overrideDefaultTax2 && (
              <>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel}>Tax 1 :</InputLabel>
                  <Input
                    placeholder="Tax Name"
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    value={overrideTax21}
                    onChange={handleOverrideTax21}
                  />
                </FormGroup>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel} />
                  <Input
                    placeholder="Tax Percent"
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    id="taxPercent21"
                    value={taxPercent21}
                    onChange={handleTaxPercent21}
                  />
                </FormGroup>
                <FormGroup style={styles.formPercentage}>
                  <InputLabel style={styles.inputlabel} />
                  <Typography> % </Typography>
                </FormGroup>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel}>Tax 2 :</InputLabel>
                  <Input
                    placeholder="Tax Name"
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    value={overrideTax22}
                    onChange={handleOverrideTax22}
                  />
                </FormGroup>
                <FormGroup style={styles.formGroup}>
                  <InputLabel style={styles.inputlabel} />
                  <Input
                    placeholder="Tax Percent"
                    disableUnderline={true}
                    required
                    size="small"
                    style={styles.inputText}
                    id="taxPercent22"
                    value={taxPercent22}
                    onChange={handleTaxPercent22}
                  />
                </FormGroup>
                <FormGroup style={styles.formPercentage}>
                  <InputLabel style={styles.inputlabel} />
                  <Typography> % </Typography>
                </FormGroup>
                <FormGroup>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "14rem",
                    }}
                  >
                    <Checkbox
                      checked={cumulative2}
                      onChange={handleCumulative2}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <Typography>Cumulative?</Typography>
                  </Box>
                  <Typography
                    color="#005be9"
                    sx={{
                      textTransform: "capitalize",
                      ":hover": {
                        textDecoration: "underline",
                      },
                      cursor: "pointer",
                      marginLeft: "15rem",
                      marginTop: "0.3rem",
                    }}
                    onClick={handleShowMoreTaxes2}
                  >
                    {showMoreButton2 ? "Show More" : null}
                  </Typography>
                  {!showMoreButton2 && (
                    <>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel}>
                          Tax 3 :
                        </InputLabel>
                        <Input
                          placeholder="Tax Name"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          value={overrideTax23}
                          onChange={handleOverrideTax23}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel} />
                        <Input
                          placeholder="Tax Percent"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          id="taxPercent23"
                          value={taxPercent23}
                          onChange={handleTaxPercent23}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formPercentage}>
                        <InputLabel style={styles.inputlabel} />
                        <Typography> % </Typography>
                      </FormGroup>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel}>
                          Tax 4 :
                        </InputLabel>
                        <Input
                          placeholder="Tax Name"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          value={overrideTax24}
                          onChange={handleOverrideTax24}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel} />
                        <Input
                          placeholder="Tax Percent"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          id="taxPercent24"
                          value={taxPercent24}
                          onChange={handleTaxPercent24}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formPercentage}>
                        <InputLabel style={styles.inputlabel} />
                        <Typography> % </Typography>
                      </FormGroup>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel}>
                          Tax 5 :
                        </InputLabel>
                        <Input
                          placeholder="Tax Name"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          value={overrideTax25}
                          onChange={handleOverrideTax25}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formGroup}>
                        <InputLabel style={styles.inputlabel} />
                        <Input
                          placeholder="Tax Percent"
                          disableUnderline={true}
                          required
                          size="small"
                          style={styles.inputText}
                          id="taxPercent25"
                          value={taxPercent25}
                          onChange={handleTaxPercent25}
                        />
                      </FormGroup>
                      <FormGroup style={styles.formPercentage}>
                        <InputLabel style={styles.inputlabel} />
                        <Typography> % </Typography>
                      </FormGroup>
                    </>
                  )}
                </FormGroup>
              </>
            )}
          </Container>
        </Box>
      </Box> */}
      <Box sx={styles.footer}>
        <Button style={styles.button} onClick={cancelItemKits}>
          Cancel
        </Button>
        <Button
          style={{ ...styles.button, marginLeft: 8 }}
          onClick={createItemKits}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default ItemKitView;
