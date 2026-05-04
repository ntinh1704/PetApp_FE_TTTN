import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
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
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },

  avatarWrap: {
    width: 120,
    height: 120,
    alignSelf: "center",
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
  },

  avatarEditIcon: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFF",
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

  footer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  footerButtons: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#5CB15A",
    alignItems: "center",
    flex: 1,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
