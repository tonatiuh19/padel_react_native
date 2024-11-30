import { StyleSheet } from "react-native";

export const ReservationCardStyles = StyleSheet.create({
  card: {
    width: "90%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardValidated: {
    width: "90%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#38612c",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  columnContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  column30: {
    width: "25%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column50: {
    width: "45%",
    justifyContent: "space-between",
  },
  column20: {
    width: "30%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verticalLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#e1dd2a",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  cardTextTitle: {
    fontSize: 14,
    color: "#e1dd2a",
    fontWeight: "900",
    fontFamily: "Kanit-Regular",
  },
  cardTextTitleNumber: {
    fontSize: 26,
    color: "#e1dd2a",
    fontWeight: "900",
    fontFamily: "Kanit-Regular",
  },
  cardText: {
    fontSize: 16,
    color: "#e1dd2a",
    fontFamily: "Kanit-Regular",
  },
  cardTextValue: {
    fontSize: 14,
    color: "#e1dd2a",
    fontWeight: "700",
    marginLeft: 5,
    fontFamily: "Kanit-Regular",
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
