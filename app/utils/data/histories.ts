export type HistoryStatus =
  | "Hoàn thành"
  | "Đang xác nhận"
  | "Đã xác nhận"
  | "Đang xin hủy"
  | "Đã hủy"
  | "Chờ thanh toán"
  | "Đã thanh toán";

export type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  status: HistoryStatus;
  icon: string;
};

export const histories: HistoryItem[] = [
  {
    id: "1",
    title: "Khám thú y",
    subtitle: "Bella • BS. Nguyễn Văn A",
    date: "12/01/2026",
    status: "Đang xác nhận",
    icon: "medkit-outline",
  },
  {
    id: "2",
    title: "Cắt tỉa & Spa",
    subtitle: "Roudy • Grooming trọn gói",
    date: "05/01/2026",
    status: "Đã xác nhận",
    icon: "cut-outline",
  },
  {
    id: "3",
    title: "Đơn hàng thức ăn",
    subtitle: "Thức ăn cho chó • 2 sản phẩm",
    date: "28/12/2025",
    status: "Đã hủy",
    icon: "fast-food-outline",
  },
  {
    id: "4",
    title: "Huấn luyện cơ bản",
    subtitle: "Furry • Buổi 1",
    date: "20/12/2025",
    status: "Đã xác nhận",
    icon: "school-outline",
  },
  {
    id: "5",
    title: "Tắm & vệ sinh",
    subtitle: "Bella • Tắm khử mùi",
    date: "18/12/2025",
    status: "Hoàn thành",
    icon: "water-outline",
  },
  {
    id: "6",
    title: "Khách sạn thú cưng",
    subtitle: "Roudy • Lưu trú 2 ngày",
    date: "10/12/2025",
    status: "Hoàn thành",
    icon: "home-outline",
  },
  {
    id: "7",
    title: "Khám cấp cứu",
    subtitle: "Furry • Ngoài giờ",
    date: "05/12/2025",
    status: "Hoàn thành",
    icon: "alert-circle-outline",
  },
  {
    id: "8",
    title: "Tư vấn dinh dưỡng",
    subtitle: "Bella • Chế độ ăn",
    date: "01/12/2025",
    status: "Đã hủy",
    icon: "nutrition-outline",
  },
];