import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* ===== HEADER ===== */
  header: {
    height: 56,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingVertical: 12,
    // gap: 5,
  },

  filterItem: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },

  filterItemActive: {
    backgroundColor: GREEN,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  filterTextActive: {
    color: "#FFF",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
    fontSize: 14,
  },

  /* ===== LIST ===== */
  listContent: {
    padding: 16,
    minHeight: "100%",
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  cardDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  /* ===== STATUS BADGE ===== */
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
