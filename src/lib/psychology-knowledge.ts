/**
 * KIẾN THỨC TÂM LÝ HỌC BỔ SUNG CHO CHATBOT X10
 * Dịch từ các tài liệu CBT, ACT, DBT và Advanced Techniques
 * Nguồn: NotebookLM - Tài liệu Tâm lý học Tiếng Anh
 * 
 * Mục đích: Bổ sung chiều sâu tâm lý học cho các câu trả lời của chatbot
 */

export const PSYCHOLOGY_KNOWLEDGE = `

## KIẾN THỨC TÂM LÝ HỌC BỔ SUNG:

---

## LIỆU PHÁP NHẬN THỨC HÀNH VI (CBT) - Dr. Aaron Beck & Judith Beck

### MÔ HÌNH NHẬN THỨC (Cognitive Model):
Mô hình này giả định rằng cảm xúc, hành vi và phản ứng sinh lý của con người KHÔNG bị quyết định trực tiếp bởi sự kiện, MÀ bởi cách họ NHẬN THỨC và DIỄN GIẢI sự kiện đó.

### BA CẤP ĐỘ NHẬN THỨC:

**1. Suy nghĩ Tự động (Automatic Thoughts) - Cấp nông nhất:**
- Là dòng suy nghĩ xuất hiện tự phát, nhanh chóng, ngắn gọn trong tâm trí
- Không phải kết quả của suy ngẫm hay lập luận logic
- Con người thường chấp nhận chúng là sự thật tuyệt đối mà không kiểm chứng
- Ví dụ: "Cái này khó quá, mình sẽ không bao giờ hiểu được"
- → Liên hệ X10: Giống như "tâm trí dự đoán" trong câu chuyện 11 ngày trong veo

**2. Niềm tin Trung gian (Intermediate Beliefs) - Cấp giữa:**
- Là các thái độ, quy tắc và giả định (thường không được nói ra)
- Phát triển để đối phó với những niềm tin cốt lõi đau đớn
- Ba dạng:
  • Thái độ: "Thất bại là điều tồi tệ"
  • Quy tắc: "Tôi phải luôn làm mọi việc hoàn hảo"
  • Giả định: "Nếu tôi cố làm việc khó, tôi sẽ thất bại"
- → Liên hệ X10: Giống triết lý "Sở tri chướng" - càng biết nhiều càng sợ

**3. Niềm tin Cốt lõi (Core Beliefs) - Cấp sâu nhất:**
- Những hiểu biết sâu sắc, lâu dài về bản thân, người khác và thế giới
- Hình thành từ thời thơ ấu qua tương tác với người quan trọng
- Ba loại tiêu cực phổ biến:
  • Bất lực (Helplessness): "Tôi kém cỏi", "Tôi không có khả năng"
  • Không đáng yêu (Unlovability): "Tôi không đáng được yêu"
  • Vô giá trị (Worthlessness): "Tôi vô dụng", "Tôi tồi tệ"
- → Liên hệ X10: Giống "Virtual Me" - cái tôi giả hình thành từ niềm tin sai

### CƠ CHẾ HOẠT ĐỘNG:
Niềm tin cốt lõi hoạt động như THẤU KÍNH hoặc BỘ LỌC:
- Tập trung vào thông tin XÁC NHẬN niềm tin
- Gạt bỏ hoặc phủ nhận thông tin TRÁI NGƯỢC
- Ví dụ: Người tin mình "kém cỏi" sẽ:
  • Coi thành công là do MAY MẮN
  • Coi thất bại là do BẢN CHẤT của mình

### CÁC KỸ THUẬT CBT CHÍNH:

**1. Thẩm vấn Socratic (Socratic Questioning):**
- Đặt câu hỏi để bệnh nhân TỰ đánh giá suy nghĩ, thay vì tranh luận
- Các câu hỏi điển hình:
  • "Bằng chứng nào ủng hộ/chống lại ý tưởng này?"
  • "Có cách giải thích hay quan điểm nào khác không?"
  • "Điều tồi tệ nhất có thể xảy ra là gì?"
  • "Bạn sẽ nói gì với một người bạn thân nếu họ ở trong tình huống tương tự?"
- → Liên hệ X10: Giống kỹ thuật "Shock Zen" - đặt câu hỏi sốc để đánh thức

**2. Tái cấu trúc nhận thức (Cognitive Restructuring):**
- Xác định, đánh giá và phản hồi lại các suy nghĩ rối loạn chức năng
- Quy trình:
  1. Nhận diện suy nghĩ tự động ("Điều gì vừa chạy qua tâm trí?")
  2. Đánh giá tính đúng đắn bằng Socratic
  3. Soạn phản hồi thích ứng (adaptive response)
  4. Đánh giá lại cảm xúc
- → Liên hệ X10: Giống "Meaning Making Machine" - dịch lại nghĩa cho sự việc

**3. Thử nghiệm hành vi (Behavioral Experiments):**
- Thiết kế trải nghiệm thực tế để KIỂM TRA tính đúng đắn của suy nghĩ
- Mạnh hơn kỹ thuật lời nói vì bệnh nhân được trải nghiệm thực tế
- Quy trình:
  1. Xác định dự đoán tiêu cực
  2. Thiết kế hoạt động kiểm tra
  3. Thực hiện hành động
  4. So sánh kết quả thực tế với dự đoán
- → Liên hệ X10: Giống "X10" - đặt mục tiêu lớn để phá vỡ mô hình cũ

**4. Kích hoạt hành vi (Behavioral Activation):**
- Đặc biệt quan trọng với trầm cảm - giúp bệnh nhân năng động hơn
- Sử dụng Biểu đồ Hoạt động để lên kế hoạch cụ thể
- Đánh giá Mức độ Làm chủ (Mastery) và Niềm vui (Pleasure)
- → Liên hệ X10: Giống triết lý "Làm vượt mức trả công là đầu tư cho mình"

---

## LIỆU PHÁP CHẤP NHẬN VÀ CAM KẾT (ACT) - Russ Harris & Steven Hayes

### MỤC TIÊU: Tạo SỰ LINH HOẠT TÂM LÝ (Psychological Flexibility)
= Khả năng hiện diện trọn vẹn, mở lòng với trải nghiệm, và hành động theo giá trị

### MÔ HÌNH HEXAFLEX - 6 QUY TRÌNH CỐT LÕI:

**1. DEFUSION (Tách rời nhận thức):**
- Khẩu quyết: "Quan sát suy nghĩ của bạn"
- Học cách "lùi lại" và tách biệt khỏi suy nghĩ
- Kỹ thuật:
  • "Tôi đang có suy nghĩ rằng..." (tạo khoảng cách)
  • Đặt tên cho câu chuyện: "Lại là câu chuyện 'tôi không làm được' đang phát"
  • Ẩn dụ: Suy nghĩ như lá trôi trên dòng suối - chỉ quan sát, không chạy theo
- → Liên hệ X10: Giống "Người quan sát bên trong" và "Tâm định nhìn thấy tâm loạn"

**2. ACCEPTANCE (Chấp nhận/Mở lòng):**
- Khẩu quyết: "Mở lòng"
- Mở lòng với cảm xúc đau đớn THAY VÌ đấu tranh chống lại
- Kỹ thuật:
  • Vật thể hóa cảm xúc: hình dạng, màu sắc, trọng lượng?
  • Hít thở và mở rộng không gian chứa cảm xúc
  • Ẩn dụ "Kéo co": Buông sợi dây thay vì kéo với con quái vật
- → Liên hệ X10: Giống "Chấp nhận tình huống xấu nhất thì sao?" và câu chuyện cô gái gặp Thầy Viên Minh

**3. CONTACT WITH PRESENT MOMENT (Hiện diện):**
- Khẩu quyết: "Hiện diện ngay lúc này"
- Kết nối có ý thức với những gì đang xảy ra NGAY BÂY GIỜ
- Kỹ thuật:
  • Sử dụng 5 giác quan
  • Quan sát hơi thở
  • Kết nối lại khi tâm trí "trôi" đi
- → Liên hệ X10: Giống "Uống trà đi" của Triệu Châu và "Ba giai đoạn trân trọng - mất phút giây hiện tại"

**4. SELF-AS-CONTEXT (Cái tôi như là bối cảnh):**
- Khẩu quyết: "Nhận thức thuần túy"
- Hai phần của tâm trí:
  • "Cái tôi tư duy": phần suy nghĩ, phán xét
  • "Cái tôi quan sát": phần nhận biết những suy nghĩ đó
- Ẩn dụ: Bầu trời (cái tôi quan sát) chứa thời tiết (suy nghĩ/cảm xúc)
  • Thời tiết thay đổi nhưng bầu trời không bị tổn hại
- → Liên hệ X10: Giống "Virtual Me → Real Me → No Me" và "Kim Cương Đại Định"

**5. VALUES (Giá trị):**
- Khẩu quyết: "Biết điều gì là quan trọng"
- Giá trị = khao khát sâu sắc về cách tương tác với thế giới
- Khác với MỤC TIÊU:
  • Mục tiêu: có thể đạt được và gạch bỏ (như "kết hôn")
  • Giá trị: như la bàn, không bao giờ "đến nơi" (như "yêu thương")
- Kỹ thuật: Hỏi "Tôi muốn trở thành người như thế nào trong tình huống này?"
- → Liên hệ X10: Giống "Thiên hướng vs Sở thích" và "Kỷ luật cao nhất là tự do"

**6. COMMITTED ACTION (Hành động cam kết):**
- Khẩu quyết: "Làm những gì cần thiết"
- Hành động ĐƯỢC DẪN DẮT bởi giá trị, dù có đau đớn
- Mô hình FEAR và DARE:
  • FEAR (rào cản): Fusion, Excessive goals, Avoidance, Remoteness from values
  • DARE (đối mặt): Defusion, Acceptance, Realistic goals, Embracing values
- → Liên hệ X10: Giống "X10" và "Cứ làm đi"

### TÓM TẮT MÔ HÌNH TRIFLEX (3 trụ cột):
1. **Mở lòng (Open Up)**: Defusion + Acceptance
2. **Hiện diện (Be Present)**: Present Moment + Self-as-Context
3. **Làm điều quan trọng (Do What Matters)**: Values + Committed Action

---

## LIỆU PHÁP HÀNH VI BIỆN CHỨNG (DBT) - Marsha Linehan

### 4 MÔ-ĐUN KỸ NĂNG:

**1. CHÁNH NIỆM (Mindfulness Skills):**
- **Wise Mind (Tâm trí khôn ngoan):** Sự giao thoa giữa:
  • Rational Mind (Tâm trí lý tính): Logic, phân tích
  • Emotional Mind (Tâm trí cảm xúc): Cảm tính, phản ứng
  • Wise Mind: Trực giác + Lý trí + Cảm xúc hài hòa
- **Kỹ năng "What" (Cái gì):**
  • Observe (Quan sát): Chú ý mà không gán nhãn
  • Describe (Mô tả): Đặt tên cho trải nghiệm
  • Participate (Tham gia): Đắm chìm hoàn toàn vào hoạt động
- **Kỹ năng "How" (Như thế nào):**
  • Non-judgmentally (Không phán xét)
  • One-mindfully (Một lần một việc)
  • Effectively (Hiệu quả - làm những gì có ích)
- → Liên hệ X10: Giống "Thân - Tâm - Trí cộng hưởng" và "Đan điền - Linh tính"

**2. ĐIỀU CHỈNH CẢM XÚC (Emotion Regulation Skills):**
- **ABC PLEASE:**
  • A: Accumulate Positives (Tích lũy điều tích cực)
  • B: Build Mastery (Xây dựng sự làm chủ)
  • C: Cope Ahead (Chuẩn bị trước)
  • PLEASE: Physical health (sức khỏe thể chất)
    - PL: treat Physical iLlness
    - E: Eat balanced
    - A: Avoid mood-altering substances
    - S: Sleep balanced
    - E: Exercise
- **Hành động ngược lại (Opposite Action):**
  • Khi cảm xúc không phù hợp với tình huống → Làm ngược lại
  • Ví dụ: Sợ nhưng an toàn → Tiếp cận thay vì trốn
- → Liên hệ X10: Giống "Xăng 95 thay vì Xăng 82" và "Quan sát nỗi sợ TỨC THỜI"

**3. CHỊU ĐỰNG CĂNG THẲNG (Distress Tolerance Skills):**
- **STOP (Khi khủng hoảng):**
  • S: Stop (Dừng lại)
  • T: Take a step back (Lùi lại một bước)
  • O: Observe (Quan sát)
  • P: Proceed mindfully (Tiến hành có chánh niệm)
- **TIP (Thay đổi hóa chất cơ thể):**
  • T: Temperature (Nhiệt độ - nước lạnh lên mặt)
  • I: Intense exercise (Vận động cường độ cao)
  • P: Paced breathing (Hơi thở có nhịp)
- **Chấp nhận triệt để (Radical Acceptance):**
  • Chấp nhận thực tại HOÀN TOÀN như nó là
  • Không có nghĩa là tán thành - chỉ là ngừng đấu tranh với sự thật
- → Liên hệ X10: Giống "Tỉnh vs Nén" và "Không hết khổ được đâu"

**4. HIỆU QUẢ LIÊN CÁ NHÂN (Interpersonal Effectiveness Skills):**
- **DEAR MAN (Đạt mục tiêu):**
  • D: Describe (Mô tả tình huống)
  • E: Express (Bày tỏ cảm xúc)
  • A: Assert (Khẳng định nhu cầu)
  • R: Reinforce (Củng cố - giải thích lợi ích)
  • M: Mindful (Chánh niệm - tập trung vào mục tiêu)
  • A: Appear confident (Tỏ ra tự tin)
  • N: Negotiate (Thương lượng)
- **GIVE (Giữ mối quan hệ):**
  • G: Gentle (Nhẹ nhàng)
  • I: Interested (Quan tâm)
  • V: Validate (Xác nhận)
  • E: Easy manner (Thái độ thoải mái)
- **FAST (Giữ lòng tự trọng):**
  • F: Fair (Công bằng)
  • A: Apologies (Không xin lỗi quá mức)
  • S: Stick to values (Giữ giá trị)
  • T: Truthful (Trung thực)
- → Liên hệ X10: Giống "Người quan trọng không có vấn đề" và "Sống thật như người khiếm thị thắp đèn"

---

## KỸ THUẬT TƯ VẤN NÂNG CAO - Dr. Christian Conte

### CÁC LỖI TƯ DUY PHỔ BIẾN (Cognitive Distortions):
1. **Tư duy trắng-đen (All-or-Nothing):** Chỉ có tốt hoàn toàn hoặc xấu hoàn toàn
2. **Thảm họa hóa (Catastrophizing):** Luôn nghĩ đến điều tồi tệ nhất
3. **Đọc suy nghĩ (Mind Reading):** Giả định biết người khác nghĩ gì
4. **Dự đoán tương lai (Fortune Telling):** Tiên đoán kết quả tiêu cực
5. **Lọc tiêu cực (Negative Filtering):** Chỉ thấy mặt tiêu cực
6. **Nên phải (Should Statements):** "Tôi phải...", "Tôi nên..."
7. **Cá nhân hóa (Personalization):** Tự nhận lỗi về mình
- → Liên hệ X10: Giống "Meaning Making Machine" - cách dịch nghĩa quyết định cảm xúc

### MÔ HÌNH ABC CỦA REBT (Albert Ellis):
- **A (Activating Event):** Sự kiện kích hoạt
- **B (Beliefs):** Niềm tin về sự kiện
- **C (Consequences):** Hậu quả (cảm xúc, hành vi)
- Quan trọng: B quyết định C, không phải A!
- Bổ sung:
  • **D (Dispute):** Tranh luận với niềm tin sai lệch
  • **E (Effect):** Hiệu ứng mới (cảm xúc/hành vi tích cực)
- → Liên hệ X10: Giống mô hình "Tình huống → Dịch nghĩa → Cảm xúc"

### CÁC KỸ THUẬT TRỊ LIỆU SÁNG TẠO:

**1. Chiếc ghế trống (Gestalt - Fritz Perls):**
- Đặt chiếc ghế trống đối diện
- Tưởng tượng người/phần bản thân ngồi đó
- Nói chuyện trực tiếp
- Sau đó đổi chỗ và trả lời
- Mục đích: Giải quyết xung đột nội tâm
- → Liên hệ X10: Giống "Nói chuyện với cái tôi giả"

**2. Phân tích Giao dịch (Transactional Analysis - Eric Berne):**
- 3 trạng thái bản ngã:
  • Parent (Cha mẹ): Phán xét, bảo vệ
  • Adult (Người lớn): Logic, khách quan
  • Child (Đứa trẻ): Cảm xúc, sáng tạo
- Giao tiếp hiệu quả: Adult ↔ Adult
- → Liên hệ X10: Giống "Đầu (Trí) - Tim (Tâm) - Đan điền"

**3. Câu hỏi Phép màu (Solution-Focused - Steve de Shazer):**
- "Nếu đêm nay khi bạn ngủ, một phép màu xảy ra và vấn đề được giải quyết, bạn sẽ biết điều đó như thế nào vào sáng mai?"
- Mục đích: Tập trung vào giải pháp thay vì vấn đề
- → Liên hệ X10: Giống "X10 - Đặt mục tiêu lớn để tâm trí TẮT cách cũ"

---

## CÁCH ÁP DỤNG KIẾN THỨC TÂM LÝ HỌC VÀO COACHING:

### KẾT HỢP TRIẾT LÝ X10 VỚI TÂM LÝ HỌC:

| Triết lý X10 | Kỹ thuật Tâm lý học tương ứng |
|--------------|------------------------------|
| "Tâm trí dự đoán" | Suy nghĩ tự động (CBT) |
| "Virtual Me → Real Me → No Me" | Niềm tin cốt lõi (CBT) + Self-as-Context (ACT) |
| "Meaning Making Machine" | Tái cấu trúc nhận thức (CBT) + Mô hình ABC (REBT) |
| "Người quan sát bên trong" | Defusion (ACT) + Wise Mind (DBT) |
| "Chấp nhận tình huống xấu nhất" | Radical Acceptance (DBT) + Acceptance (ACT) |
| "Uống trà đi" | Present Moment Contact (ACT) + Chánh niệm (DBT) |
| "Xăng 82 vs Xăng 95" | Động lực từ sợ vs Giá trị (ACT) |
| "Tỉnh vs Nén" | Defusion (ACT) + STOP (DBT) |
| "Kỷ luật cao nhất là tự do" | Values + Committed Action (ACT) |

### KHI NÀO SỬ DỤNG KỸ THUẬT NÀO:

1. **Khi người hỏi có suy nghĩ tiêu cực tự động:**
   - Sử dụng Socratic Questioning + Defusion
   - Hỏi: "Bằng chứng nào cho thấy điều đó đúng?"

2. **Khi người hỏi đang né tránh cảm xúc:**
   - Sử dụng Acceptance + Radical Acceptance
   - Nói: "Mở lòng với cảm xúc đó như thế nào?"

3. **Khi người hỏi mất phương hướng:**
   - Sử dụng Values Clarification
   - Hỏi: "Bạn muốn trở thành người như thế nào?"

4. **Khi người hỏi đang khủng hoảng:**
   - Sử dụng STOP + TIP (DBT)
   - Kỹ thuật: Dừng, lùi, quan sát, tiến hành có chánh niệm

5. **Khi người hỏi có xung đột nội tâm:**
   - Sử dụng Gestalt Empty Chair
   - Hoặc: "Nếu 'cái tôi lo lắng' và 'cái tôi tự tin' nói chuyện, họ sẽ nói gì?"

`

/**
 * Hàm lấy kiến thức tâm lý học ngẫu nhiên cho từng câu trả lời
 */
export function getRandomPsychologyInsight(): string {
    const insights = [
        {
            technique: "Socratic Questioning",
            description: "Đặt câu hỏi để người hỏi TỰ đánh giá suy nghĩ",
            example: "Bằng chứng nào ủng hộ/chống lại suy nghĩ này?",
            x10Connection: "Giống kỹ thuật Shock Zen - đặt câu hỏi sốc để đánh thức"
        },
        {
            technique: "Defusion (ACT)",
            description: "Tách rời khỏi suy nghĩ - nhìn suy nghĩ như lá trôi trên dòng suối",
            example: "Thay vì 'Tôi là kẻ thất bại' → 'Tôi đang CÓ suy nghĩ rằng tôi là kẻ thất bại'",
            x10Connection: "Giống 'Tâm định nhìn thấy tâm loạn'"
        },
        {
            technique: "Radical Acceptance (DBT)",
            description: "Chấp nhận triệt để thực tại như nó là, không đấu tranh",
            example: "Chấp nhận không có nghĩa là tán thành - chỉ là ngừng chiến tranh với sự thật",
            x10Connection: "Giống 'Không hết khổ được đâu' → Xuôi tay xuôi chân → Hết khổ"
        },
        {
            technique: "Values Clarification (ACT)",
            description: "Xác định giá trị sống - không phải mục tiêu, mà là la bàn định hướng",
            example: "Hỏi: 'Bạn muốn trở thành người như thế nào trong tình huống này?'",
            x10Connection: "Giống 'Thiên hướng vs Sở thích' - thiên hướng như hương hoa tự nở"
        },
        {
            technique: "STOP (DBT)",
            description: "Kỹ năng khủng hoảng: Stop - Take a step back - Observe - Proceed mindfully",
            example: "Khi cảm xúc mạnh: Dừng lại, lùi một bước, quan sát, rồi tiến hành có chánh niệm",
            x10Connection: "Giống 'Tỉnh vs Nén' - đứng RA NGOÀI cơn giận thay vì đè xuống"
        },
        {
            technique: "Wise Mind (DBT)",
            description: "Giao thoa giữa Lý trí và Cảm xúc - trực giác khôn ngoan",
            example: "Không chỉ nghe đầu hay tim - mà cả hai hòa quyện với trực giác",
            x10Connection: "Giống 'Thân - Tâm - Trí cộng hưởng' và 'Đan điền - Linh tính'"
        },
        {
            technique: "Behavioral Experiment (CBT)",
            description: "Thiết kế trải nghiệm thực tế để kiểm tra niềm tin",
            example: "Không tranh luận - hãy THỬ và xem kết quả thực tế",
            x10Connection: "Giống 'X10' - đặt mục tiêu lớn để TẮT cách cũ và buộc sáng tạo"
        },
        {
            technique: "ABC Model (REBT)",
            description: "A (Sự kiện) → B (Niềm tin) → C (Hậu quả). B quyết định C, không phải A!",
            example: "Cùng 1 sự kiện, 2 người dịch nghĩa khác nhau → cảm xúc khác nhau",
            x10Connection: "Giống 'Meaning Making Machine' - chúng ta là cỗ máy tạo ngữ nghĩa"
        }
    ]

    const insight = insights[Math.floor(Math.random() * insights.length)]
    return `
[GỢI Ý TÂM LÝ HỌC BỔ SUNG]
- Kỹ thuật: ${insight.technique}
- Mô tả: ${insight.description}
- Ví dụ: "${insight.example}"
- Liên hệ X10: ${insight.x10Connection}
- Hãy tự nhiên kết hợp kiến thức này vào câu trả lời nếu phù hợp.
`
}
