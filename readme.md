# POS SYSTEM – Point of Sale Web Application

## 🔗 Demo
**Demo:** Yakında  
(Buraya canlı demo linki veya kısa tanıtım videosu eklenecek)

---

## 📌 Proje Tanımı

POS SYSTEM, işletmelerin **satış**, **proje** ve **gelir takibini** tek bir merkezden yönetebilmesi için geliştirilmiş web tabanlı bir **Point of Sale (POS)** uygulamasıdır.

Sistem, gerçek bir işletmenin günlük çalışma düzeni dikkate alınarak tasarlanmıştır ve yönetici odaklı bir **dashboard** üzerinden tüm kritik verileri sunar.

---

## 🎯 Projenin Amacı

- Satış ve gelir verilerini merkezi bir sistemde toplamak  
- Projeleri ve finansal performansı anlık olarak izlemek  
- Yöneticiye karar almayı kolaylaştıran görsel analizler sunmak  
- Gerçek hayatta kullanılabilir bir POS mimarisi oluşturmak  

---

## 🧩 Sistem Mimarisi (Genel Bakış)

- **Frontend:** Yönetici paneli ve dashboard arayüzü
- **Backend:** REST API üzerinden veri yönetimi
- **Database:** Satış, proje ve işlem kayıtlarının saklanması

Frontend, backend’den aldığı verileri işleyerek **kartlar**, **tablolar** ve **grafikler** halinde kullanıcıya sunar.

---

## 📊 Dashboard Yapısı

Dashboard, yöneticinin sistemi tek bakışta analiz edebilmesi için modüler olarak tasarlanmıştır.

### 🔹 Genel İstatistikler (KPI Cards)

Dashboard’un üst bölümünde yer alan kartlar şunları gösterir:

- Toplam proje sayısı  
- Toplam işlem (transaction) sayısı  
- Toplam gelir  
- Sistem kullanıcıları / admin sayısı  

Bu alan, sistemin genel durumunu **anında** özetler.

---

### 🔹 Revenue per Project (Proje Bazlı Gelir Analizi)

- Her projenin ürettiği toplam gelir hesaplanır  
- Veriler **bar chart (sütun grafik)** ile gösterilir  
- Grafik renkleri sabittir ve hover’a bağlı değildir  

Bu bölüm sayesinde:
- En kârlı projeler
- Düşük performanslı projeler  
kolayca analiz edilebilir.

---

### 🔹 Transaction Timeline (İşlem Akışı)

- Son işlemler zamana bağlı olarak listelenir  
- Gelir hareketleri grafik üzerinde takip edilir  

Bu alan, satış hareketliliğini ve sistem kullanım yoğunluğunu gösterir.

---

### 🔹 Project Status Overview

- Projeler durumlarına göre gruplanır:
  - Aktif
  - Tamamlanmış
  - İptal edilmiş  

Pie chart üzerinden proje dağılımı net şekilde görülür.

---

### 🔹 Notifications (Sistem Bildirimleri)

- Sistem tarafından üretilen son bildirimler listelenir  
- Yönetici, önemli olaylardan hızlıca haberdar olur  

---

## 🗂️ Proje Yönetimi (Profesyonel Açıklama)

Proje yönetim modülü şunları kapsar:

- Yeni proje oluşturma  
- Proje güncelleme  
- Proje silme  
- Backend doğrulamalı veri işlemleri  

Tüm işlemler API üzerinden kontrol edilir ve hatalı veriler sistem tarafından engellenir.

Bu yapı, gerçek bir kurumsal proje yönetim sürecini simüle eder.

---

## 🛠️ Kullanılan Teknolojiler

### Frontend

- **React.js** – Component tabanlı mimari
- **Vite** – Hızlı geliştirme ve build süreci
- **Tailwind CSS** – Modern ve ölçeklenebilir UI tasarımı
- **Framer Motion** – Animasyonlar ve geçiş efektleri
- **Axios** – API istekleri
- **Recharts** – Grafik ve veri görselleştirme
- **React Icons** – Genel ikon seti
- **Lucide React** – Modern ve sade ikonlar
- **Material UI** – Gelişmiş UI bileşenleri

---

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- RESTful API mimarisi

---

## 📦 Dependencies

- framer-motion  
- react-icons  
- lucide-react  
- tailwindcss  
- axios  
- @mui/material  
- recharts  

---

## 🧠 Projenin Güçlü Yönleri

- Gerçek iş senaryolarına uygun yapı  
- Admin dashboard odaklı tasarım  
- Grafiklerle desteklenmiş veri analizi  
- Temiz ve okunabilir kod mimarisi  
- Genişletilebilir sistem altyapısı  

Bu proje, sadece çalışan bir uygulama değil;  
**kurumsal bir POS sisteminin sadeleştirilmiş ama güçlü bir versiyonudur.**

---

## 👤 Geliştirici Notu

Bu proje, modern frontend teknolojileri ve dashboard mimarisi konusundaki yetkinliği göstermek amacıyla geliştirilmiştir.

Hedef:
- Gerçekçi
- Okunabilir
- Profesyonel  
bir POS sistemi ortaya koymaktır.

---

## 📌 Özet

POS SYSTEM, işletmelerin satış ve gelir süreçlerini tek merkezden yöneten,  
analiz odaklı, modern ve profesyonel bir web uygulamasıdır.
