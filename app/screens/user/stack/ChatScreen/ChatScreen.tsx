import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "@/app/services/api";
import { useChat } from "@/app/utils/contexts/ChatContext";
import { useCart } from "@/app/utils/contexts/CartContext";
import { styles } from "./styles";
import { TypingIndicator } from "./TypingIndicator";

type ServiceRecommendation = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  price?: number;
  duration?: number;
  images?: string[];
};

const SUGGESTED_PROMPTS = [
  "Tư vấn tiêm phòng cho chó",
  "Bảng giá dịch vụ spa",
  "Cách chăm sóc mèo con",
];

export default function ChatScreen() {
  const { chatHistory, addMessage, clearHistory } = useChat();
  const { addItem } = useCart();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100,
    );
  }, [chatHistory]);

  const onSend = async (customText?: string) => {
    const text = customText || inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    const userMsg = { role: "user" as const, content: text };
    addMessage(userMsg);

    try {
      setIsLoading(true);
      const res = await api.post("/chatbot/recommend", {
        message: text,
        chat_history: chatHistory.slice(-6), // Send last 6 messages
      });

      const { answer, recommended_services } = res.data;

      // Make a combined message content but we will keep recommendation separated
      let content = answer;
      if (recommended_services && recommended_services.length > 0) {
        content += "||__SERVICES__||" + JSON.stringify(recommended_services);
      }

      addMessage({ role: "assistant", content });
    } catch (error: any) {
      let errorContent =
        "Xin lỗi, đã có lỗi xảy ra. Không thể kết nối tới Chatbot lúc này.";
      if (error?.response?.status === 429) {
        errorContent =
          "Hệ thống AI đang bận. Vui lòng thử lại sau vài giây nhé! ⏳";
      } else if (error?.response?.status === 503) {
        errorContent =
          "Hệ thống Chatbot đang bảo trì. Vui lòng quay lại sau. 🔧";
      }
      addMessage({
        role: "assistant",
        content: errorContent,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Xóa lịch sử",
      "Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: clearHistory },
      ],
    );
  };

  const renderMessageContent = (msg: any) => {
    if (msg.role === "user") {
      return (
        <Text style={[styles.messageText, styles.messageTextUser]}>
          {msg.content}
        </Text>
      );
    }

    // AI message might contain serialized services
    const parts = msg.content.split("||__SERVICES__||");
    const textPart = parts[0]
      .replace(/\*\*/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "");
    let servicesPart: ServiceRecommendation[] = [];
    if (parts.length > 1) {
      try {
        servicesPart = JSON.parse(parts[1]);
      } catch (e) {}
    }

    const renderTextWithBold = (text: string) => {
      const textSegments = text.split(/(\*\*.*?\*\*)/g);
      return textSegments.map((segment, index) => {
        if (segment.startsWith("**") && segment.endsWith("**")) {
          return (
            <Text key={index} style={{ fontWeight: "bold" }}>
              {segment.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={index}>{segment}</Text>;
      });
    };

    return (
      <View>
        <Text style={[styles.messageText, styles.messageTextAI]}>
          {renderTextWithBold(textPart)}
        </Text>

        {servicesPart.length > 0 && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendTitle}>
              🐾 Gợi ý dịch vụ dành cho bạn:
            </Text>
            {servicesPart.map((s) => (
              <View key={s.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Ionicons
                    name={(s.icon as any) || "medkit-outline"}
                    size={20}
                    color="#5CB15A"
                  />
                  <Text style={styles.serviceName}>{s.name}</Text>
                </View>
                {s.description ? (
                  <Text style={styles.serviceDesc} numberOfLines={2}>
                    {s.description}
                  </Text>
                ) : null}
                <View style={styles.serviceBottom}>
                  <Text style={styles.servicePrice}>
                    {s.price
                      ? `${s.price.toLocaleString("vi-VN")} đ`
                      : "Liên hệ"}
                  </Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      addItem({
                        id: s.id,
                        name: s.name,
                        price: s.price,
                        duration: s.duration,
                        icon: s.icon,
                        description: s.description,
                      } as any);
                      Alert.alert(
                        "Thành công",
                        `Đã thêm ${s.name} vào giỏ lịch hẹn!`,
                      );
                    }}
                  >
                    <Text style={styles.addBtnText}>Đặt ngay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trợ lý ảo thông minh</Text>
        <TouchableOpacity onPress={handleClearHistory} style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatList}
          keyboardShouldPersistTaps="handled"
        >
          {chatHistory.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="sparkles"
                size={64}
                color="#5CB15A"
                style={{ marginBottom: 16 }}
              />
              {/* <Text style={[styles.emptyText, { color: '#1F2937', fontWeight: 'bold', fontSize: 18 }]}>
                Trợ lý thú cưng AI
              </Text> */}
              <Text style={styles.emptyText}>
                Hỏi tôi bất cứ điều gì về cách chăm sóc, đặt lịch dịch vụ, hay
                bảng giá nhé!
              </Text>
            </View>
          )}

          {chatHistory.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <View
                key={index}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAI,
                ]}
              >
                {!isUser && (
                  <View style={styles.avatar}>
                    <Ionicons name="sparkles" size={16} color="#5CB15A" />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleAI,
                  ]}
                >
                  {renderMessageContent(msg)}
                </View>
                {isUser && (
                  <View
                    style={[
                      styles.avatar,
                      {
                        marginLeft: 8,
                        marginRight: 0,
                        backgroundColor: "#D1D5DB",
                      },
                    ]}
                  >
                    <Ionicons name="person" size={16} color="#4B5563" />
                  </View>
                )}
              </View>
            );
          })}

          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowAI]}>
              <View style={styles.avatar}>
                <Ionicons name="pulse" size={16} color="#5CB15A" />
              </View>
              <View
                style={[
                  styles.bubble,
                  styles.bubbleAI,
                  { paddingHorizontal: 12, paddingVertical: 8 },
                ]}
              >
                <TypingIndicator />
              </View>
            </View>
          )}
        </ScrollView>

        {chatHistory.length === 0 && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
            >
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => onSend(prompt)}
                >
                  <Text style={styles.suggestionText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhắn tin cho trợ lý..."
            placeholderTextColor="#6B7280"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={() => onSend()}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
            ]}
            onPress={() => onSend()}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={18}
              color="#FFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
