import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getImageUrl } from "../../../../services/api";
import { useServices } from "../../../../utils/hook/useService";
import { useCart } from "../../../../utils/contexts/CartContext";
import { styles } from "./styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { data: services, isLoading } = useServices();
  const { addItem, items } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const serviceList = useMemo(
    () => (Array.isArray(services) ? services : ((services as any)?.data ?? [])),
    [services],
  );

  const service = useMemo(
    () => serviceList.find((s: any) => String(s.id) === String(serviceId)),
    [serviceList, serviceId],
  );

  const isInCart = useMemo(
    () => items.some((i) => i.service.id === service?.id),
    [items, service],
  );

  const cartItem = useMemo(
    () => items.find((i) => i.service.id === service?.id),
    [items, service],
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5AB198" />
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết dịch vụ</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: "#6B7280", fontSize: 16 }}>Không tìm thấy dịch vụ</Text>
        </View>
      </SafeAreaView>
    );
  }

  const images: string[] = service.images && service.images.length > 0 ? service.images : [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {service.name}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        {images.length > 0 ? (
          <View>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setActiveImageIndex(index);
              }}
            >
              {images.map((url, idx) => (
                <Image
                  key={idx}
                  source={{ uri: getImageUrl(url) }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </Animated.ScrollView>
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_, idx) => {
                  const inputRange = [
                    (idx - 1) * SCREEN_WIDTH,
                    idx * SCREEN_WIDTH,
                    (idx + 1) * SCREEN_WIDTH,
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 20, 8],
                    extrapolate: "clamp",
                  });

                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: "clamp",
                  });

                  const backgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ["#D1D5DB", "#5CB15A", "#D1D5DB"],
                    extrapolate: "clamp",
                  });

                  return (
                    <Animated.View
                      key={idx}
                      style={[
                        styles.dot,
                        { width: dotWidth, opacity, backgroundColor },
                      ]}
                    />
                  );
                })}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons
              name={(service.icon as any) || "medkit-outline"}
              size={80}
              color="#5CB15A"
            />
          </View>
        )}

        {/* Service Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>

          <View style={styles.tagsRow}>
            {service.price != null && (
              <View style={styles.tag}>
                <Ionicons name="pricetag-outline" size={14} color="#16A34A" />
                <Text style={styles.tagText}>{formatPrice(service.price)}</Text>
              </View>
            )}
            {service.duration != null && (
              <View style={styles.tag}>
                <Ionicons name="time-outline" size={14} color="#16A34A" />
                <Text style={styles.tagText}>{formatDuration(service.duration)}</Text>
              </View>
            )}
          </View>

          {service.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Mô tả</Text>
              <Text style={styles.descriptionText}>{service.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            addItem(service);
            Alert.alert(
              "Thành công",
              `Đã thêm dịch vụ ${service.name} vào giỏ hàng`,
              [
                {
                  text: "OK",
                  onPress: () => router.replace("/screens/user/tabs/ServiceScreen/Service"),
                },
              ]
            );
          }}
        >
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Text style={styles.addToCartBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
