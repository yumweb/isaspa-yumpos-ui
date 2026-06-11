const sInput = {
  border: "1px solid Gray",
  borderRadius: "3px",
  backgroundColor: "#F1F4F5",
  paddingLeft:"12px"
};

const inptText = {
  display: "flex",
  border: "1px solid Gray",
  padding: "2px",
  borderRadius: "3px",
  backgroundColor: "#F1F4F5",
};

const inptlabel = {
  padding: "5px 0px",
  fontFamily: "Russo One, sans-serif",
  width: "19%",
  whiteSpace: "pre-wrap",
  fontSize: "14px",
};

export const styles = {
  header: {
    backgroundColor: "white",
    marginTop: '20px'
  },

  title: {
    padding: "10px"
  },

  titleHeader: {
    padding: "20px 10px",
    paddingTop: "0px",
    borderRadius: "3px",
  },

  formGroup: {
    display: "flex",
    width: "100%",
    fontFamily: "Russo One, sans-serif",
    marginTop: "10px",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  formPercentage: {
    display: "flex",
    width: "100%",
    fontFamily: "Russo One, sans-serif",
    marginTop: "10px",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginLeft: '1rem'
  },

  inputlabel: {
    ...inptlabel,
    color: "black",
  },

  inputlabelRequired: {
    ...inptlabel,
    color: "red",
  },

  errorText: {
    color: "red",
    fontFamily: "Russo One, sans-serif",
    fontSize: "14px",
  },

  inputlabelRequiredWrapper: {
    width: "80%",
  },

  inputTextRequired: {
    ...inptText,
    width: "100%",
  },

  inputText: {
    ...inptText,
    width: "80%",
  },

  selectInput: {
    ...sInput,
    width: "100%",
  },

  selectInputRequired: {
    ...sInput,
    width: "100%",
  },

  footer: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    padding: "7px",
    marginTop: "10px",
  },
  
  button: {
    backgroundColor: "black",
    color: "white",
    borderRadius: "3px",
    position: "relative",
    textTransform: "none",
    fontFamily: "Russo One, sans-serif",
  },

}