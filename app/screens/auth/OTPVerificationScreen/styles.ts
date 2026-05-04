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
    paddingHorizontal: 16,
  },

  card: {
    width: "100%",
    padding: 20,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
    resizeMode: "contain",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    color: "#111827",
  },

  desc: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 16,
    fontSize: 14,
  },
  
  strong: {
    fontWeight: "bold",
    color: "#111827",
  },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    marginBottom: 12,
    color: "#000000",
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
    color: "#000000",
  },

  iconButton: {
    paddingLeft: 8,
  },
  
  otpContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  
  otpInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 12,
    color: "#000000",
  },

  sendBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5DB6A5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  sendText: {
    color: "#000",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  backWrap: {
    marginTop: 20,
  },

  backText: {
    color: "#5DB6A5",
    fontWeight: "700",
  },
});

export default styles;
