import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8DBD9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginVertical: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#5DB6A5",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    color: "#333",
  },
  loginLink: {
    color: "#5DB6A5",
    fontWeight: "600",
  },
});
