import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* Header */
  header: {
    height: 56,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  /* Content */
  content: {
    padding: 16,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  half: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#6BC46D",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
  },
});
