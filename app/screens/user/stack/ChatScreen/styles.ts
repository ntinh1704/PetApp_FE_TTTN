import { StyleSheet, Platform, StatusBar } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
  },
  header: {
    height: 60,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  chatList: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F3F4F6"
  },
  messageRow: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAI: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: "#5CB15A",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: "#FFFFFF",
  },
  messageTextAI: {
    color: "#1F2937",
  },
  recommendationContainer: {
    marginTop: 12,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
    flex: 1,
  },
  serviceDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },
  serviceBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5CB15A",
  },
  addBtn: {
    backgroundColor: "#5CB15A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: "#000000",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5CB15A",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  sendBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
  },
  suggestionChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  suggestionText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "500",
  },
});
