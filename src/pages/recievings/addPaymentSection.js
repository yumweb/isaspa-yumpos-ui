const AddPaymentSection = ({
  paymentMethods,
  handlePaymentMethod,
  cardNumber,
  setCardNumber,
  setAmountTendered,
  amountTendered,
  completeSaleBtnText,
  handleAddPayment,
}) => {
  const setCardValue = (e) => {
    switch (true) {
      case paymentMethods[1].selected:
        setCardNumber({
          ...cardNumber,
          giftCard: { ...cardNumber.giftCard, number: e.target.value },
        });
        break;
      case paymentMethods[2].selected:
        setCardNumber({
          ...cardNumber,
          familyCard: { ...cardNumber.familyCard, number: e.target.value },
        });
        break;
      case paymentMethods[3].selected:
        setCardNumber({
          ...cardNumber,
          cupon: { ...cardNumber.cupon, number: e.target.value },
        });
        break;
      case paymentMethods[6].selected:
        setCardNumber({
          ...cardNumber,
          points: { ...cardNumber.points, number: e.target.value },
        });
        break;
      default:
        break;
    }
  };
  const getCardDetails = () => {
    switch (true) {
      case paymentMethods[1].selected:
        return { name: "Gift Card #", value: cardNumber.giftCard.number };
      case paymentMethods[2].selected:
        return { name: "Family Card #", value: cardNumber.familyCard.number };
      case paymentMethods[3].selected:
        return { name: "Cupon Code #", value: cardNumber.cupon.number };
      case paymentMethods[6].selected:
        return { name: "amount of points", value: cardNumber?.points?.number };
      default:
        return { name: "", value: "" };
    }
  };
  return (
    <>
      <div className="side-heading">Add Payment</div>
      <div className="payment-method-wrapper">
        {paymentMethods.map((p, x) => {
          return (
            <button
              className={`btn ${
                p.selected ? `btn-primary` : `btn-light`
              } payment-method`}
              onClick={() => handlePaymentMethod(p.name)}
              key={x}
            >
              {p.name}
            </button>
          );
        })}
      </div>
      <div className="amount-tendered-wrapper">
        <div className="input-group">
          {paymentMethods[1].selected ||
          paymentMethods[2].selected ||
          paymentMethods[3].selected ||
          paymentMethods[6].selected ? (
            <input
              type="text"
              id="customer"
              name="customer"
              className="amount-tendered"
              placeholder={`Enter ${getCardDetails().name} `}
              value={getCardDetails().value}
              maxLength={10}
              autoComplete="off"
              required
              onChange={(e) => {
                setCardValue(e);
              }}
            />
          ) : (
            <input
              type="text"
              id="customer"
              name="customer"
              className="amount-tendered"
              value={amountTendered}
              maxLength={10}
              autoComplete="off"
              required
              readOnly
              onChange={(e) => {
                amountTendered !== "0.00" && setAmountTendered(e.target.value);
              }}
            />
          )}
          <span className="input-group-addon">
            <button
              className="btn btn-primary"
              id="complete-sale"
              tabIndex="-1"
              onClick={handleAddPayment}
            >
              {completeSaleBtnText.text}
            </button>
          </span>
          <span
            role="status"
            aria-live="polite"
            className="ui-helper-hidden-accessible"
          ></span>
        </div>
      </div>
    </>
  );
};

export default AddPaymentSection;
