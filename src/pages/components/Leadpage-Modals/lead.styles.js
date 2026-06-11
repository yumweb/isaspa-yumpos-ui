const inptlabel = {
    padding: "5px 0px",
    fontFamily: "Russo One, sans-serif",
    width: "19%",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
  };
const inptText = {
  display: "flex",
  border: "1px solid Gray",
  padding: "2px",
  borderRadius: "3px",
  backgroundColor: "#F1F4F5",
};

export const styles = {
  formgroup: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom:'10px'
  },
  inputlabel: {
    ...inptlabel,
    color: "black",
  },
  inputText: {
    ...inptText,
    width: "70%",
  },
  errorText: {
    color: "red",
    fontFamily: "Russo One, sans-serif",
    fontSize: "12px",
  },
};
