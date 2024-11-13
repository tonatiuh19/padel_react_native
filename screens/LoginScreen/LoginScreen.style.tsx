import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#000000", // Black background
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
    borderTopRightRadius: 22, // Equivalent to 1.375rem
    borderBottomRightRadius: 22,
  },
  phoneInputTextContainer: {
    backgroundColor: "#000000", // Black background for text container
  },
  error: {
    color: "#ff0000", // Red error text
    marginTop: 5,
    marginBottom: 20,
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
  },
  secondaryButton: {
    backgroundColor: "#000", // Dark gray button background
    color: "#e1dd2a", // White button text
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
  },
  label: {
    color: "#e1dd2a", // White text color
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
