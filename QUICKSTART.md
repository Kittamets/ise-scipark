# 🚀 Quick Start Guide

## วิธีเปิดโปรเจค (แบบง่าย)

### ขั้นตอนที่ 1: เปิด PowerShell
1. กด **Win + X**
2. เลือก **Windows PowerShell** (หรือ Terminal)
3. พิมพ์คำสั่ง:
```powershell
cd C:\ise-scipark
.\start.ps1
```

### ขั้นตอนที่ 2: รอสักครู่
- Backend จะเปิดที่ `http://localhost:3000`
- Frontend จะเปิดที่ `http://localhost:5173` หรือ `5174`

### ขั้นตอนที่ 3: เข้าใช้งาน
เปิด browser ไปที่ **http://localhost:5173**

---

## หากเจอปัญหา "cannot be loaded because running scripts is disabled"

รันคำสั่งนี้ใน PowerShell (Run as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

แล้วลองอีกครั้ง!

---

## Login ข้อมูลทดสอบ
- **Username:** `testuser`
- **Password:** `test1234`

---

## ปิดโปรแกรม
กดปุ่ม **X** ที่ windows terminal ที่เปิดขึ้นมา (2 windows)

หรือรัน:
```powershell
cd C:\ise-scipark
.\stop.ps1
```
