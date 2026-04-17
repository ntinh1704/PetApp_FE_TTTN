import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* HEADER */
  header: {
    height: 56,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
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

  /* CONTENT */
  content: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
  },

  section: {
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 16,
  },

  petRow: {
    backgroundColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#CCC",
    marginRight: 12,
  },

  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },

  petName: {
    flex: 1,
    fontWeight: "800",
  },

  viewBtn: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },

  viewText: {
    fontWeight: "800",
    color: "#2E7D32",
    fontSize: 13,
  },

  deleteBtn: {
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  deleteText: {
    fontWeight: "800",
    color: "#DC2626",
    fontSize: 13,
  },

  input: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  half: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    fontWeight: "600",
  },

  addBtn: {
    backgroundColor: "#6BC46D",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  addText: {
    color: "#FFF",
    fontWeight: "900",
  },

  imagePicker: {
    height: 300,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  imageText: {
    fontWeight: "700",
    color: "#777",
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  stateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },

  stateText: {
    color: "#6B7280",
    fontWeight: "600",
  },
});
