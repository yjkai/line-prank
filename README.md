# LINE 禮物整人專案 (LINE LIFF Prank)

本專案是一個以 **LINE LIFF** 製作的整人網頁。整個流程完美還原了「LINE 禮物」的官方送禮體驗。

* **送禮者（Sender）**：開啟 LIFF 網頁進行登入，設定要惡作劇的文字，並選定仿官方禮物卡片範本（例如星巴克、7-11等），透過 **Friend Picker (好友選擇器)** 發送給 1on1 好友。
* **收禮者（Receiver）**：在聊天室點擊「打開我的禮物」按鈕後，會開啟相同的 LIFF，並在背景以收禮者的身份自動送出先前設定好的惡作劇訊息，隨後自動關閉視窗，完成整人。

---

## 🚀 專案特點
1. **100% 免費 & 無伺服器需求**：整個專案皆使用 LINE LIFF client-side SDK，**不需使用收費的 LINE Bot 或是架設後端 Webhook/資料庫**，可直接部署在 **GitHub Pages** 或 **Vercel** 等免費靜態託管空間。
2. **高質感 Glassmorphism UI**：送禮者控制面板使用暗色調與磨砂玻璃質感設計，附帶即時卡片效果預覽。
3. **偽裝度極高**：生成的 Flex Message 樣式、字體、配色及排版皆仿造 LINE 官方禮物設計，收禮者難以在第一時間察覺。

---

## 🛠️ LINE Developers 設定步驟指南 (極重要)

若要讓此專案正常運作，您需要到 [LINE Developers Console](https://developers.line.biz/) 建立並設定一個 LIFF 應用程式。請務必跟著以下步驟完成設定：

### 1. 建立 LINE Login Channel
1. 登入 LINE Developers Console。
2. 選擇或建立一個 **Provider**（提供者）。
3. 點擊 **Create a new channel**，選擇 **LINE Login**。
4. 輸入您的 Channel 名稱與說明。
   * 💡 **偽裝技巧**：為了降低收禮者同意授權時的防備，建議將 Channel 名稱命名為 **「LINE 禮物」**，並上傳官方的綠色禮物圖示作為 Channel Icon。
5. 點擊 **Create** 建立。

### 2. 新增 LIFF 應用程式
1. 在剛建立好的 LINE Login Channel 中，切換到 **LIFF** 標籤頁，點擊 **Add**。
2. 填寫以下設定：
   * **LIFF app name**：例如 `LINE 禮物 - 領取確認`。
   * **Size**：選擇 **Full**。
   * **Endpoint URL**：輸入您部署後的 HTTPS 網址（例如 `https://your-username.github.io/line-prank/`）。
   * **Scopes (權限範圍)**：**必須勾選** `profile` 與 `chat_message.write`。
     * > [!IMPORTANT]
     * > `chat_message.write` 權限是讓收禮者自動在聊天室發送訊息的關鍵，請務必開啟，否則會出現發送失敗。
   * **Features**：開啟 **Share Target Picker**（送禮人選擇好友發送 Flex Message 時需要）。
3. 點擊 **Add** 保存。您將會獲得一個 LIFF ID（格式如 `2010405195-O4nJcnXp`）與 LIFF URL。

### 3. 將 LIFF ID 填入程式碼
在您下載本專案後，打開 [app.js](app.js) 檔案，將第 8 行的 `LIFF_ID` 替換成您剛剛申請到的 LIFF ID：
```javascript
// 請在此填寫您在 LINE Developers Console 申請的 LIFF ID
const LIFF_ID = '您的_LIFF_ID'; 
```

---

## 🌐 部署方式

因為專案是全前端靜態網頁，您可以選擇以下任一免費平台進行部署：

### 方法 A：部署到 GitHub Pages (推薦)
1. 將本專案的程式碼檔案 (`index.html`, `style.css`, `app.js`) 上傳到您新建的 GitHub 儲存庫 (Repository)。
2. 進入儲存庫的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下的 **Branch** 選擇 `main` (或 `master`) 分支，並點擊 **Save**。
4. 稍等一到兩分鐘，GitHub 會提供給您一個 HTTPS 網址（例如 `https://your-username.github.io/repository-name/`），將此網址填回 LINE Developers 的 **Endpoint URL** 中。

### 方法 B：部署到 Vercel (快速)
1. 安裝 Vercel CLI 或透過 Vercel 網頁端連結您的 GitHub。
2. 直接將本目錄拖曳至 Vercel 進行部署。
3. 取得 Vercel 產生的 HTTPS 網址，將其填回 LINE Developers 的 **Endpoint URL** 中。

---

## 🎮 整人遊玩流程

1. **進入設定頁**：送禮者在手機或電腦瀏覽器打開您的 LIFF URL（如：`https://liff.line.me/2010405195-O4nJcnXp`）。
2. **登入授權**：點擊登入並授權您的 LINE 帳號。
3. **客製化卡片**：
   * 在左側輸入您要讓收禮者發出的惡作劇文字（例如：「我明天請大家喝飲料！」）。
   * 選擇想要偽裝的禮物卡片（如星巴克、7-11等）或自訂標題。
   * 在右側會看到即時生成的 LINE 禮物預覽卡片。
4. **傳送禮物**：點擊「選擇好友並傳送禮物」，在彈出的 LINE 好友選取器中勾選您要整的好友並點擊分享。
5. **收禮人點擊**：
   * 好友收到您送出的精美 LINE 禮物卡片。
   * 好友點擊卡片上的 **「打開我的禮物」**。
6. **觸發整人**：
   * 網頁開啟，並顯示「正在為您兌換禮物卡...」官方樣式載入動畫。
   * 首次開啟會要求好友同意 Consent 授權（包含取得 profile 與傳送訊息）。
   * 好友同意授權後，LIFF 即會在背景自動發送該惡作劇文字，並立即關閉視窗。
   * 好友會看見自己的聊天室中，以自己的頭像和名義發送了剛才設定的惡作劇文字！

---

## ⚠️ 免責聲明
本專案僅供程式學習交流及親友間娛樂整人使用。請勿將此程式用於任何違法詐騙、惡意釣魚或破壞他人感情之行為。因使用本程式所衍生之任何紛爭，作者概不負責。
