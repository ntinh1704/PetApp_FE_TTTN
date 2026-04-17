import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5CB15A",
    height: 56,
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FFF" },
  scrollContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  label: { fontSize: 14, color: "#6B7280", flex: 1 },
  value: { fontSize: 14, color: "#111827", flex: 2, textAlign: "right" },
  footer: { padding: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderColor: "#E5E7EB" },
  cancelBtn: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
    flex: 1,
  },
  cancelBtnText: { color: "#DC2626", fontSize: 16, fontWeight: "600" },
  payBtn: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#5CB15A",
    alignItems: "center",
    flex: 1,
  },
  payBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 8, textAlign: "center" },
  modalSubtitle: { fontSize: 14, color: "#6B7280", marginBottom: 16, textAlign: "center", lineHeight: 20 },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: { flexDirection: "row", gap: 12 },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnSecondary: { backgroundColor: "#F3F4F6" },
  modalBtnPrimary: { backgroundColor: "#DC2626" },
  modalBtnText: { color: "#FFF", fontWeight: "600", fontSize: 15 },
  modalBtnSecondaryText: { color: "#4B5563", fontWeight: "600", fontSize: 15 },

  // Badge styles (matching History)
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-end", // Align right in the row
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
