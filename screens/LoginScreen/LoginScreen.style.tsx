import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Align items to the bottom
    alignItems: "center", // Center horizontally
    padding: 20,
    backgroundColor: "#000000", // Black background
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20, // Space between the logo and the card container
  },
  cardContainer: {
    backgroundColor: "#1c1c1c", // Dark gray background
    padding: 20,
    borderRadius: 22,
    width: width - 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000", // Black shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20, // Space between the card container and the bottom of the screen
  },
  logo: {
    width: 250, // Adjust the width as needed
    height: 250, // Adjust the height as needed
  },
  logoText: {
    color: "#e1dd2a", // White text color
    fontSize: 24,
    fontFamily: "Kanit-Regular",
    marginTop: 0,
  },
  input: {
    height: 50,
    borderColor: "#e1dd2a", // Dark gray border
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#000000", // Black background for input
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  generalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputError: {
    height: 50,
    borderColor: "#e1dd2a", // Dark gray border
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#000000", // Black background for input
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  generalContainerError: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagContainer: {
    height: 70,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "#000000", // Black background for flag container
    borderColor: "#ad2828", // Dark gray border
    borderWidth: 1,
    borderRightWidth: 0, // Remove left border
  },
  flag: {
    width: 35,
    height: 18,
    marginRight: 8,
    marginLeft: 15,
  },
  pickerContainer: {
    paddingLeft: 15,
    height: 70,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "#000000", // Black background for flag container
    borderColor: "#e1dd2a", // Dark gray border
    borderWidth: 1,
    borderRightWidth: 0, // Remove left border
    borderTopLeftRadius: 22, // Equivalent to 1.375rem
    borderBottomLeftRadius: 22,
  },
  picker: {
    width: 80, // Adjust width to ensure it displays correctly
    color: "#ffffff", // White text color
    fontFamily: "Kanit-Regular",
    backgroundColor: "#000000", // Black background for picker
    fontSize: 14, // Set a reasonable font size
    paddingVertical: 5, // Decrease vertical padding
  },
  hiddenPicker: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  pickerText: {
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    fontSize: 14, // Set a reasonable font size
  },
  pickerTouchable: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  phoneInput: {
    flex: 1,
    height: 70,
    borderColor: "#e1dd2a", // Dark gray border
    borderWidth: 1,
    borderLeftWidth: 0, // Remove right border
    paddingHorizontal: 10,
    backgroundColor: "#000000", // Black background for input
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    borderTopRightRadius: 22, // Equivalent to 1.375rem
    borderBottomRightRadius: 22,
  },
  phoneInputTextContainer: {
    backgroundColor: "#000000", // Black background for text container
  },
  error: {
    color: "#ff0000", // Red error text
    fontFamily: "Kanit-Regular",
    marginTop: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#e1dd2a", // Dark gray button background
    color: "#000", // White button text
    padding: 10,
    borderRadius: 22,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // White button text
    fontFamily: "Kanit-Regular",
  },
  buttonLink: {
    color: "#e1dd2a", // White button text
    padding: 10,
    borderRadius: 22,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonLinkText: {
    color: "#e1dd2a", // White button text
    fontFamily: "Kanit-Regular",
  },
  secondaryButton: {
    backgroundColor: "#000", // Dark gray button background
    color: "#e1dd2a", // White button text
    fontFamily: "Kanit-Regular",
    padding: 10,
    borderRadius: 22,
    borderColor: "#e1dd2a", // Dark gray border
    borderWidth: 1,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  secodnaryButtonText: {
    color: "#e1dd2a", // White button text
    fontFamily: "Kanit-Regular",
  },
  phoneFullNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e1dd2a", // Dark gray border
    backgroundColor: "#000000", // Black background for phone number container
    borderWidth: 1,
    borderRadius: 22, // Equivalent to 1.375rem
  },
  phoneZoneContainer: {
    flexDirection: "row",
    backgroundColor: "#000000", // Black background for phone zone container
    borderWidth: 1,
    borderTopLeftRadius: 22, // Equivalent to 1.375rem
    borderBottomLeftRadius: 22,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 10,
  },
  flagImage: {
    width: 35,
    height: 18,
    marginRight: 8,
    marginLeft: 5,
  },
  phoneZoneText: {
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
  },
  phoneNumberContainer: {
    backgroundColor: "#000000", // Black background for phone number container
    borderWidth: 1,
    borderTopRightRadius: 22, // Equivalent to 1.375rem
    borderBottomRightRadius: 22,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  phoneNumberText: {
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
  },
  label: {
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioText: {
    color: "#ffffff", // White text color
    marginLeft: 10,
  },
  timerResendText: {
    marginTop: 20,
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
    fontSize: 15,
  },
  timerCodecontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  timerCodeText: {
    fontSize: 16,
    color: "#e1dd2a",
  },
  timerCodeTextRed: {
    color: "#e1dd2a",
  },
  termsText: {
    color: "#e1dd2a", // White text color
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginTop: 25,
  },
  linkText: {
    color: "#47914a", // Link color
    textDecorationLine: "underline",
  },
  datePickerContainer: {
    marginLeft: 20, // Example margin
    marginBottom: 20, // Example margin
    borderColor: "#e1dd2a", // Dark gray border
    backgroundColor: "#000000", // Black background for phone number container
    borderWidth: 1,
    borderRadius: 22,
    color: "#e1dd2a", // White text color
  },
  datePicker: {
    color: "#e1dd2a", // White text color
  },
});
