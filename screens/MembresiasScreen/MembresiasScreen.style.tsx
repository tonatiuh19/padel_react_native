import { StyleSheet } from "react-native";

const MembresiasScreenStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#232323",
    borderRadius: 28,
    padding: 28,
    marginBottom: 28,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  priceRow: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  price: {
    fontSize: 40,
    color: "#e1dd2a",
    fontWeight: "bold",
    textAlign: "center",
  },
  period: {
    fontSize: 15,
    color: "#fff",
    marginTop: 2,
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  benefits: {
    width: "100%",
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    width: "100%",
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e1dd2a",
    marginRight: 14,
  },
  benefitLabel: {
    fontSize: 17,
    color: "#fff",
    flex: 1,
  },
  benefitValue: {
    fontSize: 17,
    color: "#e1dd2a",
    fontWeight: "bold",
    marginLeft: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: "#e1dd2a",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#232323",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MembresiasScreenStyles;
