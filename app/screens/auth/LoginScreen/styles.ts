import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  inputField: {
    flex: 1,
    height: "100%",
  },

  iconButton: {
    paddingLeft: 8,
  },

  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },

  errorText: {
    width: "100%",
    color: "#EF4444",
    marginTop: -6,
    marginBottom: 10,
    fontSize: 12,
  },

  forgotWrap: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  forgot: {
    color: "#5DB6A5",
    fontWeight: "600",
  },

  loginBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5DB6A5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  loginText: {
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

  registerRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },

  registerText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  registerLink: {
    color: "#5DB6A5",
    fontWeight: "700",
  },
});

export default styles;
