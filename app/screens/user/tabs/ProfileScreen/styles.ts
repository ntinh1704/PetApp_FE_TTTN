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

  cover: {
    width: "100%",
    height: 220,
  },

  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 16,
  },

  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
  },

  signOut: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  signOutText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },

  missingBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },

  missingText: {
    fontSize: 12,
    color: "#92400E",
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

  formCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111827",
  },

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

  formActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
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
