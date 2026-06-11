const sInput = {
  border: "1px solid Gray",
  borderRadius: "3px",
};

const inptText = {
  display: "flex",
  border: "1px solid Gray",
  padding: "2px",
  borderRadius: "3px",
};

const inptlabel = {
  padding: "5px 0px",
  fontFamily: "Russo One, sans-serif",
  width: "19%",
  whiteSpace: "pre-wrap",
  fontSize: "14px",
};

export const styles = {
  accordianDetails: {
    backgroundColor: "white",
    padding: "20px 10px",
    paddingTop: "0px",
    borderRadius: "3px",
  },

  formgroup: {
    display: "flex",
    width: "100%",
    fontFamily: "Russo One, sans-serif",
    marginTop: "10px",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  inputlabel: {
    ...inptlabel,
    color: "black",
  },

  inputlabelRequired: {
    ...inptlabel,
    color: "red",
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
    width: "80%",
  },

  selectInputRequired: {
    ...sInput,
    width: "100%",
  },

  errorText: {
    color: "red",
    fontFamily: "Russo One, sans-serif",
    marginLeft: "9rem",
    fontSize: "14px",
  },

  avatar: {
    display: "block",
    textAlign: "center",
    paddingTop: "29px",
    width: "100px",
    height: "100px",
    fontSize: 10,
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
};
