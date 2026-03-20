import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* HEADER */
  header: {
    height: 64,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
  },

  /* CONTENT */
  content: {
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
    padding: 16,
    paddingBottom: 24,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },

  unreadText: {
    fontWeight: "800",
  },

  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
});
