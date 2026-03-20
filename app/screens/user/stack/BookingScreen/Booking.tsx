import { createBookingApi } from "@/app/services/authBooking";
import { usePets } from "@/app/utils/contexts/PetsContext";
import { useServices } from "@/app/utils/hook/useService";
import { BookingCreate } from "@/app/utils/models/booking";
import { Ionicons } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./styles";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
};

export default function BookingScreen() {
  const { service, serviceId } = useLocalSearchParams<{
    service?: string;
    serviceId?: string;
  }>();
  const selectedService = service ?? "Chưa chọn dịch vụ";

  const { pets } = usePets();
  const { data: services } = useServices();

  const petOptions = useMemo(() => pets, [pets]);
  const serviceList = useMemo(
    () =>
      Array.isArray(services)
        ? services
        : ((services as unknown as { data?: typeof services })?.data ?? []),
    [services],
  );

  const initialDate = new Date();

  const [selectedPetId, setSelectedPetId] = useState<number | null>(
    petOptions[0]?.id ?? null,
  );
  const [showPetOptions, setShowPetOptions] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date>(initialDate);
  const [bookingTime, setBookingTime] = useState<Date>(initialDate);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPetName =
    petOptions.find((pet) => pet.id === selectedPetId)?.name ?? "Chọn thú cưng";

  const resolvedServiceId = useMemo(() => {
    const parsed = Number(serviceId);
    if (Number.isFinite(parsed)) return parsed;

    const matched = serviceList.find((item: any) => item.name === selectedService);
    return Number(matched?.id);
  }, [serviceId, serviceList, selectedService]);

  const onChangeDate = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setBookingDate(selected);
    }
  };

  const onChangeTime = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setBookingTime(selected);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: bookingDate,
      mode: "date",
      onChange: onChangeDate,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: bookingTime,
      mode: "time",
      is24Hour: true,
      onChange: onChangeTime,
    });
  };

  const onBook = async () => {
    if (!selectedPetId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn thú cưng.");
      return;
    }

    if (!Number.isFinite(resolvedServiceId)) {
      Alert.alert("Thiếu thông tin", "Không tìm thấy dịch vụ để đặt lịch.");
      return;
    }

    if (isSubmitting) return;

    const payload: BookingCreate = {
      user_id: 1,
      pet_id: selectedPetId,
      booking_date: formatDate(bookingDate),
      booking_time: formatTime(bookingTime),
      status: "Đang xác nhận",
      note: notes.trim() || null,
      services: [{ service_id: resolvedServiceId }],
    };

    try {
      setIsSubmitting(true);
      await createBookingApi(payload);
      Alert.alert("Thành công", "Đặt lịch thành công.");
      router.replace("/screens/user/tabs/HistoryScreen/History");
    } catch (_error) {
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đặt lịch</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Dịch vụ đã chọn</Text>
          <Text style={styles.serviceName}>{selectedService}</Text>

          <Text style={styles.fieldLabel}>Thú cưng</Text>
          <TouchableOpacity
            style={styles.selectBox}
            activeOpacity={0.8}
            onPress={() => setShowPetOptions((prev) => !prev)}
          >
            <Text style={styles.selectText}>{selectedPetName}</Text>
            <Ionicons
              name={showPetOptions ? "chevron-up" : "chevron-down"}
              size={18}
              color="#5A5A5A"
            />
          </TouchableOpacity>

          {showPetOptions && (
            <View style={styles.optionsBox}>
              {petOptions.length === 0 ? (
                <Text style={styles.emptyText}>Bạn chưa có thú cưng nào.</Text>
              ) : (
                petOptions.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedPetId(pet.id);
                      setShowPetOptions(false);
                    }}
                  >
                    <Text style={styles.optionText}>{pet.name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          <Text style={styles.fieldLabel}>Ngày</Text>
          <TouchableOpacity
            style={styles.input}
            activeOpacity={0.8}
            onPress={openDatePicker}
          >
            <Text style={styles.inputText}>{formatDate(bookingDate)}</Text>
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Giờ</Text>
          <TouchableOpacity
            style={styles.input}
            activeOpacity={0.8}
            onPress={openTimePicker}
          >
            <Text style={styles.inputText}>{formatTime(bookingTime)}</Text>
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Ghi chú</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú cho lịch hẹn"
            placeholderTextColor="#9A9A9A"
            style={[styles.input, styles.notesInput]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.backBtn]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>Quay lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.bookBtn]}
              onPress={onBook}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={styles.bookBtnText}>
                {isSubmitting ? "Đang đặt..." : "Đặt lịch"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
