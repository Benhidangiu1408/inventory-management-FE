# PHÂN TÍCH CẤU TRÚC THƯ MỤC DỰ ÁN INVENTORY-MANAGEMENT-FE

## 1. TỔNG QUAN DỰ ÁN

**Tên dự án:** inventory-management-FE  
**Framework:** Next.js 16.x (App Router)  
**Ngôn ngữ:** TypeScript  
**UI Framework:** Tailwind CSS v4  
**React Version:** 19.2.0  

Dự án được xây dựng dựa trên template TailAdmin Next.js, một admin dashboard template miễn phí và mã nguồn mở.

---

## 2. CẤU TRÚC THƯ MỤC GỐC

### 2.1. Thư mục và File Cấu Hình

```
inventory-management-FE/
├── .next/                    # Thư mục build của Next.js (tự động tạo)
├── .git/                     # Git repository
├── node_modules/             # Dependencies của dự án
├── public/                   # Tài nguyên tĩnh (images, icons, etc.)
├── src/                      # Source code chính của ứng dụng
├── package.json              # Cấu hình dependencies và scripts
├── package-lock.json         # Lock file cho dependencies
├── tsconfig.json             # Cấu hình TypeScript
├── next.config.ts            # Cấu hình Next.js
├── next-env.d.ts             # Type definitions cho Next.js
├── eslint.config.mjs         # Cấu hình ESLint
├── .eslintrc.json            # ESLint rules
├── prettier.config.js        # Cấu hình Prettier
├── postcss.config.js         # Cấu hình PostCSS
├── components.json            # Cấu hình UI components (shadcn/ui)
├── jsvectormap.d.ts          # Type definitions cho jsvectormap
├── svg.d.ts                  # Type definitions cho SVG
├── .gitignore                # Git ignore rules
├── README.md                  # Tài liệu dự án
└── LICENSE                   # Giấy phép MIT
```

### 2.2. Thư Mục Public

Thư mục `public/` chứa các tài nguyên tĩnh được phân loại theo chức năng:

```
public/
└── images/
    ├── brand/                # Logo các thương hiệu (15 files SVG)
    ├── cards/                # Hình ảnh thẻ (6 files JPG/PNG)
    ├── carousel/             # Hình ảnh carousel (4 files PNG)
    ├── chat/                 # Hình ảnh chat
    ├── country/              # Icon các quốc gia (8 files SVG)
    ├── error/                # Hình ảnh lỗi (404, 500, 503, maintenance, success)
    ├── grid-image/           # Hình ảnh grid (6 files PNG)
    ├── icons/                # Icon files (PDF, image, video)
    ├── logo/                 # Logo ứng dụng (auth-logo, logo-dark, logo-icon, logo)
    ├── product/              # Hình ảnh sản phẩm (5 files JPG)
    ├── shape/                # Hình dạng SVG
    ├── task/                 # Hình ảnh task (Google Drive, PDF, task)
    ├── user/                 # Avatar người dùng (38 files JPG)
    └── video-thumb/          # Thumbnail video (2 files)
```

---

## 3. CẤU TRÚC THƯ MỤC SRC

Thư mục `src/` là nơi chứa toàn bộ source code của ứng dụng, được tổ chức theo kiến trúc Next.js App Router.

### 3.1. Cấu Trúc Tổng Quan

```
src/
├── app/                      # Next.js App Router - Routes và Pages
├── components/               # Components tùy chỉnh của dự án
├── default_components/       # Components mặc định từ template
├── context/                  # React Context providers
├── hooks/                    # Custom React Hooks
├── services/                 # API services layer
├── interfaces/               # TypeScript type definitions
├── lib/                      # Utility functions và helpers
├── constants/                # Hằng số của ứng dụng
├── icons/                    # SVG icons components
└── svg.d.ts                  # Type definitions cho SVG
```

---

## 4. CHI TIẾT CÁC THƯ MỤC CON

### 4.1. Thư Mục `app/` - Next.js App Router

Thư mục `app/` sử dụng Next.js App Router với cấu trúc route groups (thư mục trong ngoặc đơn không ảnh hưởng đến URL).

```
app/
├── (admin)/                  # Route group: Admin pages
│   ├── layout.tsx            # Layout cho admin section
│   ├── fault-order/          # Quản lý đơn hàng lỗi
│   ├── notification/         # Quản lý thông báo
│   ├── product/              # Quản lý sản phẩm (admin)
│   ├── (others-pages)/       # Các trang khác
│   └── (ui-elements)/        # UI elements demo
│
├── (auth)/                   # Route group: Authentication pages
│   ├── layout.tsx            # Layout cho auth section
│   ├── login/                # Trang đăng nhập
│   ├── register/             # Trang đăng ký
│   └── reset-password/       # Trang reset mật khẩu
│
├── (dashboard)/              # Route group: Dashboard chính
│   ├── layout.tsx            # Layout cho dashboard
│   ├── page.tsx              # Trang dashboard chính
│   ├── admin/                # Quản trị hệ thống
│   │   ├── role-management/  # Quản lý vai trò
│   │   └── user-management/ # Quản lý người dùng
│   ├── catalog/              # Quản lý danh mục
│   │   ├── category/         # Quản lý danh mục sản phẩm
│   │   ├── product/          # Quản lý sản phẩm
│   │   │   ├── [id]/         # Dynamic route: Chi tiết sản phẩm
│   │   │   │   └── variant/
│   │   │   │       └── new/  # Tạo variant mới
│   │   │   └── new/          # Tạo sản phẩm mới
│   │   ├── unit/             # Quản lý đơn vị tính
│   │   └── variant-attributes/ # Thuộc tính variant
│   ├── export/               # Quản lý xuất kho
│   │   ├── page.tsx          # Danh sách phiếu xuất
│   │   ├── new/              # Tạo phiếu xuất mới
│   │   ├── create/           # Tạo phiếu xuất
│   │   ├── details/[id]/     # Chi tiết phiếu xuất
│   │   └── process/          # Quy trình xử lý xuất kho
│   │       └── [type]/[id]/  # Dynamic routes cho các bước xử lý
│   │           ├── confirm/  # Xác nhận xuất kho
│   │           └── quantity-check/ # Kiểm tra số lượng
│   ├── import/               # Quản lý nhập kho
│   │   ├── page.tsx          # Danh sách phiếu nhập
│   │   ├── new/              # Tạo phiếu nhập mới
│   │   ├── create/           # Tạo phiếu nhập
│   │   ├── details/[id]/     # Chi tiết phiếu nhập
│   │   └── process/          # Quy trình xử lý nhập kho
│   │       └── [type]/[id]/  # Dynamic routes cho các bước xử lý
│   │           ├── layout.tsx
│   │           ├── quality-check/    # Kiểm tra chất lượng
│   │           ├── quantity-check/   # Kiểm tra số lượng
│   │           └── storage-location/ # Chọn vị trí lưu kho
│   ├── warehouse-management/ # Quản lý kho
│   │   ├── warehouse/        # Quản lý kho hàng
│   │   │   ├── page.tsx      # Danh sách kho
│   │   │   ├── new/          # Tạo kho mới
│   │   │   └── detail/[id]/  # Chi tiết kho
│   │   └── inventory-check/  # Kiểm kê kho
│   │       ├── page.tsx      # Danh sách phiếu kiểm kê
│   │       ├── new/          # Tạo phiếu kiểm kê mới
│   │       └── detail/[id]/  # Chi tiết phiếu kiểm kê
│   └── profile/              # Quản lý hồ sơ
│       └── [id]/             # Chi tiết hồ sơ người dùng
│
├── (full-width-pages)/       # Route group: Full-width pages
│   └── layout.tsx
│
├── layout.tsx                # Root layout của ứng dụng
├── providers.tsx             # Global providers (React Query, Theme, etc.)
├── globals.css               # Global styles
├── not-found.tsx             # 404 page
└── favicon.ico               # Favicon
```

**Đặc điểm:**
- Sử dụng Route Groups `(admin)`, `(auth)`, `(dashboard)`, `(full-width-pages)` để tổ chức layout
- Dynamic routes với `[id]`, `[type]` cho các trang chi tiết
- Nested routes cho các quy trình phức tạp (import/export process)

---

### 4.2. Thư Mục `components/` - Custom Components

Thư mục này chứa các components được phát triển riêng cho dự án quản lý kho.

```
components/
├── form/                     # Form components
│   ├── CreateICSheetForm.tsx         # Form tạo phiếu kiểm kê
│   ├── CreateProductForm.tsx          # Form tạo sản phẩm
│   ├── CreateVariantForm.tsx          # Form tạo variant
│   ├── CreateWarehouseForm.tsx        # Form tạo kho
│   ├── ModalAttributesForm.tsx        # Form thuộc tính (modal)
│   ├── ModalCategoryForm.tsx          # Form danh mục (modal)
│   ├── ModalCreateLocationForm.tsx    # Form tạo vị trí (modal)
│   ├── ModalUnitForm.tsx              # Form đơn vị (modal)
│   └── ModalUpdateWarehouseForm.tsx    # Form cập nhật kho (modal)
│
├── layout/                   # Layout components
│   ├── AppHeader.tsx         # Header của ứng dụng
│   ├── AppSidebar.tsx        # Sidebar navigation
│   └── Backdrop.tsx          # Backdrop overlay
│
├── modal/                    # Modal components
│   ├── CustomContentModalBox.tsx      # Modal với nội dung tùy chỉnh
│   └── NoControlModalBox.tsx          # Modal không có controls
│
├── search/                   # Search components
│   ├── SearchResultItem.tsx           # Item kết quả tìm kiếm
│   └── SearchResultList.tsx           # Danh sách kết quả tìm kiếm
│
├── table/                    # Table components
│   ├── AccordionTable.tsx             # Bảng dạng accordion
│   ├── AccordionTableHeader.tsx       # Header cho accordion table
│   ├── CustomizableTable.tsx          # Bảng tùy chỉnh
│   ├── CustomizableTableHeader.tsx    # Header cho customizable table
│   ├── Pagination.tsx                 # Phân trang
│   └── TableData.tsx                 # Component hiển thị dữ liệu bảng
│
├── TA_common/                # Common components cho Transfer Application
│   ├── ActivityLog.tsx                # Nhật ký hoạt động
│   ├── CustomFilter.tsx               # Bộ lọc tùy chỉnh
│   ├── FilterItem.tsx                 # Item trong filter
│   ├── OrderSummary.tsx               # Tóm tắt đơn hàng
│   ├── ProcessPagination.tsx          # Phân trang cho quy trình
│   ├── ProgressPagination.tsx         # Phân trang với progress
│   ├── StatusBox.tsx                  # Box hiển thị trạng thái
│   ├── TableBox.tsx                   # Box chứa bảng
│   ├── TAPagination.tsx               # Phân trang TA
│   └── UtilityBar.tsx                # Thanh tiện ích
│
├── TA_create_page/           # Components cho trang tạo Transfer Application
│   ├── CreateModal.tsx                # Modal tạo mới
│   ├── InfoBox.tsx                    # Box thông tin
│   ├── InfoBoxStatus.tsx              # Box trạng thái thông tin
│   ├── InfoList.tsx                   # Danh sách thông tin
│   ├── InfoPagination.tsx             # Phân trang thông tin
│   ├── ProductListInfoBox.tsx         # Box thông tin danh sách sản phẩm
│   ├── ProgressBar.tsx                # Thanh tiến trình
│   └── SmallInfoBox.tsx               # Box thông tin nhỏ
│
├── TA_List/                  # Components cho danh sách Transfer Application
│   ├── List.tsx                       # Component danh sách
│   ├── Summary.tsx                     # Tóm tắt
│   └── SummaryItem.tsx                # Item trong summary
│
├── ui-elements/              # UI elements
│   └── Tabs.tsx                        # Component tabs
│
├── Filter.tsx                         # Component filter chung
├── GeneralInformation.tsx             # Thông tin chung
├── InventoryCheckWorkSheet.tsx        # Phiếu kiểm kê kho
├── toast.tsx                          # Toast notification
└── ViewLocation.tsx                    # Xem vị trí kho
```

**Đặc điểm:**
- Components được tổ chức theo chức năng (form, table, modal, layout)
- Có các components đặc thù cho quy trình nhập/xuất kho (TA_common, TA_create_page, TA_List)
- Tách biệt rõ ràng giữa UI components và business logic components

---

### 4.3. Thư Mục `default_components/` - Template Components

Thư mục này chứa các components mặc định từ template TailAdmin, có thể được tái sử dụng hoặc tham khảo.

```
default_components/
├── auth/                     # Authentication components
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   └── ResetPasswordForm.tsx
│
├── calendar/                 # Calendar components
│   └── Calendar.tsx
│
├── charts/                   # Chart components
│   ├── bar/                  # Bar chart
│   └── line/                 # Line chart
│
├── common/                   # Common components (6 files)
│
├── ecommerce/                # E-commerce components (7 files)
│
├── example/                  # Example components
│   └── ModalExample/         # Modal examples (5 files)
│
├── form/                     # Form components (22 files)
│
├── header/                   # Header components
│   ├── NotificationDropdown.tsx
│   └── UserDropdown.tsx
│
├── new-creation/             # New creation components (3 files)
│
├── ui/                       # UI components (15 files)
│
├── user-profile/             # User profile components (3 files)
│
└── videos/                   # Video components (4 files)
```

**Mục đích:** Cung cấp các components mẫu từ template, có thể được tùy chỉnh hoặc tham khảo khi phát triển.

---

### 4.4. Thư Mục `services/` - API Services Layer

Thư mục này chứa các service classes để giao tiếp với backend API.

```
services/
├── InventoryManagementService.ts    # Service quản lý kho
├── UserManagementService.ts         # Service quản lý người dùng
└── WarehouseManagementService.ts    # Service quản lý kho hàng
```

**Chức năng:** 
- Tách biệt logic gọi API khỏi components
- Tập trung hóa các API calls
- Dễ dàng bảo trì và test

---

### 4.5. Thư Mục `interfaces/` - TypeScript Type Definitions

Thư mục này chứa các type definitions và interfaces cho TypeScript.

```
interfaces/
├── inboundOutboundType.ts           # Types cho nhập/xuất kho
├── interface.table.ts               # Types cho table
├── inventoryManagementType.ts       # Types cho quản lý kho
├── userManagementType.ts            # Types cho quản lý người dùng
└── warehouseManagementType.ts       # Types cho quản lý kho hàng
```

**Mục đích:** 
- Đảm bảo type safety trong toàn bộ ứng dụng
- Tái sử dụng types giữa các components
- Cải thiện developer experience với autocomplete

---

### 4.6. Thư Mục `context/` - React Context Providers

Thư mục này chứa các React Context để quản lý state toàn cục.

```
context/
├── ProcessContext.tsx        # Context cho quy trình xử lý
├── SidebarContext.tsx        # Context cho sidebar state
└── ThemeContext.tsx          # Context cho theme (dark/light mode)
```

**Chức năng:**
- Quản lý state toàn cục không cần prop drilling
- Theme management (dark/light mode)
- Sidebar state (collapsed/expanded)
- Process state cho các quy trình nhập/xuất kho

---

### 4.7. Thư Mục `hooks/` - Custom React Hooks

Thư mục này chứa các custom hooks để tái sử dụng logic.

```
hooks/
├── useGoBack.ts              # Hook để điều hướng quay lại
├── useModal.ts               # Hook để quản lý modal state
└── useUserProfile.ts         # Hook để lấy thông tin user profile
```

**Mục đích:**
- Tái sử dụng logic giữa các components
- Tách biệt logic khỏi UI
- Dễ dàng test và maintain

---

### 4.8. Thư Mục `lib/` - Utility Functions

Thư mục này chứa các utility functions và helpers.

```
lib/
├── api-mask.ts               # Utility cho API masking/formatting
└── utils.ts                  # Các utility functions chung
```

**Chức năng:**
- Các hàm helper dùng chung
- Formatting, validation, transformation functions

---

### 4.9. Thư Mục `constants/` - Constants

```
constants/
└── constants.ts              # Các hằng số của ứng dụng
```

**Mục đích:** Lưu trữ các giá trị constant như API endpoints, default values, configuration values.

---

### 4.10. Thư Mục `icons/` - SVG Icons

Thư mục này chứa các SVG icon components (khoảng 60+ icons).

```
icons/
├── index.tsx                 # Export tất cả icons
├── alert.svg
├── angle-down.svg
├── arrow-down.svg
├── bell.svg
├── box.svg
├── calendar.svg
├── check-circle.svg
├── ... (60+ icon files)
└── user-circle.svg
```

**Đặc điểm:**
- Tất cả icons là SVG format
- Được import như React components nhờ cấu hình `@svgr/webpack`
- Tập trung quản lý icons tại một nơi

---

## 5. KIẾN TRÚC VÀ PATTERNS

### 5.1. Kiến Trúc Tổng Thể

Dự án sử dụng **Next.js App Router** với kiến trúc:

1. **Presentation Layer** (`app/`, `components/`): UI và routing
2. **Business Logic Layer** (`services/`, `hooks/`): Logic xử lý và API calls
3. **Data Layer** (`interfaces/`, `constants/`): Type definitions và constants
4. **State Management** (`context/`): Global state management

### 5.2. Design Patterns

- **Component-based Architecture**: Tách biệt components theo chức năng
- **Service Layer Pattern**: Tách biệt API calls vào service layer
- **Context Pattern**: Quản lý global state với React Context
- **Custom Hooks Pattern**: Tái sử dụng logic với custom hooks
- **Type Safety**: Sử dụng TypeScript cho type safety

### 5.3. Routing Strategy

- **Route Groups**: Sử dụng `(admin)`, `(auth)`, `(dashboard)` để tổ chức layout
- **Dynamic Routes**: Sử dụng `[id]`, `[type]` cho dynamic routing
- **Nested Routes**: Sử dụng nested routes cho các quy trình phức tạp

---

## 6. CÔNG NGHỆ VÀ DEPENDENCIES CHÍNH

### 6.1. Core Dependencies

- **Next.js 16.x**: React framework với App Router
- **React 19.2.0**: UI library
- **TypeScript 5.x**: Type safety
- **Tailwind CSS v4**: Utility-first CSS framework

### 6.2. UI Libraries

- **@radix-ui/react-slot**: UI primitives
- **lucide-react**: Icon library
- **apexcharts**: Chart library
- **ag-grid-community/enterprise**: Advanced data grid
- **react-hook-form**: Form management
- **@tanstack/react-query**: Data fetching và caching

### 6.3. Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

---

## 7. TỔNG KẾT

### 7.1. Điểm Mạnh

1. **Cấu trúc rõ ràng**: Tổ chức thư mục logic, dễ navigate
2. **Type Safety**: Sử dụng TypeScript đầy đủ
3. **Component Reusability**: Components được tách biệt và có thể tái sử dụng
4. **Separation of Concerns**: Tách biệt rõ ràng giữa UI, logic, và data
5. **Modern Stack**: Sử dụng các công nghệ hiện đại (Next.js 16, React 19)

### 7.2. Cấu Trúc Phù Hợp Cho

- Dự án quản lý kho (Inventory Management)
- Ứng dụng admin dashboard
- Ứng dụng có nhiều quy trình phức tạp (nhập/xuất kho)
- Dự án cần scalability và maintainability cao

---

**Tài liệu này được tạo tự động để hỗ trợ việc ghi báo cáo dự án.**















