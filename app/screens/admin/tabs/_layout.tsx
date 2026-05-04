import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import SidebarScreen from "./SidebarScreen/Sidebar";

const GREEN = "#5CB15A";

export default function AdminTabsLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: GREEN,
          width: 260,
        },
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <SidebarScreen {...props} />
      )}
    >
      <Drawer.Screen name="DashboardScreen/Dashboard" />
      <Drawer.Screen name="BookingManagementScreen/BookingManagement" />
      <Drawer.Screen name="ServiceManagementScreen/ServiceManagement" />
      <Drawer.Screen name="StaffManagementScreen/StaffManagement" />
      <Drawer.Screen name="UserManagementScreen/UserManagement" />
    </Drawer>
  );
}
