import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";

export default function UserManagementScreen() {
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
            <Text style={styles.headerTitle}>Quản lý người dùng</Text>
          </View>
        </View>

        <TextInput
          placeholder="Tìm người dùng..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <View style={styles.sectionDivider} />

        <View style={styles.userCard}>
          <View style={styles.userHeader}>
            <Ionicons name="person" size={18} color="#111827" />
            <Text style={styles.userName}>Nguyễn Văn A</Text>
          </View>
          <Text style={styles.userInfo}>Email: a@gmail.com</Text>
          <Text style={styles.userInfo}>Thú cưng: 2</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionButton}>Xem chi tiết</Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.userCard}>
          <View style={styles.userHeader}>
            <Ionicons name="person" size={18} color="#111827" />
            <Text style={styles.userName}>Trần B</Text>
          </View>
          <Text style={styles.userInfo}>Thú cưng: 1</Text>
        </View>
      </ScrollView>
    </View>
  );
}
