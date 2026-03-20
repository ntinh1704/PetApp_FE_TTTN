import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  /* ===== SAFE AREA ===== */
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

  headerSide: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  /* ===== CONTENT ===== */
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* ===== STATES ===== */
  stateWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },

  stateText: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 14,
  },

  /* ===== SERVICE LIST ===== */
  list: {
    gap: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  cardValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  cardActions: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  cardAction: {
    color: GREEN,
    fontWeight: "700",
    fontSize: 13,
  },
});
