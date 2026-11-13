// Vietnamese copy for the /vi/ pages. Same facts and structure as the English
// source in site.ts — only the language changes. The English file stays the
// single source of truth for which fields exist; i18n.ts type-checks this
// against that shape, so a missing or renamed field fails the build.
// Decorative dashboard mocks (GA4, Google Ads, WooCommerce) keep their English
// product labels, since they mirror the real tools' interfaces.
import { site } from "./site";

export const viSite = {
  ...site,
  role: "Chuyên viên Khách hàng Chiến lược",
  company: "Nền tảng quảng cáo Cốc Cốc",
  location: "Hà Nội, Việt Nam",
  title: "Devan · Quảng cáo số tại Việt Nam",
  description:
    "Devan là Chuyên viên Khách hàng Chiến lược tại Nền tảng quảng cáo Cốc Cốc ở Hà Nội. Anh giúp thương hiệu tiếp cận người dùng Việt, đo lường hiệu quả bằng Google Analytics, Tag Manager và Google Ads, và dựng website WordPress cùng cửa hàng WooCommerce.",
};

export const viHero = {
  lead: "Tôi giúp thương hiệu tiếp cận người dùng Việt trên Cốc Cốc,",
  highlight: "đo lường hiệu quả thật",
  tail: "bằng công cụ của Google, và dựng website WordPress nơi quảng cáo dẫn về.",
  primaryCta: { label: "Kết nối trên LinkedIn", href: site.linkedin },
  secondaryCta: { label: "Xem giải pháp quảng cáo", href: "#solutions" },
  credit: "Bầu trời phỏng theo Vincent van Gogh, Đêm đầy sao (1889)",
};

export const viSummary = {
  title: "Tóm tắt nhanh",
  role: "Chuyên viên Khách hàng Chiến lược tại Nền tảng quảng cáo Cốc Cốc, Hà Nội. Account Manager từ tháng 11/2024, giữ vai trò hiện tại từ tháng 6/2025.",
  pillars: [
    { text: "Bán và vận hành chiến dịch quảng cáo trên Cốc Cốc", href: "#solutions" },
    { text: "Thiết lập đo lường với GA4, Tag Manager và Google Ads", href: "#measurement" },
    { text: "Dựng website WordPress và cửa hàng WooCommerce", href: "#websites" },
  ],
  tools: ["Google Analytics 4", "Google Tag Manager", "Google Ads", "WordPress", "WooCommerce", "Claude"],
  education: "Thạc sĩ Quản trị Kinh doanh (MBA), Đại học Ngoại thương, 2026–2028 (bán thời gian)",
  languages: "Tiếng Việt (bản ngữ), Tiếng Anh (thành thạo công việc)",
};

export const viAbout = {
  query: "devan là ai",
  bannerTitle: "Chào, tôi là Devan.",
  lines: [
    "Tôi là Chuyên viên Khách hàng Chiến lược tại Nền tảng quảng cáo Cốc Cốc ở Hà Nội.",
    "Tôi đồng hành cùng thương hiệu và agency từ buổi gặp đầu tiên qua mọi chiến dịch sau đó.",
    "Tôi gia nhập với vai trò Account Manager vào tháng 11/2024 và chuyển sang vai trò hiện tại vào tháng 6/2025.",
    "Tôi đang học MBA tại Đại học Ngoại thương theo hình thức bán thời gian, song song công việc toàn thời gian.",
    "Tôi cũng tự xây công cụ của mình bằng AI. Trang web này là một trong số đó.",
  ],
  caption: "Banner lớn trên trang tab mới là một trong những vị trí tôi bán. Trên trang này, vị trí đó là của tôi.",
};

export const viSolutions = {
  title: "Các giải pháp quảng cáo tôi triển khai",
  intro:
    "Nền tảng quảng cáo Cốc Cốc tiếp cận hàng chục triệu người dùng Việt trên máy tính và di động qua trình duyệt Cốc Cốc. Tôi ghép mục tiêu của từng thương hiệu với vị trí hiển thị và hình thức mua phù hợp.",
  stages: [
    {
      id: "awareness",
      name: "Nhận biết",
      summary: "Đưa thương hiệu đến đông đảo người xem.",
      items: [
        {
          name: "Big banner trang tab mới",
          text: "Banner lớn trên trang hiện ra mỗi lần người dùng mở một tab mới.",
        },
        {
          name: "Mua theo CPM",
          text: "Trả tiền cho mỗi nghìn lượt hiển thị khi mục tiêu là độ phủ.",
        },
      ],
    },
    {
      id: "consideration",
      name: "Cân nhắc",
      summary: "Xuất hiện khi người dùng tìm hiểu về ngành hàng của bạn.",
      items: [
        {
          name: "Quảng cáo từ khóa tìm kiếm",
          text: "Hiển thị khi người dùng tìm những từ khóa bạn chọn.",
        },
        {
          name: "Quảng cáo native",
          text: "Quảng cáo hòa hợp với nội dung xung quanh, đọc như một phần của trang.",
        },
        {
          name: "Nhắm chọn đối tượng",
          text: "Tiếp cận theo sở thích và ngành nghề, không chỉ theo số lượng.",
        },
      ],
    },
    {
      id: "conversion",
      name: "Chuyển đổi",
      summary: "Biến sự quan tâm thành lượt truy cập và đơn hàng.",
      items: [
        {
          name: "Quảng cáo sản phẩm (shopping)",
          text: "Đưa sản phẩm đến người đã sẵn sàng so sánh và mua.",
        },
        {
          name: "Tiếp thị lại (retargeting)",
          text: "Đưa trở lại những người đã thấy thương hiệu, qua cả hiển thị và tìm kiếm.",
        },
        {
          name: "Mua theo CPC và CPD",
          text: "Trả theo lượt nhấp khi cần truy cập, hoặc trả một mức cố định để giữ vị trí trong khoảng thời gian định sẵn.",
        },
      ],
    },
  ],
  footnote: "Chiến dịch có thể đo lường bằng công cụ theo dõi bên thứ ba minh bạch, để hai bên cùng đọc một con số.",
};

export const viWorkflow = {
  title: "Cách tôi làm việc với khách hàng",
  intro: "Không có case study ở đây. Đây là công việc thực tế, từng bước một.",
  steps: [
    {
      name: "Hiểu mục tiêu",
      text: "Bắt đầu từ buổi gặp đầu tiên. Tôi tìm hiểu thương hiệu cần gì — độ phủ, lượt truy cập hay doanh số — và thế nào là thành công với họ.",
    },
    {
      name: "Lên kế hoạch và chạy chiến dịch",
      text: "Tôi quản lý nhiều tài khoản và deadline cùng lúc, phối hợp đội nội bộ và đối tác bên ngoài, xử lý yêu cầu và phát sinh nhanh gọn.",
    },
    {
      name: "Dự báo bằng dữ liệu",
      text: "Tôi theo dõi các chỉ số chính và dự báo kết quả, để điều chỉnh chiến dịch trước khi nó đi chệch, chứ không phải sau đó.",
    },
    {
      name: "Đàm phán và chốt",
      text: "Tôi đàm phán hợp đồng có lợi cho cả hai bên, rồi cùng tìm cơ hội tiếp theo. Quan hệ lâu dài hơn một thương vụ lẻ.",
    },
  ],
};

export const viGrowth = {
  title: "Đo lường và performance marketing",
  intro:
    "Tôi thiết lập Google Tag Manager, Google Analytics 4 và Google Ads để mọi chiến dịch được đo lường theo cùng một cách, rồi dùng dữ liệu đó để cải thiện kết quả.",
  steps: [
    {
      tool: "Google Tag Manager",
      name: "Gắn thẻ",
      text: "Một container trên website, rồi thẻ, trình kích hoạt và biến cho những hành động quan trọng: khách hàng tiềm năng, đăng ký, mua hàng. Mọi thay đổi đều kiểm tra ở chế độ xem trước trước khi lên thật.",
    },
    {
      tool: "Google Analytics 4",
      name: "Đo lường",
      text: "Luồng dữ liệu, sự kiện được đánh dấu là sự kiện chính, đối tượng, và liên kết với Google Ads, để lưu lượng và kết quả hiển thị khớp nhau ở cả hai công cụ.",
    },
    {
      tool: "Google Ads",
      name: "Tối ưu",
      text: "Sự kiện chính nhập làm chuyển đổi, chiến lược đặt giá thầu khớp mục tiêu, từ khóa phủ định để cắt nhấp lãng phí, và liên tục thử nghiệm quảng cáo cùng trang đích.",
    },
  ],
  note: "Các bảng minh họa dùng dữ liệu mẫu để mô tả quy trình. Đây không phải kết quả của khách hàng.",
};

export const viWebsites = {
  title: "Website và cửa hàng trên WordPress",
  intro:
    "Tôi dựng website WordPress và cửa hàng WooCommerce để đội marketing tự cập nhật được: một hệ thống thiết kế, các khối dùng lại và trang tải nhanh.",
  steps: [
    {
      key: "theme",
      name: "Giao diện và bố cục",
      text: "Bắt đầu từ một theme, rồi thiết lập header, footer và mẫu trang để mọi trang dùng chung một hệ thống.",
    },
    {
      key: "blocks",
      name: "Khối dùng lại",
      text: "Dựng trang từ các khối dùng lại, và giữ màu sắc cùng kiểu chữ ở một nơi để chỉnh sửa luôn nhất quán.",
    },
    {
      key: "store",
      name: "Cửa hàng trực tuyến",
      text: "Thiết lập sản phẩm, giá, tồn kho, giỏ hàng và thanh toán của WooCommerce, với các sự kiện như thêm vào giỏ và mua hàng sẵn sàng để đo trong GA4.",
    },
    {
      key: "responsive",
      name: "Đa thiết bị",
      text: "Kiểm tra mọi bố cục trên máy tính, máy tính bảng và điện thoại trước khi lên, và sửa những gì vỡ ở từng kích thước.",
    },
    {
      key: "speed",
      name: "Tốc độ và SEO",
      text: "Nén ảnh, cache trang, đặt tiêu đề, mô tả và sitemap, để trang tải nhanh và dễ được tìm thấy.",
    },
  ],
  note: "Các bảng trình soạn thảo là hình minh họa, với nội dung mẫu.",
};

export const viTools = {
  title: "Hai công cụ bạn có thể thử",
  intro:
    "Gắn thẻ một trang đích để GA4 cho biết mỗi lượt truy cập đến từ đâu, và biến ngân sách cùng mức giá của bạn thành một kế hoạch sơ bộ. Cả hai chạy trong trình duyệt của bạn và không gửi đi đâu cả.",
  utm: {
    title: "Trình tạo link UTM",
    text: "GA4 đọc các thẻ này phân biệt chữ hoa thường, nên trình tạo giữ chúng ở dạng chữ thường, không dấu cách.",
  },
  budget: {
    title: "Công cụ ước tính ngân sách",
    text: "Dùng mức giá từ báo giá của chính bạn. Kết quả là ước tính, không phải dự báo cho bất kỳ nền tảng nào.",
  },
};

export const viProof = {
  title: "Kết quả và tham chiếu",
  results: [] as { value: string; label: string; context: string }[],
  testimonials: [] as { quote: string; name: string; role: string }[],
  samples: [] as { title: string; kind: string; text: string; url: string }[],
};

export const viAi = {
  title: "Dựng bằng AI",
  intro:
    "Tôi vibe-code với Claude, dùng cả ứng dụng Claude và Claude Code. Trang này là kết quả mới nhất: tôi định hướng và ra quyết định, còn Claude Code viết code.",
  steps: [
    {
      name: "Tóm tắt yêu cầu",
      text: "Tôi viết ra trang dành cho ai, phải nói điều gì, và tuyệt đối không được tuyên bố điều gì.",
    },
    {
      name: "Tham khảo",
      text: "Tôi thu thập ví dụ về chân dung, hạt và các cảnh cuộn, ghi chú điều cần học hỏi mà không sao chép.",
    },
    {
      name: "Nguyên mẫu",
      text: "Phần hero làm trước: hàng nghìn hạt vẽ nên bầu trời đêm phỏng theo Đêm đầy sao của Van Gogh và chuyển động theo con trỏ.",
    },
    {
      name: "Lặp và tinh chỉnh",
      text: "Tôi xem lại từng phiên bản và yêu cầu chỉnh đến khi thấy ưng ý.",
    },
  ],
  lesson:
    "Bài học lớn nhất: một bản tóm tắt yêu cầu rõ ràng làm phần lớn công việc. Viết ra điều trang web tuyệt đối không được tuyên bố, và điều không được sao chép, đã định hình mọi quyết định sau đó.",
};

export const viCredentials = {
  title: "Kỹ năng, chứng chỉ và học vấn",
  skills: [
    "SEO",
    "Inbound marketing",
    "Tiếp thị số",
    "Quảng cáo số",
    "Google Analytics 4",
    "Google Tag Manager",
    "Google Ads",
    "WordPress",
    "WooCommerce",
    "Vibe coding với Claude",
  ],
  certifications: [
    { name: "Chứng chỉ SEO" },
    { name: "SEO II" },
    { name: "Social Media Marketing" },
    { name: "Thiết kế đồ họa căn bản" },
  ] as { name: string; issuer?: string; year?: string; url?: string }[],
  education: {
    degree: "Thạc sĩ Quản trị Kinh doanh",
    school: "Đại học Ngoại thương, Hà Nội",
    years: "2026–2028",
    note: "Đang học, bán thời gian song song công việc toàn thời gian.",
  },
  languages: [
    { name: "Tiếng Việt", level: "Bản ngữ" },
    { name: "Tiếng Anh", level: "Thành thạo công việc" },
  ],
};

export const viContact = {
  title: "Cùng trao đổi nhé.",
  text: "Đang lên kế hoạch một chiến dịch cho người dùng Việt, hay tò mò cách tôi xây dựng bằng AI? Nhắn cho tôi qua LinkedIn hoặc email.",
  cta: { label: "Nhắn tôi trên LinkedIn", href: site.linkedin },
  email: { label: `Email ${site.email}`, href: `mailto:${site.email}` },
  meta: "Hà Nội, Việt Nam · Tiếng Anh và Tiếng Việt",
};

export const viCv = {
  title: "CV",
  profile:
    "Chuyên viên Khách hàng Chiến lược tại Nền tảng quảng cáo Cốc Cốc ở Hà Nội. Tôi giúp thương hiệu và agency tiếp cận người dùng Việt với vị trí hiển thị và hình thức mua phù hợp, đo lường kết quả bằng Google Tag Manager, Google Analytics 4 và Google Ads, và dựng website WordPress cùng cửa hàng WooCommerce. Đang học MBA tại Đại học Ngoại thương song song công việc toàn thời gian.",
  experience: [
    {
      company: "Nền tảng quảng cáo Cốc Cốc",
      place: "Hà Nội",
      roles: [
        { title: "Chuyên viên Khách hàng Chiến lược", dates: "6/2025 – nay" },
        { title: "Account Manager", dates: "11/2024 – 6/2025" },
      ],
      points: [
        "Đồng hành cùng thương hiệu và agency từ buổi gặp đầu tiên qua suốt quá trình quản lý chiến dịch.",
        "Quản lý nhiều tài khoản và deadline cùng lúc, xử lý yêu cầu và phát sinh của khách hàng.",
        "Phối hợp đội nội bộ và đối tác bên ngoài để triển khai chiến dịch.",
        "Đàm phán và chốt hợp đồng có lợi cho cả hai bên; phát triển quan hệ lâu dài và tìm cơ hội mới.",
        "Theo dõi chỉ số chính và dự báo kết quả, để điều chỉnh chiến dịch trước khi đi chệch.",
        "Bán banner trang tab mới, quảng cáo từ khóa tìm kiếm, native và sản phẩm (shopping), nhắm chọn đối tượng và tiếp thị lại, theo mô hình CPM, CPC và CPD.",
      ],
    },
  ],
  project: {
    name: "Trang portfolio này",
    text: "Định hướng cùng Claude Code: một trang tĩnh với bức tranh hạt WebGL phỏng theo Đêm đầy sao, có bản thay thế dễ tiếp cận cho mọi cảnh, và chính CV này.",
  },
  skillGroups: [
    {
      name: "Quảng cáo",
      items: [
        "Quảng cáo số",
        "Mua theo CPM, CPC và CPD",
        "Nhắm chọn đối tượng và tiếp thị lại",
        "Theo dõi chiến dịch bên thứ ba",
      ],
    },
    { name: "Đo lường", items: ["Google Tag Manager", "Google Analytics 4", "Google Ads"] },
    { name: "Website", items: ["WordPress", "WooCommerce", "SEO"] },
    { name: "Tiếp thị", items: ["Tiếp thị số", "Inbound marketing"] },
    { name: "AI", items: ["Vibe coding với Claude (ứng dụng Claude và Claude Code)"] },
  ],
};
