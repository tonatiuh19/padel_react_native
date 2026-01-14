import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#d1d5db",
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#1f2937",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
});
