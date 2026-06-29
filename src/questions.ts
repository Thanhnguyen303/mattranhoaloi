import { Question } from './types';

export const questionsDB: Question[] = [
  // PHẦN 1: Lịch sử hình thành (Câu 1 - 20)
  {
    id: 1,
    q: "Ngày nào được xác định là ngày Thành phố Hồ Chí Minh chính thức mang tên Bác?",
    options: ["A. 30/4/1975", "B. 02/7/1976", "C. 19/5/1976", "D. 25/4/1976"],
    answer: "B",
    explanation: "Ngày 02/7/1976, tại kỳ họp đầu tiên của Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thống nhất (khóa VI), Sài Gòn – Gia Định được đổi tên chính thức thành Thành phố Hồ Chí Minh để vinh danh Chủ tịch Hồ Chí Minh."
  },
  {
    id: 2,
    q: "Trước khi mang tên Thành phố Hồ Chí Minh, vùng đất này được gọi là gì trong thời kỳ 1698?",
    options: ["A. Phủ Gia Định", "B. Trấn Biên", "C. Đồng Nai Phủ", "D. Phiên An"],
    answer: "A",
    explanation: "Năm 1698, chúa Nguyễn sai Thống suất Nguyễn Hữu Cảnh vào kinh lý miền Nam, lập ra Phủ Gia Định – đây là mốc lịch sử quan trọng đánh dấu sự xác lập chính quyền trên vùng đất Sài Gòn – Gia Định."
  },
  {
    id: 3,
    q: "Sự kiện lịch sử nào đánh dấu ngày giải phóng Sài Gòn – Gia Định?",
    options: ["A. 01/5/1975", "B. 27/4/1975", "C. 30/4/1975", "D. 02/7/1975"],
    answer: "C",
    explanation: "Ngày 30/4/1975, chiến dịch Hồ Chí Minh toàn thắng, Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện, quân giải phóng tiến vào Dinh Độc Lập, giải phóng hoàn toàn miền Nam."
  },
  {
    id: 4,
    q: "Người dân quen gọi tên 'Sài Gòn' bắt nguồn từ tiếng dân tộc nào theo một trong những giả thuyết phổ biến nhất?",
    options: ["A. Tiếng Chăm", "B. Tiếng Khmer", "C. Tiếng Trung Hoa", "D. Tiếng Mã Lai"],
    answer: "B",
    explanation: "Theo nhiều nhà nghiên cứu, 'Sài Gòn' có thể bắt nguồn từ tiếng Khmer 'Prey Nokor' (rừng của vương quốc) hoặc biến âm từ 'Tây Cống', nhưng thuyết Khmer được nhiều học giả chấp nhận nhất do lịch sử cư dân bản địa tại vùng này."
  },
  {
    id: 5,
    q: "Thực dân Pháp nổ súng tấn công thành Gia Định vào năm nào, mở đầu quá trình xâm lược Việt Nam?",
    options: ["A. 1858", "B. 1859", "C. 1861", "D. 1862"],
    answer: "B",
    explanation: "Ngày 17/2/1859, liên quân Pháp – Tây Ban Nha tấn công và đánh chiếm thành Gia Định. Đây là mốc đánh dấu thực dân Pháp bắt đầu xâm chiếm Nam Kỳ."
  },
  {
    id: 6,
    q: "Sau Hiệp ước Nhâm Tuất 1862, Việt Nam nhượng cho Pháp bao nhiêu tỉnh ở Nam Kỳ?",
    options: ["A. 3 tỉnh", "B. 4 tỉnh", "C. 6 tỉnh", "D. Toàn bộ Nam Kỳ"],
    answer: "A",
    explanation: "Hiệp ước Nhâm Tuất (5/6/1862) buộc Việt Nam nhượng cho Pháp 3 tỉnh miền Đông Nam Kỳ là Gia Định, Định Tường và Biên Hòa, cùng đảo Côn Lôn."
  },
  {
    id: 7,
    q: "Năm 1955, Tổng thống Ngô Đình Diệm đã đặt tên chính thức cho Sài Gòn là gì theo văn bản hành chính?",
    options: ["A. Đô thành Sài Gòn", "B. Thủ đô Sài Gòn", "C. Đô thành Sài Gòn – Chợ Lớn", "D. Thành phố Sài Gòn"],
    answer: "A",
    explanation: "Dưới thời chính quyền Ngô Đình Diệm (Việt Nam Cộng hòa), Sài Gòn được gọi là 'Đô thành Sài Gòn', là thủ đô của Việt Nam Cộng hòa từ 1955 đến 1975."
  },
  {
    id: 8,
    q: "Chiến dịch Hồ Chí Minh lịch sử diễn ra trong khoảng thời gian nào?",
    options: ["A. 26/4 – 30/4/1975", "B. 01/4 – 30/4/1975", "C. 10/3 – 30/4/1975", "D. 20/4 – 30/4/1975"],
    answer: "A",
    explanation: "Chiến dịch Hồ Chí Minh diễn ra từ 26/4 đến 30/4/1975 (chỉ 5 ngày), đây là chiến dịch quân sự lớn nhất trong cuộc kháng chiến chống Mỹ, giải phóng hoàn toàn Sài Gòn."
  },
  {
    id: 9,
    q: "Quốc hội khóa VI (1976) quyết định tên chính thức của thành phố là gì tại kỳ họp đầu tiên?",
    options: ["A. Thành phố Sài Gòn", "B. Thành phố Hồ Chí Minh", "C. Đô thành Hồ Chí Minh", "D. Tỉnh Gia Định"],
    answer: "B",
    explanation: "Tại kỳ họp thứ nhất, Quốc hội nước CHXHCN Việt Nam (khóa VI) ngày 02/7/1976 đã quyết định đổi tên Sài Gòn – Gia Định thành 'Thành phố Hồ Chí Minh'."
  },
  {
    id: 10,
    q: "Tên gọi 'Gia Định' gắn liền với vị danh thần nào đã có công xây dựng vùng đất này dưới thời chúa Nguyễn?",
    options: ["A. Nguyễn Hữu Cảnh", "B. Lễ Thành hầu Nguyễn Hữu Cảnh", "C. Nguyễn Cư Trinh", "D. Trịnh Hoài Đức"],
    answer: "B",
    explanation: "Lễ Thành hầu Nguyễn Hữu Cảnh (1650–1700) là vị tướng được chúa Nguyễn Phúc Chu sai vào kinh lý miền Nam năm 1698, lập Phủ Gia Định, được xem là người có công đầu trong việc xác lập chủ quyền của người Việt tại vùng đất này."
  },
  {
    id: 11,
    q: "Dinh Độc Lập (nay là Dinh Thống Nhất) được xây dựng hoàn thành vào năm nào?",
    options: ["A. 1962", "B. 1963", "C. 1966", "D. 1968"],
    answer: "C",
    explanation: "Dinh Độc Lập được kiến trúc sư Ngô Viết Thụ thiết kế, khởi công năm 1962 and hoàn thành vào năm 1966. Ngày 30/4/1975, xe tăng quân giải phóng húc đổ cổng Dinh, kết thúc chiến tranh."
  },
  {
    id: 12,
    q: "Hiệp định Paris về chấm dứt chiến tranh ở Việt Nam được ký kết vào ngày tháng năm nào?",
    options: ["A. 27/01/1973", "B. 27/01/1972", "C. 20/7/1954", "D. 30/4/1975"],
    answer: "A",
    explanation: "Hiệp định Paris được ký kết ngày 27/1/1973 giữa Mỹ, Việt Nam Dân chủ Cộng hòa, Chính phủ Cách mạng lâm thời CHMNVN và Việt Nam Cộng hòa, quy định Mỹ rút quân khỏi miền Nam Việt Nam."
  },
  {
    id: 13,
    q: "Tên gọi 'Thành phố Hồ Chí Minh' được đề xuất lần đầu tiên bởi ai?",
    options: ["A. Quốc hội CHXHCNVN", "B. Mặt trận Giải phóng miền Nam", "C. Nhân dân Sài Gòn tự phát", "D. Đại hội Đảng toàn quốc lần thứ IV"],
    answer: "A",
    explanation: "Tên gọi 'Thành phố Hồ Chí Minh' được Quốc hội nước CHXHCN Việt Nam chính thức quyết định tại kỳ họp đầu tiên ngày 02/7/1976, thể hiện ý chí của toàn thể nhân dân Việt Nam."
  },
  {
    id: 14,
    q: "Trận đánh nào được ví như 'tiếng sét giữa trời quang' mở màn Tổng tấn công Tết Mậu Thân 1968 tại Sài Gòn?",
    options: ["A. Tấn công Dinh Độc Lập", "B. Tấn công Đại sứ quán Mỹ", "C. Tấn Công Bộ Tổng tham mưu", "D. Tấn công sân bay Tân Sơn Nhất"],
    answer: "B",
    explanation: "Cuộc tấn công vào Đại sứ quán Mỹ tại Sài Gòn đêm 30 rạng sáng 31/1/1968 là sự kiện gây chấn động toàn thế giới, phá vỡ huyền thoại 'bất khả xâm phạm' của Mỹ và làm thay đổi dư luận quốc tế về cuộc chiến tại Việt Nam."
  },
  {
    id: 15,
    q: "Sau giải phóng (1975), tỉnh Gia Định được sáp nhập vào thành phố để tạo thành đơn vị hành chính nào?",
    options: ["A. Thành phố Sài Gòn – Gia Định", "B. Khu Sài Gòn – Gia Định", "C. Tỉnh Thành Sài Gòn", "D. Thành phố Hồ Chí Minh"],
    answer: "D",
    explanation: "Ngay sau giải phóng (30/4/1975), Sài Gòn và tỉnh Gia Định được gộp thành 'Khu Sài Gòn – Gia Định'. Đến ngày 02/7/1976, đơn vị này được đổi tên chính thức thành Thành phố Hồ Chí Minh."
  },
  {
    id: 16,
    q: "Ngôi trường nào tại TP.HCM mang tên vị thống chế Pháp và là một trong những trường nổi tiếng nhất Sài Gòn từ thời thuộc địa?",
    options: ["A. Trường Pétrus Ký", "B. Trường Marie Curie", "C. Trường Gia Long", "D. Trường Chasseloup-Laubat"],
    answer: "D",
    explanation: "Trường Chasseloup-Laubat thành lập năm 1874, được đặt theo tên Bộ trưởng Hải quân Pháp. Sau 1975 đổi tên thành THPT Lê Quý Đôn, đây là một trong những ngôi trường lâu đời và danh tiếng nhất tại TP.HCM."
  },
  {
    id: 17,
    q: "Sự kiện 'Nam Bộ kháng chiến' (ngày toàn Nam Bộ kháng chiến) diễn ra vào ngày nào?",
    options: ["A. 19/8/1945", "B. 23/9/1945", "C. 02/9/1945", "D. 06/3/1946"],
    answer: "B",
    explanation: "Ngày 23/9/1945, thực dân Pháp tái chiếm Nam Bộ, nhân dân Nam Bộ đứng lên kháng chiến. Ngày này được gọi là 'Ngày Nam Bộ kháng chiến', được kỷ niệm hàng năm để nhớ tinh thần 'thà chết tự do còn hơn sống nô lệ'."
  },
  {
    id: 18,
    q: "Nhà thờ Đức Bà Sài Gòn được khánh thành năm nào?",
    options: ["A. 1863", "B. 1880", "C. 1883", "D. 1880 (11/4/1880)"],
    answer: "D",
    explanation: "Nhà thờ Đức Bà Sài Gòn (Vương cung thánh đường Đức Bà) được người Pháp xây dựng từ năm 1877 và khánh thành ngày 11/4/1880. Đây là một biểu trưng của Sài Gòn – TP.HCM."
  },
  {
    id: 19,
    q: "Hội nghị thống nhất đất nước (tháng 11/1975) diễn ra ở đâu?",
    options: ["A. Hà Nội", "B. Huế", "C. Thành phố Hồ Chí Minh", "D. Vũng Tàu"],
    answer: "C",
    explanation: "Hội nghị hiệp thương chính trị thống nhất đất nước họp tại TP.HCM (tháng 11/1975) đã thống nhất chủ trương Tổng tuyển cử bầu Quốc hội chung, tiến tới thống nhất hoàn toàn về mặt nhà nước."
  },
  {
    id: 20,
    q: "Kỷ niệm 50 năm ngày TP.HCM mang tên Bác (02/7/2026) rơi vào đúng mốc bao nhiêu năm thành phố đổi tên?",
    options: ["A. 49 năm", "B. 50 năm", "C. 51 năm", "D. 48 năm"],
    answer: "B",
    explanation: "Từ ngày 02/7/1976 đến ngày 02/7/2026 là đúng 50 năm Thành phố Hồ Chí Minh mang tên Bác – một mốc son lịch sử, đánh dấu nửa thế kỷ xây dựng và phát triển của thành phố mang tên Chủ tịch Hồ Chí Minh."
  },

  // PHẦN 2: Địa lý (Câu 21 - 40)
  {
    id: 21,
    q: "Thành phố Hồ Chí Minh có diện tích tự nhiên khoảng bao nhiêu km²?",
    options: ["A. 1.500 km²", "B. 2.061 km²", "C. 3.500 km²", "D. 4.000 km²"],
    answer: "B",
    explanation: "Thành phố Hồ Chí Minh có diện tích tự nhiên khoảng 2.061 km², là thành phố lớn nhất cả nước về diện tích đô thị và dân số, nằm trong vùng Đông Nam Bộ."
  },
  {
    id: 22,
    q: "Sau cuộc sắp xếp đơn vị hành chính (dự kiến 2025), TP.HCM còn bao nhiêu đơn vị hành chính cấp huyện?",
    options: ["A. 24 quận/huyện", "B. 22 quận/huyện", "C. 16 quận/huyện", "D. 20 quận/huyện"],
    answer: "B",
    explanation: "Theo lộ trình sắp xếp đơn vị hành chính, TP.HCM đã và đang điều chỉnh từ 24 đơn vị xuống còn 22 đơn vị cấp quận/huyện/thành phố trực thuộc (bao gồm TP. Thủ Đức)."
  },
  {
    id: 23,
    q: "Thành phố Thủ Đức được thành lập trên cơ sở sáp nhập các quận nào?",
    options: ["A. Quận 2, 9, Thủ Đức", "B. Quận 9, 12, Thủ Đức", "C. Quận 2, 12, Bình Thạnh", "D. Quận 2, 9, Bình Thạnh"],
    answer: "A",
    explanation: "Thành phố Thủ Đức được thành lập từ ngày 01/01/2021 trên cơ sở sáp nhập 3 đơn vị hành chính: Quận 2, Quận 9 và quận Thủ Đức."
  },
  {
    id: 24,
    q: "Con sông nào chạy dọc qua trung tâm TP.HCM, tạo nên diện mạo đặc trưng của thành phố?",
    options: ["A. Sông Đồng Nai", "B. Sông Sài Gòn", "C. Sông Nhà Bè", "D. Sông Vàm Cỏ"],
    answer: "B",
    explanation: "Sông Sài Gòn chạy dọc và uốn quanh phía Đông thành phố, là con sông gắn bó mật thiết với lịch sử Sài Gòn – TP.HCM."
  },
  {
    id: 25,
    q: "Bến Nhà Rồng – nơi Nguyễn Tất Thành ra đi tìm đường cứu nước – ngày nay là cơ sở nào?",
    options: ["A. Bảo tàng Hồ Chí Minh – Chi nhánh TP.HCM", "B. Nhà Bảo tàng Nam Bộ", "C. Bảo tàng Thành phố Hồ Chí Minh", "D. Khu di tích lịch sử Bến Nhà Rồng"],
    answer: "A",
    explanation: "Bến Nhà Rồng – nơi Nguyễn Tất Thành (Hồ Chí Minh) rời Tổ quốc ngày 05/6/1911 – nay là Bảo tàng Hồ Chí Minh, chi nhánh TP.HCM."
  },
  {
    id: 26,
    q: "Đường hầm Thủ Thiêm vượt sông Sài Gòn được đưa vào sử dụng năm nào?",
    options: ["A. 2008", "B. 2011", "C. 2010", "D. 2015"],
    answer: "B",
    explanation: "Hầm Thủ Thiêm khánh thành và đưa vào sử dụng ngày 20/11/2011, là đường hầm vượt sông đầu tiên của Việt Nam."
  },
  {
    id: 27,
    q: "Tuyến metro số 1 (Bến Thành – Suối Tiên) của TP.HCM khai thác thương mại vào năm nào?",
    options: ["A. 2023", "B. 2024", "C. 2025", "D. 2022"],
    answer: "B",
    explanation: "Tuyến metro số 1 Bến Thành – Suối Tiên chính thức khai thác thương mại vào ngày 22/12/2024."
  },
  {
    id: 28,
    q: "Tòa nhà Landmark 81 tại TP.HCM hiện là tòa nhà cao nhất Việt Nam. Độ cao của tòa nhà là bao nhiêu?",
    options: ["A. 400 m", "B. 461,2 m", "C. 350 m", "D. 528 m"],
    answer: "B",
    explanation: "Landmark 81 tại Bình Thạnh cao 461,2 m with 81 tầng, là tòa nhà cao nhất Việt Nam và một trong những tòa nhà cao nhất Đông Nam Á."
  },
  {
    id: 29,
    q: "Sân bay quốc tế nào phục vụ TP.HCM hiện tại?",
    options: ["A. Sân bay Tân Bình", "B. Sân bay Biên Hòa", "C. Sân bay Tân Sơn Nhất", "D. Sân bay Long Thành"],
    answer: "C",
    explanation: "Sân bay quốc tế Tân Sơn Nhất là sân bay lớn nhất Việt Nam về lượng hành khách."
  },
  {
    id: 30,
    q: "Khu Công nghệ cao TP.HCM (SHTP) nằm ở đâu?",
    options: ["A. Quận Bình Chánh", "B. Quận 12", "C. TP. Thủ Đức (Quận 9 cũ)", "D. Huyện Củ Chi"],
    answer: "C",
    explanation: "Khu Công nghệ cao TP.HCM (Saigon Hi-Tech Park – SHTP) nằm ở Quận 9 (nay thuộc TP. Thủ Đức), được thành lập năm 2002."
  },
  {
    id: 31,
    q: "Chợ Bến Thành – biểu tượng của TP.HCM – được xây dựng và khánh thành vào năm nào?",
    options: ["A. 1905", "B. 1914", "C. 1920", "D. 1930"],
    answer: "B",
    explanation: "Chợ Bến Thành được khởi công xây dựng năm 1912 and khánh thành ngày 28/3/1914."
  },
  {
    id: 32,
    q: "Đại lộ nào dài nhất và rộng nhất ở khu vực trung tâm TP.HCM?",
    options: ["A. Đại lộ Võ Văn Kiệt", "B. Đại lộ Lê Duẩn", "C. Đường Nguyễn Huệ", "D. Đại lộ Điện Biên Phủ"],
    answer: "A",
    explanation: "Đại lộ Võ Văn Kiệt (Đại lộ Đông – Tây) là con đường rộng và dài nhất khu vực trung tâm TP.HCM, dài khoảng 22 km."
  },
  {
    id: 33,
    q: "Khu đô thị mới Thủ Thiêm nằm tại phường nào thuộc TP. Thủ Đức?",
    options: ["A. Phường Bình An", "B. Phường Thủ Thiêm", "C. Phường An Lợi Đông", "D. Phường Bình Khánh"],
    answer: "B",
    explanation: "Khu đô thị mới Thủ Thiêm nằm tại phường Thủ Thiêm, đối diện với trung tâm quận 1 qua sông Sài Gòn."
  },
  {
    id: 34,
    q: "TP.HCM tiếp giáp với bao nhiêu tỉnh/thành phố?",
    options: ["A. 4 tỉnh", "B. 5 tỉnh", "C. 6 tỉnh", "D. 7 tỉnh"],
    answer: "B",
    explanation: "TP.HCM tiếp giáp với 5 tỉnh: Bình Dương, Đồng Nai, Bà Rịa-Vũng Tàu, Long An, Tiền Giang."
  },
  {
    id: 35,
    q: "Huyện nào có diện tích lớn nhất trong các đơn vị hành chính của TP.HCM?",
    options: ["A. Huyện Cần Giờ", "B. Huyện Củ Chi", "C. Huyện Bình Chánh", "D. Huyện Hóc Môn"],
    answer: "A",
    explanation: "Huyện Cần Giờ có diện tích khoảng 704 km², là đơn vị hành chính có diện tích lớn nhất TP.HCM."
  },
  {
    id: 36,
    q: "Cầu nào bắc qua sông Sài Gòn là cầu dây văng đầu tiên tại TP.HCM?",
    options: ["A. Cầu Thủ Thiêm 1", "B. Cầu Phú Mỹ", "C. Cầu Bình Lợi", "D. Cầu Bình Phước"],
    answer: "B",
    explanation: "Cầu Phú Mỹ là cầu dây văng đầu tiên tại TP.HCM, bắc qua sông Sài Gòn, khánh thành năm 2009."
  },
  {
    id: 37,
    q: "Bảo tàng nào ở TP.HCM trưng bày chứng tích về chiến tranh Việt Nam thu hút nhiều khách du lịch quốc tế nhất?",
    options: ["A. Bảo tàng Lịch sử TP.HCM", "B. Bảo tàng Chứng tích chiến tranh", "C. Bảo tàng Hồ Chí Minh", "D. Bảo tàng Phụ nữ Nam Bộ"],
    answer: "B",
    explanation: "Bảo tàng Chứng tích chiến tranh (quận 3) trưng bày tư liệu, hiện vật về chiến tranh Việt Nam."
  },
  {
    id: 38,
    q: "Trung tâm hành chính TP.HCM đặt tại quận nào?",
    options: ["A. Quận 3", "B. Quận 1", "C. Quận Bình Thạnh", "D. Quận 10"],
    answer: "B",
    explanation: "UBND TP.HCM và nhiều cơ quan hành chính trung tâm đặt tại Quận 1."
  },
  {
    id: 39,
    q: "Rừng ngập mặn Cần Giờ được UNESCO công nhận là Khu Dự trữ sinh quyển thế giới vào năm nào?",
    options: ["A. 1998", "B. 2000", "C. 2002", "D. 2005"],
    answer: "B",
    explanation: "Ngày 21/1/2000, UNESCO công nhận Rừng ngập mặn Cần Giờ là Khu Dự trữ sinh quyển thế giới đầu tiên của Việt Nam."
  },
  {
    id: 40,
    q: "Đường Nguyễn Huệ tại trung tâm quận 1 được biết đến với tên gọi nào trong thời Pháp thuộc?",
    options: ["A. Boulevard Charner", "B. Boulevard de la Somme", "C. Rue Catinat", "D. Boulevard Norodom"],
    answer: "A",
    explanation: "Thời Pháp thuộc là Boulevard Charner, được gọi nôm na là Đại lộ Charner."
  },

  // PHẦN 3: Văn hóa & Phát triển (Câu 41 - 60)
  {
    id: 41,
    q: "TP.HCM hiện đóng góp khoảng bao nhiêu phần trăm GDP cả nước?",
    options: ["A. 10%", "B. 15%", "C. 23–25%", "D. 30%"],
    answer: "C",
    explanation: "TP.HCM đóng góp khoảng 23–25% GDP cả nước, là đầu tàu kinh tế của Việt Nam."
  },
  {
    id: 42,
    q: "Lễ hội văn hóa dân gian nào lớn nhất tại TP.HCM được tổ chức hàng năm tại huyện Cần Giờ?",
    options: ["A. Lễ hội Chùa Bà Thiên Hậu", "B. Lễ hội Nghinh Ông", "C. Lễ hội Đền Hùng", "D. Lễ hội Chợ Lớn"],
    answer: "B",
    explanation: "Lễ hội Nghinh Ông ở Cần Giờ là lễ hội nước lớn nhất của ngư dân miền biển, được công nhận là Di sản văn hóa phi vật thể quốc gia."
  },
  {
    id: 43,
    q: "Trường Đại học nào lâu đời nhất tại TP.HCM, tiền thân là Viện Đại học Sài Gòn?",
    options: ["A. Đại học Khoa học Tự nhiên TP.HCM", "B. Đại học Sư phạm TP.HCM", "C. Đại học Quốc gia TP.HCM", "D. Đại học Bách Khoa TP.HCM"],
    answer: "A",
    explanation: "Trường Đại học Khoa học Tự nhiên TP.HCM (tiền thân thành lập 1957) thuộc một trong các Viện Đại học kỳ cựu nhất Nam Bộ."
  },
  {
    id: 44,
    q: "Nhà hát Thành phố Hồ Chí Minh (Opera House) được xây dựng vào thời gian nào?",
    options: ["A. 1889", "B. 1900", "C. 1898", "D. 1905"],
    answer: "C",
    explanation: "Nhà hát Thành phố được xây dựng năm 1898 và khánh thành năm 1900."
  },
  {
    id: 45,
    q: "Khu phố cổ Chợ Lớn (quận 5 – quận 6) được hình thành bởi cộng đồng người Hoa từ khi nào?",
    options: ["A. Thế kỷ 16", "B. Thế kỷ 17", "C. Thế kỷ 18", "D. Thế kỷ 19"],
    answer: "C",
    explanation: "Chợ Lớn được hình thành từ khoảng thế kỷ 18 do quá trình định cư của cộng đồng người Hoa Minh Hương."
  },
  {
    id: 46,
    q: "Tờ báo in lâu đời nhất tại TP.HCM hiện nay là tờ nào?",
    options: ["A. Báo Tuổi Trẻ", "B. Báo Sài Gòn Giải Phóng", "C. Báo Người Lao Động", "D. Báo Phụ Nữ TP.HCM"],
    answer: "B",
    explanation: "Báo Sài Gòn Giải Phóng ra số đầu ngày 05/5/1975, là tờ báo có lịch sử in ấn liên tục lâu đời nhất từ ngày giải phóng."
  },
  {
    id: 47,
    q: "Lễ hội đường hoa Nguyễn Huệ được tổ chức thường niên vào dịp nào?",
    options: ["A. Quốc khánh 2/9", "B. Dịp Tết Nguyên Đán", "C. Giỗ Tổ Hùng Vương", "D. Ngày giải phóng 30/4"],
    answer: "B",
    explanation: "Đường hoa Nguyễn Huệ được tổ chức mỗi dịp Tết Nguyên Đán phục vụ đời sống tinh thần của nhân dân thành phố."
  },
  {
    id: 48,
    q: "TP.HCM là đầu mối xuất khẩu lớn nhất cả nước. Cảng biển quốc tế lớn nhất phục vụ thành phố là cảng nào?",
    options: ["A. Cảng Sài Gòn", "B. Cảng Cát Lái", "C. Cảng Tân Cảng", "D. Cảng Bến Nghé"],
    answer: "B",
    explanation: "Cảng Cát Lái là cảng container lớn nhất Việt Nam, đảm nhiệm lượng xuất nhập khẩu khổng lồ."
  },
  {
    id: 49,
    q: "Nghị quyết số 98/2023/QH15 của Quốc hội trao cho TP.HCM cơ chế đặc thù nào nổi bật?",
    options: ["A. Được tự quyết ngân sách 100%", "B. Thí điểm một số cơ chế, chính sách đặc thù phát triển TP.HCM", "C. Được thành lập thêm đặc khu kinh tế", "D. Không phải nộp thuế về Trung ương"],
    answer: "B",
    explanation: "Nghị quyết 98 mở đường cho cơ chế chính sách đặc thù vượt trội nhằm tháo gỡ điểm nghẽn phát triển cho TP.HCM."
  },
  {
    id: 50,
    q: "Trung tâm tài chính quốc tế đang được quy hoạch xây dựng tại TP.HCM tập trung ở khu vực nào?",
    options: ["A. Quận 1", "B. Khu đô thị mới Thủ Thiêm (TP. Thủ Đức)", "C. Quận 7 (Phú Mỹ Hưng)", "D. Huyện Nhà Bè"],
    answer: "B",
    explanation: "Bán đảo Thủ Thiêm được định hướng trở thành trung tâm tài chính, thương mại quy mô quốc tế."
  },
  {
    id: 51,
    q: "Món ăn đường phố nào được coi là biểu tượng ẩm thực đặc trưng nhất của Sài Gòn – TP.HCM?",
    options: ["A. Hủ tiếu Nam Vang", "B. Phở Sài Gòn", "C. Bánh mì Sài Gòn", "D. Cơm tấm Sài Gòn"],
    answer: "D",
    explanation: "Cơm tấm Sài Gòn từ món ăn bình dân đã trở thành nét văn hóa ẩm thực đặc sắc không thể bỏ qua tại TP.HCM."
  },
  {
    id: 52,
    q: "Nghề thủ công truyền thống nổi tiếng gắn với quận Bình Thạnh xưa ven sông Sài Gòn là gì?",
    options: ["A. Làng nghề gốm Bát Tràng", "B. Làng nghề đan lát", "C. Làng nghề hoa giấy", "D. Làng nghề sản xuất tranh Đông Hồ"],
    answer: "B",
    explanation: "Vùng Bình An, Gia Định xưa ven sông Sài Gòn nổi tiếng với nghề đan lát thủ công tre nứa."
  },
  {
    id: 53,
    q: "Đại học Quốc gia TP.HCM được thành lập theo Nghị định số bao nhiêu?",
    options: ["A. Nghị định 16/CP năm 1995", "B. Nghị định 27/CP năm 1993", "C. Nghị định 98/CP năm 1995", "D. Nghị định 55/CP năm 1993"],
    answer: "A",
    explanation: "Đại học Quốc gia TP.HCM được thành lập vào ngày 27/01/1995 theo Nghị định 16/CP của Chính phủ."
  },
  {
    id: 54,
    q: "Khu chế xuất đầu tiên của TP.HCM và cả nước được thành lập vào năm nào, ở đâu?",
    options: ["A. Khu công nghiệp Tân Bình, 1992", "B. Khu công nghiệp Linh Trung, 1991", "C. Khu chế xuất Tân Thuận, 1991", "D. Khu công nghiệp Bình Dương, 1995"],
    answer: "C",
    explanation: "Khu chế xuất Tân Thuận (Quận 7) thành lập năm 1991, mở đường cho kỷ nguyên thu hút FDI chất lượng cao."
  },
  {
    id: 55,
    q: "Câu ca dao nào nói về sự trù phú của vùng đất Nam Bộ – Sài Gòn gắn liền với hình ảnh con sông?",
    options: ["A. 'Sài Gòn đẹp lắm Sài Gòn ơi...'", "B. 'Nhà Bè nước chảy chia hai, Ai về Gia Định, Đồng Nai thì về'", "C. 'Đồng Nai gạo trắng nước trong...'", "D. 'Sông Sài Gòn trong ngần bóng mát'"],
    answer: "B",
    explanation: "Câu ca dao bất hủ gắn liền với ngã ba sông nơi giao thương sông Sài Gòn và sông Đồng Nai phồn thịnh."
  },
  {
    id: 56,
    q: "Khu di tích địa đạo Củ Chi được nhà nước xếp hạng là gì?",
    options: ["A. Di sản văn hóa thế giới", "B. Kỳ quan thế giới mới", "C. Di tích quốc gia đặc biệt", "D. Bảo tàng chiến tranh tiêu biểu"],
    answer: "C",
    explanation: "Địa đạo Củ Chi hiện là di tích lịch sử quốc gia đặc biệt, đang trong quá trình xây dựng hồ sơ trình UNESCO công nhận di sản văn hóa thế giới."
  },
  {
    id: 57,
    q: "Thành phố Hồ Chí Minh là đầu mối giao thông của cả vùng Đông Nam Bộ. Ga đầu mối đường sắt phía Nam là ga nào?",
    options: ["A. Ga Sài Gòn", "B. Ga Bình Triệu", "C. Ga Dĩ An", "D. Ga Gò Vấp"],
    answer: "A",
    explanation: "Ga Sài Gòn đặt tại quận 3 là điểm xuất phát, nhà ga hành khách cuối cùng của đường sắt Bắc Nam."
  },
  {
    id: 58,
    q: "Phong trào 'Ngày Chủ Nhật xanh' tại TP.HCM gắn liền với chủ trương nào?",
    options: ["A. Vệ sinh an toàn thực phẩm", "B. Xây dựng đô thị văn minh, bảo vệ môi trường", "C. Khởi nghiệp sáng tạo", "D. Chuyển đổi số"],
    answer: "B",
    explanation: "Sáng kiến xanh giúp phát huy tinh thần tình nguyện bảo vệ môi trường đô thị sạch, đẹp của người dân."
  },
  {
    id: 59,
    q: "Phố đi bộ Nguyễn Huệ được khánh thành và đưa vào hoạt động năm nào?",
    options: ["A. 2013", "B. 2014", "C. 2015", "D. 2016"],
    answer: "C",
    explanation: "Được khánh thành vào ngày 29/4/2015 chào mừng 40 năm Giải phóng Miền Nam thống nhất đất nước."
  },
  {
    id: 60,
    q: "TP.HCM có bao nhiêu khu công nghiệp và khu chế xuất đang hoạt động (tính đến 2024)?",
    options: ["A. 10 khu", "B. 17 khu", "C. 24 khu", "D. 30 khu"],
    answer: "B",
    explanation: "Đến năm 2024, TP.HCM vận hành hiệu quả 17 khu công nghiệp, khu chế xuất trọng điểm."
  },

  // PHẦN 4: Hồ Chí Minh - Cuộc đời (Câu 61 - 80)
  {
    id: 61,
    q: "Chủ tịch Hồ Chí Minh sinh ngày, tháng, năm nào?",
    options: ["A. 19/5/1890", "B. 19/5/1892", "C. 19/5/1889", "D. 19/5/1894"],
    answer: "A",
    explanation: "Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890 tại làng Kim Liên, huyện Nam Đàn, tỉnh Nghệ An."
  },
  {
    id: 62,
    q: "Tên khai sinh của Chủ tịch Hồ Chí Minh là gì?",
    options: ["A. Nguyễn Sinh Cung", "B. Nguyễn Tất Thành", "C. Nguyễn Ái Quốc", "D. Lý Thụy"],
    answer: "A",
    explanation: "Tên thuở thiếu thời khai sinh của Bác là Nguyễn Sinh Cung."
  },
  {
    id: 63,
    q: "Nguyễn Tất Thành rời bến cảng nào để ra đi tìm đường cứu nước ngày 05/6/1911?",
    options: ["A. Cảng Đà Nẵng", "B. Bến Nhà Rồng (Sài Gòn)", "C. Cảng Hải Phòng", "D. Cảng Vũng Tàu"],
    answer: "B",
    explanation: "Bến Nhà Rồng sông Sài Gòn là nơi người thanh niên yêu nước bắt đầu hải trình vạn dặm tìm tự do cho dân tộc."
  },
  {
    id: 64,
    q: "Thân phụ của Chủ tịch Hồ Chí Minh là ai?",
    options: ["A. Nguyễn Sinh Sắc", "B. Nguyễn Sinh Khiêm", "C. Hoàng Xuân Hãn", "D. Nguyễn Sinh Cung"],
    answer: "A",
    explanation: "Thân phụ Bác là cụ Phó bảng Nguyễn Sinh Sắc, một nhà nho có tinh thần ái quốc, thanh liêm."
  },
  {
    id: 65,
    q: "Bản yêu sách của nhân dân Việt Nam gửi tới Hội nghị Versailles 1919 được ký tên là gì?",
    options: ["A. Hồ Chí Minh", "B. Nguyễn Tất Thành", "C. Nguyễn Ái Quốc", "D. Nguyễn Sinh Cung"],
    answer: "C",
    explanation: "Nguyễn Ái Quốc ký tên thay mặt hội những người Việt Nam yêu nước tại Pháp gửi bản yêu sách chấn động."
  },
  {
    id: 66,
    q: "Hồ Chí Minh gia nhập tổ chức quốc tế nào tại Đại hội Tours (Pháp) năm 1920?",
    options: ["A. Đảng Xã hội Pháp", "B. Quốc tế Cộng sản", "C. Đảng Cộng sản Pháp", "D. Liên đoàn các dân tộc bị áp bức"],
    answer: "C",
    explanation: "Đại hội Tours đánh dấu bước ngoặt Bác tham gia bỏ phiếu sáng lập Đảng Cộng sản Pháp tìm thấy con đường cứu nước."
  },
  {
    id: 67,
    q: "Tác phẩm 'Bản án chế độ thực dân Pháp' được Nguyễn Ái Quốc viết và xuất bản vào năm nào?",
    options: ["A. 1920", "B. 1922", "C. 1925", "D. 1930"],
    answer: "C",
    explanation: "Xuất bản bằng tiếng Pháp tại Paris năm 1925 nhằm tố cáo trực tiếp bản chất bóc lột của thực dân."
  },
  {
    id: 68,
    q: "Hội Việt Nam Cách mạng Thanh niên được thành lập tại đâu, năm nào?",
    options: ["A. Quảng Châu, Trung Quốc, 1925", "B. Hà Nội, 1925", "C. Paris, Pháp, 1923", "D. Moskva, Liên Xô, 1924"],
    answer: "A",
    explanation: "Do Nguyễn Ái Quốc thành lập tháng 6/1925 tại Quảng Châu nhằm huấn luyện tư tưởng cộng sản cho thanh niên trong nước."
  },
  {
    id: 69,
    q: "Đang Cộng sản Việt Nam được thành lập vào ngày tháng năm nào?",
    options: ["A. 03/02/1930", "B. 19/5/1930", "C. 01/5/1930", "D. 25/4/1930"],
    answer: "A",
    explanation: "Hội nghị hợp nhất tại Hồng Kông do Bác chủ trì đã quyết định lấy ngày 3/2/1930 làm ngày thành lập Đảng."
  },
  {
    id: 70,
    q: "Bác Hồ về nước sau hơn 30 năm hoạt động ở nước ngoài vào thời điểm nào?",
    options: ["A. Tháng 1/1941", "B. Tháng 2/1941", "C. Tháng 5/1941", "D. Tháng 3/1941"],
    answer: "B",
    explanation: "Ngày 28/01/1941 (tháng Giêng Tân Tỵ), Người đặt chân về cột mốc biên giới Pác Bó trực tiếp chỉ đạo cách mạng."
  },
  {
    id: 71,
    q: "Bản Tuyên ngôn Độc lập lịch sử được Chủ tịch Hồ Chí Minh đọc ngày 02/9/1945 tại đâu?",
    options: ["A. Hội trường Ba Đình, Hà Nội", "B. Quảng trường Ba Đình, Hà Nội", "C. Nhà hát Lớn Hà Nội", "D. Hồ Gươm, Hà Nội"],
    answer: "B",
    explanation: "Đọc tại Quảng trường Ba Đình rực nắng, khai sinh nước Việt Nam Dân chủ Cộng hòa."
  },
  {
    id: 72,
    q: "Tuyên ngôn Độc lập 1945 mở đầu bằng câu trích từ văn kiện nào?",
    options: ["A. Tuyên ngôn Nhân quyền Pháp 1791", "B. Tuyên ngôn Độc lập Mỹ 1776", "C. Tuyên ngôn của Liên Hợp Quốc", "D. Hiến chương Đại Tây Dương"],
    answer: "B",
    explanation: "Bác trích dẫn khéo léo bản Tuyên ngôn Độc lập của Hoa Kỳ năm 1776 về quyền sống, quyền tự do và quyền mưu cầu hạnh phúc."
  },
  {
    id: 73,
    q: "Hội nghị Fontainebleau (Pháp, 1946) được triệu tập để thảo luận về vấn đề gì?",
    options: ["A. Vấn đề hòa bình Đông Dương", "B. Độc lập của Việt Nam trong Liên hiệp Pháp", "C. Viện trợ kinh tế cho Việt Nam", "D. Ký hiệp định đình chiến"],
    answer: "B",
    explanation: "Hội nghị thảo luận về vị thế của Việt Nam nhằm giữ nền hòa bình mỏng manh nhưng thực dân Pháp cố tình trì hoãn."
  },
  {
    id: 74,
    q: "Bác Hồ nhận được Giải Nobel Hòa bình vào năm nào?",
    options: ["A. 1969", "B. 1973", "C. Chưa từng nhận giải", "D. 1975"],
    answer: "C",
    explanation: "Chủ tịch Hồ Chí Minh chưa từng nhận giải Nobel Hòa bình trong cuộc đời cống hiến cách mạng của mình."
  },
  {
    id: 75,
    q: "Câu nói nổi tiếng 'Không có gì quý hơn độc lập, tự do' được Chủ tịch Hồ Chí Minh tuyên bố trong bối cảnh nào?",
    options: ["A. Tuyên ngôn Độc lập 1945", "B. Lời kêu gọi toàn quốc kháng chiến 1946", "C. Lời kêu gọi chống Mỹ cứu nước 1966", "D. Di chúc của Người"],
    answer: "C",
    explanation: "Lời kêu gọi chống Mỹ, cứu nước ngày 17/7/1966 phát trên đài Tiếng nói Việt Nam tạo động lực chiến đấu to lớn."
  },
  {
    id: 76,
    q: "Chủ tịch Hồ Chí Minh từ trần vào ngày tháng năm nào?",
    options: ["A. 02/9/1969", "B. 03/9/1969", "C. 19/5/1969", "D. 30/4/1969"],
    answer: "A",
    explanation: "Người qua đời lúc 9 giờ 47 phút sáng ngày 2/9/1969 tại Thủ đô Hà Nội, thọ 79 tuổi."
  },
  {
    id: 77,
    q: "Bản Di chúc của Chủ tịch Hồ Chí Minh được viết vào năm nào và gồm bao nhiêu trang?",
    options: ["A. 1965, 3 trang", "B. 1968, 5 trang", "C. 1969, 6 trang", "D. 1965–1969, được bổ sung nhiều lần"],
    answer: "D",
    explanation: "Bác viết di chúc bắt đầu từ tháng 5/1965 và sửa đổi, bổ sung hoàn thiện liên tục vào các dịp sinh nhật hàng năm."
  },
  {
    id: 78,
    q: "UNESCO vinh danh Chủ tịch Hồ Chí Minh là 'Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới' vào năm nào?",
    options: ["A. 1985", "B. 1987", "C. 1990", "D. 1995"],
    answer: "C",
    explanation: "Nghị quyết của UNESCO tôn vinh Người nhân kỷ niệm 100 năm ngày sinh của Người (năm 1990)."
  },
  {
    id: 79,
    q: "Tên gọi 'Hồ Chí Minh' lần đầu tiên được sử dụng trong văn kiện quan trọng nào?",
    options: ["A. Tuyên ngôn Độc lập 1945", "B. Thông báo thành lập nước VNDCCH 1945", "C. Quyết định thành lập Việt Minh 1941", "D. Nghị quyết Hội nghị Trung ương 8 (1941)"],
    answer: "A",
    explanation: "Người sử dụng danh xưng Hồ Chí Minh ký dưới bản Tuyên ngôn Độc lập lịch sử ngày 2/9/1945."
  },
  {
    id: 80,
    q: "Chủ tịch Hồ Chí Minh đã sử dụng bao nhiêu tên và bí danh trong cuộc đời hoạt động cách mạng?",
    options: ["A. Hơn 50 tên/bí danh", "B. 10 tên/bí danh", "C. 174 tên/bí danh", "D. 30 tên/bí danh"],
    answer: "C",
    explanation: "Cuộc đời hoạt động bí mật của Bác ghi nhận khoảng 174 danh xưng, bút danh, bí danh phong phú."
  },

  // PHẦN 5: Tư tưởng & 50 Năm (Câu 81 - 100)
  {
    id: 81,
    q: "Tư tưởng Hồ Chí Minh về đạo đức cách mạng được Người tổng kết qua mấy chữ cái?",
    options: ["A. 4 chữ: Cần, Kiệm, Liêm, Chính", "B. 5 chữ: Nhân, Nghĩa, Trí, Dũng, Liêm", "C. 3 chữ: Trung, Hiếu, Nghĩa", "D. 6 chữ: Trung thực, Cần kiệm, Chí công"],
    answer: "A",
    explanation: "Bốn đức tính nền tảng của con người mới cách mạng: Cần, Kiệm, Liêm, Chính."
  },
  {
    id: 82,
    q: "Câu nói của Bác 'Trẻ em như búp trên cành...' trích từ bài thơ nào?",
    options: ["A. Bài thơ 'Trẻ em'", "B. Không thuộc bài thơ nào", "C. Bài ca thiếu nhi", "D. Bài thơ tặng thiếu nhi nhân dịp Tết Thiếu nhi 1942"],
    answer: "D",
    explanation: "Câu thơ quen thuộc trích trong bài thơ 'Tặng cháu thiếu nhi' nhân tết trung thu, tết thiếu nhi năm 1942."
  },
  {
    id: 83,
    q: "Phong trào thi đua yêu nước 'Người tốt việc tốt' do Bác Hồ phát động gắn liền với câu nói nào?",
    options: ["A. 'Mỗi người tốt là một bông hoa đẹp'", "B. 'Mỗi người tốt là một bông hoa đỏ, cả dân tộc ta là một vườn hoa đẹp'", "C. 'Đất nước đẹp vì có những người tốt'", "D. 'Hãy làm việc tốt để xứng đáng với Bác'"],
    answer: "B",
    explanation: "Lời căn dặn ấm áp khích lệ thi đua nhân rộng các nhân tố tích cực trong xã hội."
  },
  {
    id: 84,
    q: "Câu nói nổi tiếng 'Dù khó khăn gian khổ đến đâu, nhân dân ta nhất định thắng lợi' của Bác Hồ gắn với sự kiện nào?",
    options: ["A. Lời kêu gọi toàn quốc kháng chiến 1946", "B. Lời kêu gọi sau chiến thắng Điện Biên Phủ 1954", "C. Lời kêu gọi chống Mỹ cứu nước 1966", "D. Lời căn dặn trước lúc Bác mất"],
    answer: "C",
    explanation: "Phát ngôn kiên định từ Lời kêu gọi chống Mỹ ngày 17/7/1966 khẳng định thắng lợi tất yếu."
  },
  {
    id: 85,
    q: "Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh được Đảng ta quy định trong Chỉ thị nào?",
    options: ["A. Chỉ thị 05-CT/TW năm 2016", "B. Nghị quyết 04-NQ/TW năm 2016", "C. Chỉ thị 03-CT/TW năm 2011", "D. Nghị quyết 06-NQ/TW năm 2019"],
    answer: "A",
    explanation: "Chỉ thị 05-CT/TW ban hành ngày 15/5/2016 định hướng việc học tập và làm theo Bác sâu rộng trong toàn Đảng."
  },
  {
    id: 86,
    q: "Tác phẩm 'Đường Kách Mệnh' (Đường Cách mạng) của Nguyễn Ái Quốc xuất bản năm nào?",
    options: ["A. 1925", "B. 1927", "C. 1930", "D. 1922"],
    answer: "B",
    explanation: "Tác phẩm lý luận chính trị đầu tiên dẫn đường cho cách mạng Việt Nam xuất bản năm 1927."
  },
  {
    id: 87,
    q: "Bác Hồ dạy cán bộ: 'Việc gì lợi cho dân, ta phải hết sức làm; việc gì hại đến dân, ta phải hết sức tránh' – đây là một trong những nội dung quan trọng của tư tưởng gì?",
    options: ["A. Tư tưởng đại đoàn kết dân tộc", "B. Tư tưởng về đạo đức của cán bộ", "C. Tư tưởng 'lấy dân làm gốc'", "D. Tư tưởng xây dựng Đảng"],
    answer: "C",
    explanation: "Triết lý 'Lấy dân làm gốc' luôn là kim chỉ nam cho đạo đức hành động của cán bộ, giáo dục lối sống phục vụ nhân dân."
  },
  {
    id: 88,
    q: "TP.HCM đặt ra mục tiêu trở thành trung tâm kinh tế – tài chính quốc tế vào năm nào theo Nghị quyết Đại hội Đảng bộ TP.HCM lần thứ XI?",
    options: ["A. Năm 2030", "B. Năm 2035", "C. Năm 2045", "D. Năm 2050"],
    answer: "C",
    explanation: "Định hướng tầm nhìn phát triển vượt bậc của đô thị đặc biệt TP.HCM đến năm 2045."
  },
  {
    id: 91,
    q: "Nghị quyết Đại hội XIII của Đảng (2021) xác định tư tưởng Hồ Chí Minh là kim chỉ nam cùng với học thuyết nào?",
    options: ["A. Chủ nghĩa Marx – Lenin", "B. Chủ nghĩa Marx", "C. Tư tưởng Lênin", "D. Học thuyết Đặng Tiểu Bình"],
    answer: "A",
    explanation: "Chủ nghĩa Marx - Lenin và Tư tưởng Hồ Chí Minh là nền tảng tư tưởng vững vàng của Đảng."
  },
  {
    id: 92,
    q: "TP.HCM kỷ niệm 50 năm ngày giải phóng (30/4/2025) với khẩu hiệu nào được đặc biệt nhấn mạnh?",
    options: ["A. 'TP.HCM – 50 năm rực rỡ'", "B. 'TP.HCM – Năng động, sáng tạo, nghĩa tình'", "C. 'TP.HCM tiến cùng đất nước'", "D. '50 năm – Một chặng đường hào hùng'"],
    answer: "B",
    explanation: "Đặc trưng phẩm chất sáng ngời của chính quyền và người dân Thành phố mang tên Bác."
  },
  {
    id: 93,
    q: "Lăng Chủ tịch Hồ Chí Minh tại Hà Nội được khánh thành vào ngày tháng năm nào?",
    options: ["A. 02/9/1973", "B. 29/8/1975", "C. 02/9/1975", "D. 19/5/1975"],
    answer: "B",
    explanation: "Khánh thành trang nghiêm ngày 29/8/1975 chào đón đồng bào cả nước viếng Bác sau ngày độc lập."
  },
  {
    id: 94,
    q: "Nguyên tắc sống và làm việc của Bác Hồ được thể hiện qua câu: 'Một ngày mà không làm được việc gì có ích cho dân, cho nước thì tôi cảm thấy...'?",
    options: ["A. '...xấu hổ'", "B. '...buồn'", "C. '...có lỗi với lương tâm'", "D. '...chưa xứng đáng là người cách mạng'"],
    answer: "C",
    explanation: "Biểu hiện tuyệt đối của tinh thần tận tụy phục vụ quên mình vì dân, vì nước của Bác."
  },
  {
    id: 95,
    q: "Nhân kỷ niệm 50 năm TP.HCM mang tên Bác (2026), thành phố đặt trọng tâm vào những lĩnh vực đột phá nào?",
    options: ["A. Chuyển đổi số và kinh tế số", "B. Hạ tầng giao thông và metro", "C. Giáo dục – y tế và an sinh xã hội", "D. Tất cả các lĩnh vực trên, hướng tới đô thị thông minh"],
    answer: "D",
    explanation: "Phát triển toàn diện hạ tầng và chất lượng sống để xứng tầm đô thị văn minh, thông minh."
  },
  {
    id: 96,
    q: "Hồ Chí Minh đã đặt nền móng cho đường lối đối ngoại Việt Nam qua nguyên tắc nào?",
    options: ["A. 'Dĩ bất biến ứng vạn biến'", "B. 'Thêm bạn bớt thù'", "C. 'Độc lập, tự chủ, đa phương hóa'", "D. 'Hòa bình, hợp tác, phát triển'"],
    answer: "A",
    explanation: "Lấy cái bất biến (quyền độc lập, chủ quyền) ứng phó linh hoạt với sự biến động phức tạp của thời cuộc."
  },
  {
    id: 97,
    q: "Cuốn sách 'Nhật ký trong tù' của Bác Hồ được viết bằng chữ gì, trong thời gian nào?",
    options: ["A. Chữ Quốc ngữ, 1942–1943", "B. Chữ Hán, 1942–1943", "C. Chữ Nôm, 1941–1942", "D. Chữ Pháp, 1943–1944"],
    answer: "B",
    explanation: "Tác phẩm bằng chữ Hán gồm 133 bài thơ được Bác ghi chép trong lao tù Tưởng Giới Thạch."
  },
  {
    id: 98,
    q: "TP.HCM hiện có bao nhiêu trường đại học và cao đẳng (xấp xỉ)?",
    options: ["A. 50 trường", "B. 80 trường", "C. 108 trường", "D. 150 trường"],
    answer: "C",
    explanation: "Trung tâm đào tạo nhân lực, khoa học công nghệ hàng đầu với mạng lưới hơn 100 cơ sở giáo dục đại học."
  },
  {
    id: 99,
    q: "Năm 2026, TP.HCM kỷ niệm đồng thời những sự kiện lớn nào?",
    options: ["A. 50 năm mang tên Bác và bầu cử HĐND", "B. 50 năm mang tên Bác, Đại hội Đảng bộ TP lần XII, bầu cử HĐND nhiệm kỳ mới", "C. 50 năm mang tên Bác và 40 năm Đổi mới"],
    answer: "B",
    explanation: "Chuỗi sự kiện chính trị mang tầm vóc chiến lược của toàn bộ hệ thống chính trị Thành phố."
  },
  {
    id: 100,
    q: "Câu nói của Bác 'Bác thương các cháu lắm' gắn với hình ảnh nào nổi tiếng nhất?",
    options: ["A. Bác đọc thơ cho các cháu thiếu nhi", "B. Bác bắt tay các chiến sĩ", "C. Bác Hồ với các cháu thiếu nhi – ôm hôn vui chơi cùng trẻ em", "D. Bác ngồi làm việc tại nhà sàn Phủ Chủ tịch"],
    answer: "C",
    explanation: "Biểu trưng cảm động nhất cho lòng bao dung, nhân ái vô bờ của Bác với mầm non tương lai."
  }
];

// Helper to generate a consistent exam set based on a set number 1-10
export function generateFixedExamSet(setIndex: number): Question[] {
  // We want to pull 4 questions from each of 5 sections:
  // Section 1: ID 1-20
  // Section 2: ID 21-40
  // Section 3: ID 41-60
  // Section 4: ID 61-80
  // Section 5: ID 81-100 (which contains 81,82,83,84,85,86,87,88,91,92,93,94,95,96,97,98,99,100)

  const s1 = questionsDB.filter(q => q.id >= 1 && q.id <= 20);
  const s2 = questionsDB.filter(q => q.id >= 21 && q.id <= 40);
  const s3 = questionsDB.filter(q => q.id >= 41 && q.id <= 60);
  const s4 = questionsDB.filter(q => q.id >= 61 && q.id <= 80);
  const s5 = questionsDB.filter(q => q.id >= 81 && q.id <= 100);

  // Deterministic shuffle with seed to make each of the 10 sets fixed but bốc ngẫu nhiên
  const getChunk = (arr: Question[], offset: number): Question[] => {
    const chunk: Question[] = [];
    for (let i = 0; i < 4; i++) {
      const idx = (offset + i) % arr.length;
      chunk.push(arr[idx]);
    }
    return chunk;
  };

  const offset = (setIndex - 1) * 2;
  const questions = [
    ...getChunk(s1, offset),
    ...getChunk(s2, offset),
    ...getChunk(s3, offset),
    ...getChunk(s4, offset),
    ...getChunk(s5, offset)
  ];

  // Deterministic shuffle using a simple LCG random number generator with a seed
  let seed = setIndex;
  const rand = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Shuffle the questions list
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = questions[i];
    questions[i] = questions[j];
    questions[j] = temp;
  }

  return questions;
}
