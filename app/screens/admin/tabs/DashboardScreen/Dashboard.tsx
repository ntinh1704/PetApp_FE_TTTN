import { useBookings } from "@/app/utils/hook/useBooking";
import { useUsers } from "@/app/utils/hook/useLogin";
import { useNotifications, useUnreadCount } from "@/app/utils/hook/useNotification";
import { usePets } from "@/app/utils/hook/usePets";
import { Booking } from "@/app/utils/models/booking";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import styles, { chartConfig } from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [chartMode, setChartMode] = useState<"week" | "month" | "year">("week");
  const [scheduleDate, setScheduleDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const navigation = useNavigation();

  const { data: usersData, isLoading: isUsersLoading } = useUsers();
  const { data: petsData, isLoading: isPetsLoading } = usePets();
  const { data: bookingsData, isLoading: isBookingsLoading } = useBookings();

  const unreadQuery = useUnreadCount({ role: "admin" }, true);
  const notificationsQuery = useNotifications({ role: "admin" }, true);

  useFocusEffect(
    useCallback(() => {
      unreadQuery.refetch();
      notificationsQuery.refetch();
      return undefined;
    }, [notificationsQuery, unreadQuery])
  );

  const stats = useMemo(() => {
    const users = Array.isArray(usersData) ? usersData : ((usersData as any)?.data ?? []);
    const pets = Array.isArray(petsData) ? petsData : ((petsData as any)?.data ?? []);
    const bookings: Booking[] = Array.isArray(bookingsData) ? bookingsData : ((bookingsData as any)?.data ?? []);

    const totalBookings = bookings.length;

    const revenue = bookings.reduce((sum, b) => {
      const status = (b.status || "").toLowerCase();
      if (status === "completed" || status === "hoàn thành") {
        return sum + (Number(b.total_price) || 0);
      }
      return sum;
    }, 0);

    const todayStr = new Date().toISOString().split("T")[0];

    const todayBookingsCount = bookings.filter((b) => b.booking_date === todayStr).length;

    const todayRevenue = bookings
      .filter((b) => {
        const status = (b.status || "").toLowerCase();
        return (status === "completed" || status === "hoàn thành") && b.booking_date === todayStr;
      })
      .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

    const recentBookings = [...bookings]
      .sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : a.id;
        const tB = b.created_at ? new Date(b.created_at).getTime() : b.id;
        return tB - tA;
      })
      .slice(0, 5);

    // Group bookings by date for the schedule view, only pending/confirmed/paid/completed
    const scheduleByDate: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
       const bStatus = (b.status || "").toLowerCase();
       if (
         bStatus === "pending" || bStatus === "chờ thanh toán" ||
         bStatus === "confirmed" || bStatus === "đã xác nhận" ||
         bStatus === "paid" || bStatus === "đã thanh toán" ||
         bStatus === "completed" || bStatus === "hoàn thành"
       ) {
         if (!scheduleByDate[b.booking_date]) scheduleByDate[b.booking_date] = [];
         scheduleByDate[b.booking_date].push(b);
       }
    });

    return { totalBookings, revenue, recentBookings, todayBookingsCount, todayRevenue, scheduleByDate };
  }, [bookingsData]);

  const chartData = useMemo(() => {
    const bookings: Booking[] = Array.isArray(bookingsData) ? bookingsData : ((bookingsData as any)?.data ?? []);
    const validBookings = bookings.filter((b) => {
        const status = (b.status || "").toLowerCase();
        return status === "completed" || status === "hoàn thành";
    });

    const now = new Date();
    
    if (chartMode === "week") {
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
      const data = [0, 0, 0, 0, 0, 0, 0];

      validBookings.forEach((b) => {
        if (!b.created_at) return;
        const bDate = new Date(b.created_at);
        if (bDate >= startOfWeek) {
          const diffDays = Math.floor((bDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            data[diffDays] += (Number(b.total_price) || 0);
          }
        }
      });
      return { labels, data };
    } 
    
    if (chartMode === "month") {
      const labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
      const data = [0, 0, 0, 0];
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
      
      validBookings.forEach((b) => {
        if (!b.created_at) return;
        const bDate = new Date(b.created_at);
        if (bDate >= startOfMonth && bDate <= endOfMonth) {
          let weekIdx = Math.floor((bDate.getDate() - 1) / 7);
          if (weekIdx > 3) weekIdx = 3; 
          data[weekIdx] += (Number(b.total_price) || 0);
        }
      });
      return { labels, data };
    }
    
    const labels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const data = new Array(12).fill(0);
    
    validBookings.forEach((b) => {
      if (!b.created_at) return;
      const bDate = new Date(b.created_at);
      if (bDate.getFullYear() === now.getFullYear()) {
         data[bDate.getMonth()] += (Number(b.total_price) || 0);
      }
    });
    
    return { labels, data };
  }, [bookingsData, chartMode]);

  const notifications = notificationsQuery.data ?? [];
  const fallbackUnreadCount = notifications.reduce((acc, item) => acc + (item.is_read ? 0 : 1), 0);
  const unreadCount = Math.max(unreadQuery.data ?? 0, fallbackUnreadCount);
  const isLoading = isUsersLoading || isPetsLoading || isBookingsLoading;

  const isAllZero = useMemo(() => {
    return chartData.data.length > 0 && chartData.data.every((v) => v === 0);
  }, [chartData.data]);

  const scheduleDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for(let i=0; i<7; i++){
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        dateStr: d.toISOString().split("T")[0],
        dayName: i === 0 ? "Hôm nay" : d.toLocaleDateString("vi-VN", { weekday: "short" }),
        dayNum: d.getDate(),
      });
    }
    return days;
  }, []);

  const selectedScheduleBookings = useMemo(() => {
    const list = stats.scheduleByDate[scheduleDate] || [];
    return [...list].sort((a,b) => {
       const timeA = a.booking_time ? new Date(`1970-01-01T${a.booking_time}`).getTime() : 0;
       const timeB = b.booking_time ? new Date(`1970-01-01T${b.booking_time}`).getTime() : 0;
       return timeA - timeB;
    });
  }, [stats.scheduleByDate, scheduleDate]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/screens/admin/Notifications/Notifications")}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color="#FFF" />
          {unreadCount > 0 && (
            <View style={styles.notiBadge}>
              <Text style={styles.notiBadgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.containerNoPadTop}>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5CB15A" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <View style={styles.statGrid}>
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={styles.statLabel}>
                  <Ionicons name="calendar-outline" size={16} color="#111827" />
                  <Text style={styles.statText}>Lịch hẹn hôm nay</Text>
                </View>
                <Text style={styles.statValue}>{stats.todayBookingsCount}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statLabel}>
                  <Ionicons name="cash-outline" size={16} color="#111827" />
                  <Text style={styles.statText}>Doanh thu hôm nay</Text>
                </View>
                <Text style={styles.statValue}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.todayRevenue)}
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={styles.statLabel}>
                  <Ionicons name="calendar" size={16} color="#111827" />
                  <Text style={styles.statText}>Tổng lịch đặt</Text>
                </View>
                <Text style={styles.statValue}>{stats.totalBookings}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statLabel}>
                  <Ionicons name="cash" size={16} color="#111827" />
                  <Text style={styles.statText}>Tổng doanh thu</Text>
                </View>
                <Text style={styles.statValue}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.revenue)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {!isLoading && (
          <View style={styles.section}>
            <Text style={styles.scheduleSectionTitle}>Lịch làm việc (7 ngày)</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleDaysScroll}>
              {scheduleDays.map((d) => {
                const isActive = d.dateStr === scheduleDate;
                return (
                  <TouchableOpacity 
                    key={d.dateStr} 
                    style={[styles.scheduleDayBtn, isActive && styles.scheduleDayBtnActive]}
                    onPress={() => setScheduleDate(d.dateStr)}
                  >
                    <Text style={[styles.scheduleDayName, isActive && styles.scheduleDayNameActive]}>{d.dayName}</Text>
                    <Text style={[styles.scheduleDayNum, isActive && styles.scheduleDayNumActive]}>{d.dayNum}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.scheduleCard}>
              {selectedScheduleBookings.length > 0 ? (
                selectedScheduleBookings.map((b) => {
                  const formatTime = (timeStr?: string) => {
                    if (!timeStr) return "";
                    const parts = timeStr.includes("T") ? timeStr.split("T")[1].split(":") : timeStr.split(":");
                    return `${parts[0]}:${parts[1]}`;
                  };

                  const isCompleted = b.status?.toLowerCase() === "hoàn thành" || b.status?.toLowerCase() === "completed";

                  return (
                    <View key={b.id} style={styles.scheduleRow}>
                      <View style={styles.scheduleTimeCol}>
                        <Text style={styles.scheduleTimeText}>{formatTime(b.booking_time)}</Text>
                      </View>
                      <View style={[styles.scheduleBar, isCompleted ? styles.scheduleBarCompleted : styles.scheduleBarPending]} />
                      <View style={styles.scheduleInfoCol}>
                        <Text style={styles.schedulePetName}>{b.pet_name || "Thú cưng"}</Text>
                        <Text style={styles.scheduleServiceName}>{b.service_names?.join(", ") || b.service_name}</Text>
                        <View style={styles.scheduleStaffRow}>
                          <Ionicons name="person-circle-outline" size={14} color="#6B7280" style={styles.scheduleStaffIcon} />
                          <Text style={styles.scheduleStaffText}>NV: {b.staff_name || "Cửa hàng"}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.scheduleDetailBtn}
                        onPress={() => router.push({ pathname: "/screens/admin/BookingDetail/BookingDetail", params: { bookingId: String(b.id) } })}
                      >
                        <Text style={styles.scheduleDetailBtnText}>Chi tiết</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View style={styles.scheduleEmptyContainer}>
                  <Ionicons name="calendar-clear-outline" size={40} color="#D1D5DB" />
                  <Text style={styles.scheduleEmptyText}>Không có lịch hẹn ngày này</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, styles.chartTitle]}>Biểu đồ doanh thu</Text>
            <View style={styles.filterContainer}>
              {(["week", "month", "year"] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.filterButtonBase,
                    chartMode === mode ? styles.filterButtonActive : styles.filterButtonInactive
                  ]}
                  onPress={() => setChartMode(mode)}
                >
                  <Text style={[
                    styles.filterTextBase,
                    chartMode === mode ? styles.filterTextActive : styles.filterTextInactive
                  ]}>
                    {mode === "week" ? "Tuần" : mode === "month" ? "Tháng" : "Năm"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.data,
                },
                ...(isAllZero ? [{
                  data: chartData.data.map(() => 100), // Force scale to 100 if all zeros
                  color: () => "transparent",
                  strokeWidth: 0,
                  withDots: false,
                  // withShadow: false,
                }] : []),
              ],
            }}
            width={SCREEN_WIDTH - 24}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            withShadow={!isAllZero}
            style={styles.chartStyle}
            formatYLabel={(y) => {
              const num = Number(y);
              if (isAllZero && num > 0) return "";
              
              if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
              if (num >= 1000) return (num / 1000).toFixed(0) + "k";
              return num.toString();
            }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
