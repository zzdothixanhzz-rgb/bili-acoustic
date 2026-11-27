// =========================================================================
// Bili Acoustic — site content
// Edit documents, courses and news here. Paths under `read` point to files
// in /public (served from the site root after build).
// =========================================================================

export const CATS = {
  aut:{name:"Đo kiểm âm thanh"}, loa:{name:"Loa & Micro"}, fix:{name:"Phòng đo & Fixture"},
  thd:{name:"THD · Rub & Buzz"}, data:{name:"Phân tích dữ liệu"}, news:{name:"Tin tức"}
};

// Clickable areas on showroom.jpg, as fractions of image width/height (x, y).
export const HOT = {"aut": [[0.1203, 0.0249], [0.2636, 0.2026], [0.2641, 0.7175], [0.1217, 0.8512]], "loa": [[0.2825, 0.2261], [0.3385, 0.2956], [0.3388, 0.6473], [0.283, 0.6998]], "fix": [[0.3476, 0.3069], [0.3774, 0.3439], [0.3776, 0.6109], [0.3478, 0.6388]], "news": [[0.8797, 0.0249], [0.7364, 0.2026], [0.7359, 0.7175], [0.8783, 0.8512]], "data": [[0.7175, 0.2261], [0.6615, 0.2956], [0.6612, 0.6473], [0.717, 0.6998]], "thd": [[0.6524, 0.3069], [0.6226, 0.3439], [0.6224, 0.6109], [0.6522, 0.6388]], "desk": [[0.4427, 0.5331], [0.5573, 0.5331], [0.5573, 0.6014], [0.4427, 0.6014]], "all": [[0.3725, 0.6439], [0.6275, 0.6439], [0.6274, 0.9087], [0.3726, 0.9087]]};

export const DOCS = [
  {id:"d1",cat:"aut",t:"Nhập môn đo kiểm âm thanh trên chuyền",p:25,x:"kèm 7 bài tập có lời giải",read:{dir:"docs/nhap-mon/",pages:25,pdf:"docs/nhap-mon-do-kiem-am-thanh.pdf",cover:"docs/nhap-mon/cover-01.jpg"},d:"Đáp tuyến tần số, độ nhạy, THD, pha. Đọc một báo cáo đo từ đầu tới cuối và biết khi nào kết quả đáng tin.",price:1290000},
  {id:"d2",cat:"aut",t:"Đặt giới hạn test từ golden sample",p:20,x:"kèm file Excel tính giới hạn",read:{dir:"docs/gioi-han/",pages:20,pdf:"docs/dat-gioi-han-test-golden-sample.pdf",cover:"docs/gioi-han/cover-01.jpg"},d:"Đo bộ mẫu chuẩn, tính dải giới hạn theo từng dải tần, tránh loại nhầm hàng tốt.",price:490000},
  {id:"d3",cat:"loa",t:"Đo loa nhỏ: độ nhạy, Fo và trở kháng",p:20,x:"kèm dữ liệu 3 lô",read:{dir:"docs/loa-nho/",pages:20,pdf:"docs/do-loa-nho-do-nhay-fo-tro-khang.pdf",cover:"docs/loa-nho/cover-01.jpg"},d:"Loa cho điện thoại và tai nghe: đọc đường trở kháng, tìm Fo, so sánh độ nhạy giữa các lô.",price:420000},
  {id:"d4",cat:"thd",t:"THD và Rub & Buzz: đọc đúng, đặt ngưỡng đúng",p:21,x:"kèm 40 đường đo minh hoạ",read:{dir:"docs/thd-rb/",pages:21,pdf:"docs/thd-va-rub-buzz.pdf",cover:"docs/thd-rb/cover-01.jpg"},d:"Phân biệt méo hài với tiếng cọ, rè. Đặt ngưỡng theo dải tần, giảm lỗi giả do tiếng ồn.",price:520000},
  {id:"d5",cat:"fix",t:"Hộp cách âm và fixture cho kết quả lặp lại",p:23,x:"kèm bản vẽ tham khảo",read:{dir:"docs/hop-fixture/",pages:23,pdf:"docs/hop-cach-am-va-fixture.pdf",cover:"docs/hop-fixture/cover-01.jpg"},d:"Vật liệu tiêu âm, vị trí micro chuẩn, cách kiểm tra rò âm và nhiễu nền trước khi chạy hàng.",price:560000},
  {id:"d6",cat:"data",t:"Gage R&R cho hệ thống đo âm thanh",p:22,x:"kèm file tính %GRR",read:{dir:"docs/grr/",pages:22,pdf:"docs/gage-rr-he-do-am-thanh.pdf",cover:"docs/grr/cover-01.jpg"},d:"Chọn điểm tần số trên đường đáp tuyến, tính %GRR và ndc, đọc kết quả để quyết định.",price:450000},
  {id:"d7",cat:"loa",t:"Micro MEMS trên chuyền: độ nhạy và SNR",p:22,x:"kèm checklist",read:{dir:"docs/mems/",pages:22,pdf:"docs/micro-mems-do-nhay-snr.pdf",cover:"docs/mems/cover-01.jpg"},d:"Cách đo độ nhạy, SNR và đáp tuyến của micro MEMS, những lỗi lắp ráp hay làm lệch kết quả.",price:390000},
  {id:"d8",cat:"fix",t:"Hiệu chuẩn micro đo và chuỗi đo",p:20,x:"kèm sổ hiệu chuẩn",read:{dir:"docs/hieu-chuan/",pages:20,pdf:"docs/hieu-chuan-micro-do.pdf",cover:"docs/hieu-chuan/cover-01.jpg"},d:"Dùng bộ hiệu chuẩn 94 dB, ghi sổ theo dõi, phát hiện sớm micro đo bị trôi độ nhạy.",price:320000},
  {id:"d9",cat:"data",t:"Tự động hoá báo cáo AUT bằng Excel và Python",p:31,x:"kèm 20 script",read:{dir:"docs/aut-bao-cao/",pages:31,pdf:"docs/tu-dong-hoa-bao-cao-aut.pdf",cover:"docs/aut-bao-cao/cover-01.jpg"},d:"Gom file kết quả từ nhiều trạm, tạo sheet phân tích và biểu đồ tự động cho từng ca.",price:690000},
  {id:"d10",cat:"data",t:"Cpk cho thông số âm thanh",p:23,x:"kèm máy tính Cpk",read:{dir:"docs/cpk/",pages:23,pdf:"docs/cpk-thong-so-am-thanh.pdf",cover:"docs/cpk/cover-01.jpg"},d:"Tính Cpk cho độ nhạy và THD theo từng dải tần, biết khi nào phải báo cáo Ppk.",price:249000},
  {id:"d11",cat:"thd",t:"Tiếng ồn nền và lỗi giả trong trạm đo",p:21,x:"kèm bảng kiểm tra",read:{dir:"docs/on-nen/",pages:21,pdf:"docs/tieng-on-nen-va-loi-gia.pdf",cover:"docs/on-nen/cover-01.jpg"},d:"Đo nhiễu nền đúng cách, tìm nguồn ồn từ quạt, băng tải, rung nền và cách cô lập.",price:290000},
  {id:"d12",cat:"aut",t:"Sổ tay vận hành trạm đo hằng ngày",p:26,x:"bản in có ô ký",read:{dir:"docs/so-tay/",pages:26,pdf:"docs/so-tay-van-hanh-tram-do.pdf",cover:"docs/so-tay/cover-01.jpg"},d:"Kiểm tra đầu ca, đo golden sample, ghi log và xử lý khi trạm báo lỗi liên tiếp.",price:199000}
];

export const COURSES = [
  {id:"c1",state:"open",t:"Đo kiểm âm thanh cho kỹ sư chuyền",d:"Từ đáp tuyến tần số tới THD và Rub & Buzz, học trên dữ liệu đo thật của chính học viên.",dur:"6 buổi tối, 19:30–21:30",mode:"Online qua Zoom",start:"18.11.2026",price:3900000},
  {id:"c2",state:"soon",t:"Thực hành hộp cách âm & fixture",d:"Đo nhiễu nền, kiểm tra rò âm, chỉnh vị trí micro và chạy GRR ngay tại lab.",dur:"2 ngày",mode:"Tại lab, Bắc Ninh",start:"05.12.2026",price:2800000},
  {id:"c3",state:"ended",t:"THD, Rub & Buzz chuyên sâu",d:"Tư liệu khoá gồm slide, bộ đường đo mẫu và file đặt ngưỡng theo dải tần.",dur:"3 buổi",mode:"Online",start:"Đã học 09.2026",price:null},
  {id:"c4",state:"ended",t:"Python cho dữ liệu AUT",d:"Tư liệu khoá gồm notebook, file kết quả mẫu từ 4 trạm và script xuất báo cáo.",dur:"4 buổi",mode:"Online",start:"Đã học 08.2026",price:null}
];

export const NEWS = [
  {d:"22.10.2026",t:"Bảng quy đổi dB SPL, dBV và dBFS cho kỹ sư đo kiểm",free:true},
  {d:"10.10.2026",t:"Cùng một loa, vì sao hai trạm đo cho hai đường đáp tuyến khác nhau"},
  {d:"26.09.2026",t:"Tiếng ồn nền trong hộp cách âm: đo thế nào, bao nhiêu là đủ"},
  {d:"12.09.2026",t:"Ghi chép: chọn điểm tần số khi làm GRR cho đường đáp tuyến"},
  {d:"29.08.2026",t:"Rub & Buzz: bốn nguyên nhân hay gặp từ phía linh kiện"},
  {d:"15.08.2026",t:"Micro đo bị trôi độ nhạy: dấu hiệu nhận biết sớm"}
];

export const STATE_LABEL = {open:"Đang mở đăng ký", soon:"Sắp mở", ended:"Đã kết thúc"};
