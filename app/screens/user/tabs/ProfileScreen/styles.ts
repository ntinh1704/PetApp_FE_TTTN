import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    height: 56,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  content: {
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
    paddingBottom: 24,
  },

  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarWrap: {
    width: 68,
    height: 68,
    position: "relative",
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#E5E7EB",
  },

  avatarEditIcon: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFF",
  },

  signOut: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginBottom: 10,
  },

  signOutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "600",
  },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  profileRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },

  profileLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  profileRowRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    flexShrink: 1,
    gap: 6,
  },

  profileValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },

  profileValueMissing: {
    color: GREEN,
    fontWeight: "700",
  },

  /* ===== Modal ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
    color: "#111827",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  /* ===== Form elements ===== */
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFF",
  },

  formBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#E5E7EB",
  },

  cancelBtnText: {
    color: "#374151",
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: GREEN,
  },

  saveBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },

  genderOptions: {
    flexDirection: "row",
    gap: 8,
  },

  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  genderOptionActive: {
    borderColor: GREEN,
    backgroundColor: "#ECFDF5",
  },

  genderOptionText: {
    color: "#374151",
    fontWeight: "600",
  },

  genderOptionTextActive: {
    color: GREEN,
    fontWeight: "700",
  },

  securityCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
  },

  securityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  securityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  securityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  securityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  passwordInput: {
    marginTop: 10,
  },
});
