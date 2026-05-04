import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  /* ===== SAFE AREA ===== */
  safe: {
    flex: 1,
    backgroundColor: GREEN,
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
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },  

  notiBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  /* ===== CONTENT ===== */
  content: {
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  cardTitle: {
    flex: 1,
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
    gap: 4,
  },

  cardLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  cardValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "right",
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
