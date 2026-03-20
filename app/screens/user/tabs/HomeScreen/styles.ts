import { StyleSheet } from "react-native";

export const GREEN = "#5CB15A";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREEN,
  },

  header: {
    height: 64,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#FFF",
  },

  helloText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
  },

  notiBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 18,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },

  petList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  petItem: {
    alignItems: "center",
  },

  petAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
  },

  petName: {
    fontSize: 12,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  seeAll: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  serviceList: {
    flexDirection: "row",
    // justifyContent: "space-between",
    flexWrap: "wrap",
  },

  serviceItem: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 20,
  },

  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  serviceLabel: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
});
