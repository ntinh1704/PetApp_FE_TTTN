import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  containerNoPadTop: {
    padding: 12,
    paddingTop: 0,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#5CB15A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#5CB15A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 12,
    marginTop: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: "#111827",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoLabel: {
    width: "30%",
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  infoValue: {
    width: "70%",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: "#D1FAE5",
  },
  statusBadgeInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextActive: {
    color: "#065F46",
  },
  statusTextInactive: {
    color: "#991B1B",
  },
  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 3,
  },
  rolePill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rolePillActiveAdmin: {
    backgroundColor: "#5CB15A",
  },
  rolePillActiveUser: {
    backgroundColor: "#3B82F6",
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  rolePillTextActive: {
    color: "#FFFFFF",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteBtnRestore: {
    backgroundColor: "#5CB15A",
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
    marginLeft: 4,
  },
  deleteBtnTextRestore: {
    color: "#FFFFFF",
  },
  disabledOpacity: {
    opacity: 0.5,
  },
  stateText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
    fontSize: 14,
  },
});

