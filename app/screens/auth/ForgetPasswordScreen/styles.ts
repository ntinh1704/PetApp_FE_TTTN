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
    marginBottom: 12,
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
    marginBottom: 20,
    fontSize: 14,
  },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    marginBottom: 16,
    color: "#000000",
  },

  sendBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5DB6A5",
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    color: "#000",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  successText: {
    textAlign: "center",
    color: "#10B981",
    fontWeight: "600",
    marginVertical: 20,
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