import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#A8DBD9",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },

  inputWrapper: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  inputField: {
    flex: 1,
    height: "100%",
    color: "#111827",
  },

  iconButton: {
    paddingLeft: 8,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },

  errorText: {
    width: "100%",
    color: "#EF4444",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 12,
    fontWeight: "600",
  },

  registerBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5DB6A5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  registerText: {
    color: "#000",
    fontWeight: "800",
    letterSpacing: 1,
  },

  orText: {
    color: "#6B7280",
    marginBottom: 16,
  },

  socialBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },

  google: {
    backgroundColor: "#6EE7B7",
  },

  socialIcon: {
    width: 20,
    height: 20,
  },

  socialText: {
    fontWeight: "700",
    color: "#000",
  },

  bottomRow: {
    flexDirection: "row",
    marginTop: 16,
  },

  bottomText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  bottomLink: {
    color: "#5DB6A5",
    fontWeight: "700",
  },
});
