import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";
const DARK = "#1E1E1E";

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
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /* ─── Section Card ─── */
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginBottom: 12,
  },

  /* ─── Pet Selector ─── */
  selectBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
  },
  selectBoxOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  selectBoxLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  petAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  selectText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  optionsBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#FFF",
    marginBottom: 4,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },

  /* ─── Service list ─── */
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  serviceItemLast: {
    borderBottomWidth: 0,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
  },
  serviceMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  serviceQty: {
    fontSize: 13,
    color: "#6B7280",
    marginRight: 8,
  },
  removeBtn: {
    padding: 4,
  },

  /* ─── Summary row ─── */
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
  },
  totalPriceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN,
  },

  /* ─── Date / Time pickers ─── */
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
  },
  pickerText: {
    fontSize: 14,
    color: DARK,
  },

  /* ─── Slot display ─── */
  slotDisplay: {
    marginTop: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slotOk: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  slotConflict: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  slotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  slotTextOk: {
    color: "#059669",
  },
  slotTextConflict: {
    color: "#DC2626",
  },

  /* ─── Payment method ─── */
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  paymentOptionSelected: {
    borderColor: GREEN,
    backgroundColor: "#F0FDF4",
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentRadioSelected: {
    borderColor: GREEN,
  },
  paymentRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: DARK,
  },
  paymentDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  /* ─── Notes ─── */
  notesInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: DARK,
    backgroundColor: "#F9FAFB",
    minHeight: 80,
    textAlignVertical: "top",
  },

  /* ─── Bottom Bar & Submit button ─── */
  bottomBar: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  submitBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
