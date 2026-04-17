import { api, getImageUrl } from "@/app/services/api";
import { useNotifications, useUnreadCount } from "@/app/utils/hook/useNotification";
import { usePets } from "@/app/utils/hook/usePets";
import { useServices } from "@/app/utils/hook/useService";
import CartBadge from "@/app/utils/components/CartBadge";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

type CurrentUser = {
  id: number;
  email: string;
  name?: string | null;
  role?: string;
  avatar?: string | null;
};

const resolveDisplayName = (user?: CurrentUser | null) => {
  if (!user) return "Người dùng";
  // Ưu tiên name > username (nếu không phải email) > cắt trước @
  if (user.name && user.name.trim()) return user.name.trim();
  const email = user.email?.trim();
  if (!email) return "Người dùng";
  if (email.includes("@")) return email.split("@")[0] || "Người dùng";
  return email;
};

export default function HomeScreen() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const { data: pets } = usePets();
  const { data: services } = useServices();

  const petList = useMemo(
    () => (Array.isArray(pets) ? pets : ((pets as any)?.data ?? [])),
    [pets],
  );

  const serviceList = useMemo(
    () => (Array.isArray(services) ? services : ((services as any)?.data ?? [])),
    [services],
  );

  useFocusEffect(
    useCallback(() => {
      const loadCurrentUser = async () => {
        try {
          const cachedEmail = await AsyncStorage.getItem("email");
          const usersRes = await api.get<any>("/users");
          const users = Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data?.records ?? usersRes.data?.data ?? [];

          const found = (users as any[]).find(
            (u) => String(u.email).trim() === String(cachedEmail ?? "").trim(),
          );

          if (found) {
            setCurrentUser({
              id: Number(found.id),
              email: found.email,
              name: found.name ?? null,
              role: found.role,
              avatar: found.avatar ?? null,
            });
            return;
          }

          setCurrentUser(cachedEmail ? { id: 0, email: cachedEmail, avatar: null } : null);
        } catch {
          const cachedEmail = await AsyncStorage.getItem("email");
          setCurrentUser(cachedEmail ? { id: 0, email: cachedEmail, avatar: null } : null);
        }
      };

      loadCurrentUser();
    }, [])
  );

  const unreadParams = useMemo(() => {
    if (!currentUser) return null;

    if (currentUser.id > 0) {
      return {
        role: "user" as const,
        user_id: currentUser.id,
      };
    }

    return {
      role: "user" as const,
      email: currentUser.email?.trim().toLowerCase(),
    };
  }, [currentUser]);

  const unreadQuery = useUnreadCount(unreadParams ?? { role: "user" }, Boolean(unreadParams));
  const notificationsQuery = useNotifications(unreadParams ?? { role: "user" }, Boolean(unreadParams));

  useFocusEffect(
    useCallback(() => {
      if (unreadParams) {
        unreadQuery.refetch();
        notificationsQuery.refetch();
      }
      return undefined;
    }, [notificationsQuery, unreadParams, unreadQuery])
  );

  const notifications = notificationsQuery.data ?? [];
  const fallbackUnreadCount = notifications.reduce((acc, item) => acc + (item.is_read ? 0 : 1), 0);
  const unreadCount = Math.max(unreadQuery.data ?? 0, fallbackUnreadCount);
  const displayName = useMemo(() => resolveDisplayName(currentUser), [currentUser]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/screens/user/tabs/ProfileScreen/Profile")}>
            <Image
              source={currentUser?.avatar ? { uri: getImageUrl(currentUser.avatar) } : require("@/app/assets/images/no_avt.jpg")}
              style={styles.headerAvatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.helloText}>Xin chào,</Text>
            <Text style={styles.headerTitle}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <CartBadge color="#FFF" size={22} containerStyle={styles.notiBtn} />

          <TouchableOpacity style={styles.notiBtn} onPress={() => router.push("/screens/user/stack/Notifications/Notifications")}>
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            {unreadCount > 0 && (
              <View style={styles.notiBadge}>
                <Text style={styles.notiBadgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24, minHeight: "100%" }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thú cưng của tôi</Text>
            <TouchableOpacity onPress={() => router.push("/screens/user/tabs/PetsScreen/Pets")}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {petList.length === 0 ? (
            <View style={styles.emptyPetsWrap}>
              <Text style={styles.emptyPetsText}>Bạn chưa có thú cưng nào</Text>
              <TouchableOpacity onPress={() => router.push("/screens/user/tabs/PetsScreen/Pets")}>
                <Text style={styles.addPetNowText}>Thêm thú cưng ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.petList}>
              {petList.map((pet: any) => (
                <TouchableOpacity
                  key={String(pet.id)}
                  style={styles.petItem}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/user/stack/PetsScreen/AddPetsDetails/AddPetsDetail" as any,
                      params: { pet: JSON.stringify(pet) },
                    })
                  }
                >
                  <Image
                    source={pet.image ? { uri: getImageUrl(pet.image) } : require("@/app/assets/images/no_image_pet.jpg")}
                    style={styles.petAvatar}
                  />
                  <Text style={styles.petName}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dịch vụ</Text>
            <TouchableOpacity onPress={() => router.push("/screens/user/tabs/ServiceScreen/Service")}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.serviceList}>
            {serviceList.map((item: any) => (
              <TouchableOpacity
                key={String(item.id)}
                style={styles.serviceItem}
                onPress={() =>
                  router.push({
                    pathname: "/screens/user/stack/ServiceDetail/ServiceDetail" as any,
                    params: { serviceId: item.id },
                  })
                }
              >
                <View style={styles.serviceIcon}>
                  <Ionicons name={(item.icon as any) || "medkit-outline"} size={22} color="#5CB15A" />
                </View>
                <Text style={styles.serviceLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
