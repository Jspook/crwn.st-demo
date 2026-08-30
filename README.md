This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🇹🇭 คู่มือและอธิบายการทำงานของโค้ดทั้งหมด (Codebase Explanation)

ระบบ **crwn.st (surreal-fit)** เป็นเว็บแอปพลิเคชันระบบขายหน้าร้าน (POS) และระบบจัดการห้องลองชุดแบบไร้รอยต่อ (Seamless O2O Retail) สำหรับแบรนด์แฟชั่นหรูหรา โดยแบ่งออกเป็น 3 พอร์ทัลหลักตามบทบาทของผู้ใช้ (Customer, Cashier POS, และ Fitting Room Staff) พัฒนาขึ้นโดยใช้เทคโนโลยี **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, และ **Framer Motion**

### 1. โครงสร้างไฟล์และสถาปัตยกรรมข้อมูล (Data Architecture & Directory Structure)

โปรเจกต์นี้ใช้ระบบไฟล์ JSON ในการทำหน้าที่เป็นฐานข้อมูลจำลอง (Mock Database) เพื่อให้สามารถอ่านและเขียนข้อมูลได้โดยตรงโดยไม่ต้องพึ่งพาระบบ Database ภายนอก

- **โฟลเดอร์ `data/`**:
  - [products.json](crwn.st/surreal-fit/data/products.json): แค็ตตาล็อกสินค้าแต่ละรายการ ประกอบด้วยรหัสสินค้า (ID), รหัสบาร์โค้ด (Barcode), ชื่อสินค้า, หมวดหมู่, ราคา, แท็ก และข้อมูลย่อย (Variants) เช่น สี (Color), ขนาด (Size) และจำนวนสินค้าในสต็อก (Stock)
  - [users.json](crwn.st/surreal-fit/data/users.json): ข้อมูลบัญชีผู้ใช้งานประกอบด้วยรหัสผ่านและบทบาทหน้าที่ (Roles) ได้แก่ `CUSTOMER` (ลูกค้า), `CASHIER` (แคชเชียร์) และ `FITTING_STAFF` (พนักงานห้องลอง)
  - [fittingRooms.json](crwn.st/surreal-fit/data/fittingRooms.json): รายชื่อและสถานะความว่างของห้องลองชุดแต่ละห้อง (เช่น fr1, fr2, fr3)
  - [fittingOrders.json](crwn.st/surreal-fit/data/fittingOrders.json): รายการคำขอทดลองชุดของลูกค้าจากห้องลอง ส่งไปยังพนักงานคิวห้องลอง
  - [receipts.json](crwn.st/surreal-fit/data/receipts.json): ประวัติใบเสร็จรับเงินที่ออกหลังจากการชำระเงินเสร็จสิ้น
  - [cart.json](crwn.st/surreal-fit/data/cart.json): ตะกร้าสินค้าชั่วคราวของลูกค้าในการทำรายการซื้อสินค้า

---

### 2. โมดูลการจัดการข้อมูลและความปลอดภัยระดับระบบ (Core System Modules)

- **ตัวจัดการฐานข้อมูลจำลอง [db.ts](crwn.st/surreal-fit/src/lib/db.ts)**:
  - มีฟังก์ชัน `readData<T>(fileName)` สำหรับโหลดข้อมูลจากไฟล์ JSON และ `writeData<T>(fileName, data)` สำหรับบันทึกข้อมูลกลับลงไฟล์แบบเรียลไทม์
  - ฟังก์ชัน `generateId(prefix)` สำหรับสุ่มสร้าง ID แบบระบุประเภท (เช่น `order_xxxxxx` หรือ `rcpt_xxxxxx`)
- **ระบบ Session [session.ts](crwn.st/surreal-fit/src/lib/session.ts)**:
  - ใช้สำหรับการลงชื่อเข้าใช้งานของพนักงานและลูกค้า โดยการแปลงข้อมูล Payload เป็น Base64 และบันทึกผ่าน HTTP-only Cookie ในชื่อ `crwn_session` ซึ่งมีอายุการใช้งาน 1 วัน
  - ประกอบด้วยฟังก์ชัน `createSession()`, `getSession()`, และ `clearSession()`
- **ระบบการกรองสิทธิ์และเข้าถึงหน้าเพจ [proxy.ts](crwn.st/surreal-fit/src/proxy.ts)**:
  - ทำหน้าที่เป็นระบบ Role-Based Access Control (RBAC) เพื่อตรวจสอบสิทธิ์ของผู้ใช้งานก่อนเข้าสู่หน้าพอร์ทัลต่าง ๆ หากตรวจพบสิทธิ์ไม่ตรงกับบทบาท (เช่น พนักงานเข้าหน้าจอของลูกค้า หรือลูกค้าเข้าหน้าจอแคชเชียร์) ระบบจะทำการ Redirect ไปยังหน้าแรกหรือหน้า Login ทันที

---

### 3. พอร์ทัลการใช้งาน (User Portals & Frontend Pages)

หน้าจอการทำงานหลักของระบบแบ่งตามเส้นทางโฟลเดอร์ย่อยใน `/src/app` ดังนี้:

#### A. หน้าแรกและหน้าเข้าสู่ระบบ (Public Portals)
- [page.tsx](crwn.st/surreal-fit/src/app/page.tsx): หน้าโฮมเพจหลักที่นำเสนอบริการ crwn.st แบบอินเตอร์แอคทีฟ ให้ผู้ใช้สามารถเลือก Portal ที่ต้องการเข้าสู่ระบบได้
- [login/page.tsx](crwn.st/surreal-fit/src/app/login/page.tsx): หน้าลงชื่อเข้าใช้งานที่สามารถสลับประเภทการเข้าสู่ระบบได้ระหว่าง:
  - **ลูกค้า**: ใช้เพียงเบอร์โทรศัพท์มือถือในการล็อกอินเข้าสู่ระบบ
  - **พนักงานขาย/ห้องลอง**: ล็อกอินโดยใช้ชื่อผู้ใช้งาน (Username) และรหัสผ่าน (Password)

#### B. พอร์ทัลฝั่งลูกค้า (Customer Portal - `/customer`)
- [dashboard/page.tsx](crwn.st/surreal-fit/src/app/customer/dashboard/page.tsx): ศูนย์กลางควบคุมการทำงานของลูกค้า ช่วยให้ลูกค้าสามารถเปิดกล้องสแกน (จำลองการทำงาน) เพื่อสแกนบาร์โค้ดประตูห้องลอง หรือสแกนบาร์โค้ดตัวสินค้าเพื่อเรียกดูรายละเอียดได้
- [fitting-room/page.tsx](crwn.st/surreal-fit/src/app/customer/fitting-room/page.tsx): หน้าสำหรับแสดงสินค้าทั้งหมดในรูปแบบแค็ตตาล็อกดิจิทัล ลูกค้าสามารถกรองสินค้าตามหมวดหมู่ ค้นหาชื่อสินค้า และเลือกขนาดหรือสีของสินค้าเพื่อส่งคำร้องขอไปยังพนักงานคิวห้องลองเพื่อให้จัดส่งชุดมาให้ทดลองสวมใส่ได้ทันที
- [checkout/page.tsx](crwn.st/surreal-fit/src/app/customer/checkout/page.tsx): หน้าสรุปราคาสินค้าและกระบวนการจ่ายเงินแบบบริการตนเอง (Self-checkout / Pay & Go) รองรับการจ่ายเงินผ่านบัตรเครดิต หรือสแกน QR Code PromptPay เมื่อยืนยันการชำระเงิน ระบบจะส่งข้อมูลไปตัดจำนวนสินค้าในสต็อกทันที
- [receipt/[id]/page.tsx](crwn.st/surreal-fit/src/app/customer/receipt/[id]/page.tsx): หน้ารายละเอียดใบเสร็จรับเงินแบบอิเล็กทรอนิกส์ (E-Receipt) ที่ออกให้หลังจากการชำระเงินเรียบร้อยแล้ว

#### C. พอร์ทัลฝั่งพนักงานห้องลอง (Fitting Room Staff Portal - `/staff/fitting`)
- [fitting/page.tsx](crwn.st/surreal-fit/src/app/staff/fitting/page.tsx): หน้าจอแสดงคิวคำร้องขอลองชุดในร้านแบบ Real-time (มีการดึงข้อมูลอัปเดตอัตโนมัติทุก ๆ 5 วินาที) แสดงผลเป็นรูปแบบบอร์ดคิวแบ่งเป็น 3 สถานะ:
  1. **Pending** (คำขอที่เข้ามาใหม่ รอพนักงานอนุมัติหรือจัดเตรียม)
  2. **Preparing** (พนักงานกำลังนำสินค้าจากคลังไปจัดเตรียมหรือเดินไปส่ง)
  3. **Complete** (พนักงานจัดส่งชุดถึงห้องลองของลูกค้าเป็นที่เรียบร้อย)
  - พนักงานสามารถคลิกเพื่อเปลี่ยนสถานะของแต่ละคิวคำขอได้โดยตรง

#### D. พอร์ทัลฝั่งพนักงานแคชเชียร์ (Cashier POS Portal - `/staff/cashier`)
- [cashier/page.tsx](crwn.st/surreal-fit/src/app/staff/cashier/page.tsx): ระบบ Point-of-Sale (POS) หน้าเคาน์เตอร์สำหรับแคชเชียร์ขายสินค้าหน้าร้าน ประกอบด้วย:
  - ความสามารถในการสแกนรหัสบาร์โค้ดเพื่อระบุและเพิ่มสินค้าเข้าสู่ระบบอย่างรวดเร็ว
  - การระบุรหัสสมาชิกลูกค้าผ่านการค้นหาหมายเลขโทรศัพท์
  - การรวมคะแนน คำนวณราคาสินค้า, ภาษีมูลค่าเพิ่ม, และการทำธุรกรรมแบบจ่ายผ่าน บัตรเครดิต/เงินสด/QR Code เพื่อสรุปรายการและบันทึกใบเสร็จ

---

### 4. ส่วนประกอบ UI ที่ใช้ร่วมกัน (Shared UI Components)

ส่วนประกอบอินเตอร์เฟสถูกจัดเก็บไว้ใน `/src/components/ui` ซึ่งรองรับลูกเล่นและการเคลื่อนไหวแบบลื่นไหลผ่าน Framer Motion:

- [BarcodeScanner.tsx](crwn.st/surreal-fit/src/components/ui/BarcodeScanner.tsx): โมดอลจำลองการทำหน้าที่สแกนแถบบาร์โค้ดของตัวสินค้า รองรับการป้อนข้อมูลบาร์โค้ดด้วยคีย์บอร์ด หรือคลิกรหัสตัวอย่างเดโมเพื่อทดสอบการทำงาน
- [RoomScannerModal.tsx](crwn.st/surreal-fit/src/components/ui/RoomScannerModal.tsx): โมดอลจำลองการสแกน QR Code ประตูห้องลอง เพื่อยืนยันว่าลูกค้ากำลังสวมใส่เสื้อผ้าอยู่ในห้องทดลองห้องใดก่อนที่จะส่งคำร้องขอเสื้อผ้าได้
- [ItemRequestModal.tsx](crwn.st/surreal-fit/src/components/ui/ItemRequestModal.tsx): โมดอลให้ลูกค้าหรือพนักงานระบุ สี, ขนาด และห้องลองที่ต้องการจัดส่ง ก่อนจะกดยืนยันการสั่งลองเสื้อผ้า
- [CartDrawer.tsx](crwn.st/surreal-fit/src/components/ui/CartDrawer.tsx): แผงลิ้นชักแสดงรายการสินค้าในตะกร้าชั่วคราวของลูกค้า สามารถเปิด-ปิดจากด้านขวาของจอภาพ รองรับการเพิ่ม/ลดจำนวน และเป็นทางผ่านไปสู่หน้าเช็คเอาต์ชำระเงิน
- [GlassCard.tsx](crwn.st/surreal-fit/src/components/ui/GlassCard.tsx): การ์ดดีไซน์กระจกฝ้าหรูหรา (Frosted Glass Effect) ที่ตอบสนองต่อการชี้เมาส์และการเอียงของหน้าจอ
- [AuroraBackground.tsx](crwn.st/surreal-fit/src/components/ui/AuroraBackground.tsx): พื้นหลังไล่เฉดสีในสไตล์แสงเหนือ (Aurora) เคลื่อนไหวช้า ๆ เพื่อส่งเสริมบรรยากาศเงียบหรู (Quiet Luxury)
- [PageTransition.tsx](crwn.st/surreal-fit/src/components/ui/PageTransition.tsx): ตัวควบคุมระบบแอนิเมชันสำหรับเปลี่ยนหน้าเว็บบนเบราว์เซอร์
- [ProductCard.tsx](crwn.st/surreal-fit/src/components/ui/ProductCard.tsx): การ์ดแสดงผลรูปภาพและข้อมูลพื้นฐานของตัวสินค้าภายในแกลเลอรีขายสินค้า

---

### 5. ระบบ API หลังบ้าน (Backend APIs)

ไฟล์กำหนด API Routing อยู่ภายใต้ `/src/app/api` ทั้งหมด:
- **`api/auth/`**:
  - `login/route.ts`: ตรวจสอบประเภทล็อกอิน หากเป็น `staff` จะค้นหาด้วย username + password จาก `users.json` หากเป็น `customer` จะสืบค้นด้วยเบอร์โทรศัพท์ เมื่อเข้าสู่ระบบสำเร็จระบบจะสร้างเซสชันและส่งกลับเส้นทางหน้าพอร์ทัลเป้าหมาย
  - `logout/route.ts`: ทำลายคุกกี้เซสชัน
- **`api/products/`**:
  - `route.ts`: ดึงรายการสินค้าทั้งหมดส่งออกไปในรูปแบบ JSON
  - `barcode/[code]/route.ts`: สืบค้นข้อมูลรายละเอียดสินค้าตัวนั้น ๆ ผ่านทางรหัสบาร์โค้ด
- **`api/fitting-orders/`**:
  - `route.ts`: ส่งออกประวัติคำสั่งลองชุด (GET) หรือยอมรับคำสั่งการจองคิวลองชุดใหม่จากลูกค้าในห้องลอง (POST)
  - `[id]/route.ts`: อัปเดตสถานะของคำสั่งลองชุดตามรหัสคำสั่ง (PUT)
- **`api/receipts/`**:
  - `route.ts`: บันทึกการออกใบเสร็จรับเงินใหม่ (POST) พร้อมกับคำนวณและตัดสต็อกสินค้าในคลังสินค้าตามรหัส SKU ที่กำหนดไว้ใน `products.json`
- **`api/users/`**:
  - `route.ts`: ค้นหาข้อมูลสมาชิกผู้ใช้งาน
- **`api/cart/`**:
  - `route.ts`: ดึงข้อมูลสินค้า หรือล้างข้อมูลตะกร้าสินค้า

