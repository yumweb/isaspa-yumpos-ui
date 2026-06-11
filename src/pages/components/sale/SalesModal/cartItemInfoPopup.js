import { Offcanvas, Table } from "react-bootstrap";

const CartItemInfoPopup = ({ open, onClose, item }) => {
  return (
    <Offcanvas
      show={open}
      onHide={onClose}
      placement="top"
      className="cartItemInfoModal"
    >
      <Offcanvas.Header closeButton style={{ padding: "4px 16px" }}>
        <Offcanvas.Title as={"h3"}>Item Information</Offcanvas.Title>
      </Offcanvas.Header>
      <hr />
      <Offcanvas.Body style={{ padding: 1 }}>
        {item?._isGiftCard || item?._isFamilyCard ? (
          <Offcanvas.Title as={"h4"} style={{ margin: "0 16px 8px" }}>
            {item?.name}
          </Offcanvas.Title>
        ) : null}
        <Table responsive striped bordered hover size="sm">
          {item?._isGiftCard || item?._isFamilyCard ? (
            <>
              <thead></thead>
              <tbody>
                <tr>
                  <td>UPC/EAN/ISBN</td>
                  <td>{item.name}</td>
                </tr>
                <tr>
                  <td>Item ID</td>
                  <td>{item?.itemId}</td>
                </tr>
                <tr>
                  <td>Product Id</td>
                  <td>{item?.productId}</td>
                </tr>
                <tr>
                  <td>Item Name</td>
                  <td>{item.name}</td>
                </tr>
                <tr>
                  <td>Quantity</td>
                  <td>{item?.quantityPurchased}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Cost Price</td>
                  <td>{item?.costPrice}</td>
                </tr>
                <tr>
                  <td>Selling Price</td>
                  <td>{item?.itemCostPrice}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{item?.description}</td>
                </tr>
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item?.item?.name}</td>
                  <td>{item?.quantityPurchased}</td>
                </tr>
                <tr>
                  <td>UPC/EAN/ISBN</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Item ID</td>
                  <td>{item?.itemId}</td>
                </tr>
                <tr>
                  <td>Product Id</td>
                  <td>{item?.item?.productId}</td>
                </tr>
                <tr>
                  <td>Item Kit Name</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{item?.item?.category?.name}</td>
                </tr>
                <tr>
                  <td>Cost Price</td>
                  <td>{item?.costPrice}</td>
                </tr>
                <tr>
                  <td>Selling Price</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Item Kit Description</td>
                  <td></td>
                </tr>
              </tbody>
            </>
          )}
        </Table>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartItemInfoPopup;
