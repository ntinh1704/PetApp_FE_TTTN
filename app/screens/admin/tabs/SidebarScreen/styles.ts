import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#5CB15A",
  },
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  profileEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemActive: {
    backgroundColor: "rgba(92,177,90,0.12)",
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  menuTextActive: {
    color: "#5CB15A",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
    marginVertical: 6,
  },
});
