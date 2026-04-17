import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useChat } from "./../contexts/ChatContext";

export default function ChatBubble() {
  const { isBubbleVisible, closeBubble } = useChat();

  if (!isBubbleVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bubble}
        onPress={() => router.push("/screens/user/stack/ChatScreen/ChatScreen")}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles" size={28} color="#FFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.closeBtn} onPress={closeBubble} activeOpacity={0.8}>
        <Ionicons name="close" size={14} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5CB15A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  closeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    elevation: 7,
  },
});
