import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    backgroundColor: "#F5F7F9",
    padding: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#7A7A7A",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 6,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },
  selectText: {
    fontSize: 14,
    color: "#1E1E1E",
  },
  optionsBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    fontSize: 14,
    color: "#2A2A2A",
  },
  emptyText: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#7A7A7A",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E1E1E",
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
  inputText: {
    fontSize: 14,
    color: "#1E1E1E",
  },
  notesInput: {
    minHeight: 100,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    backgroundColor: "#EEF2F4",
  },
  backBtnText: {
    color: "#334155",
    fontWeight: "600",
  },
  bookBtn: {
    backgroundColor: GREEN,
  },
  bookBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
