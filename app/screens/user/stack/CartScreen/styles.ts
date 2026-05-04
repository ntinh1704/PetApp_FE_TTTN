import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: GREEN,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },
  clearText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#F3F4F6",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  browseBtn: {
    marginTop: 24,
    backgroundColor: "#5CB15A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // List
  listContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  checkboxContainer: {
    paddingRight: 8,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E8F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5CB15A",
  },
  itemDuration: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5CB15A",
    marginTop: 2,
  },

  // Quantity
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginHorizontal: 6,
    minWidth: 18,
    textAlign: "center",
  },

  // Footer
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5CB15A",
  },
  bookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5CB15A",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 12,
    gap: 8,
  },
  bookingBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
