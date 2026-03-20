import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import styles from "./styles";

export default function ServiceManagementScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.iconButton}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={20} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Quản lý dịch vụ</Text>
          </View>
        </View>

        <View style={styles.addRow}>
          <Text style={styles.addText}>+ Thêm dịch vụ</Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Cắt tỉa</Text>
          <Text style={styles.servicePrice}>Giá: 20$</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionButton}>Sửa</Text>
            <Text style={styles.actionButton}>Xóa</Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Tiêm phòng</Text>
          <Text style={styles.servicePrice}>Giá: 30$</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionButton}>Sửa</Text>
            <Text style={styles.actionButton}>Xóa</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
