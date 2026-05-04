import { StyleSheet } from "react-native";

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6", /* Match content background */
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
    height: 64,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 0,
    marginHorizontal: 12,
    marginTop: 12,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 0,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4B5563",
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardMt12: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowUnread: {
    backgroundColor: "#E6F4EA",
  },
  rowUnreadCancel: {
    backgroundColor: "#FEF2F2",
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 6,
  },
  highlightText: {
    fontWeight: "bold",
    color: GREEN,
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 4,
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  stateText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginTop: 24,
  },
  thumbnailCancel: {
    backgroundColor: "#FEE2E2",
  },
  titleTextCancel: {
    color: "#B91C1C",
  },
});
