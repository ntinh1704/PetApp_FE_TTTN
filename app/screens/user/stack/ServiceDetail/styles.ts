import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: GREEN,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: "#F3F4F6",
  },

  // Gallery
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  activeDot: {
    backgroundColor: "#5CB15A",
    width: 20,
  },
  placeholderImage: {
    width: SCREEN_WIDTH,
    height: 200,
    backgroundColor: "#E8F5F1",
    alignItems: "center",
    justifyContent: "center",
  },

  // Info
  infoContainer: {
    padding: 20,
  },
  serviceName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5CB15A",
  },
  descriptionSection: {
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5CB15A",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  addToCartBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  inCartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inCartBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inCartText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5CB15A",
  },
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5CB15A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  addMoreBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
