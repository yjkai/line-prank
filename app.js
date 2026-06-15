/**
 * LINE LIFF Prank (LINE 禮物整人專案) - Core JS
 * Author: Antigravity Pair Programming
 */

// ==================== CONFIGURATION (設定區) ====================
// 請在此填寫您在 LINE Developers Console 申請的 LIFF ID
const LIFF_ID = '2010405195-O4nJcnXp'; 

// 預設禮物卡片樣式資料庫 (使用高品質 Unsplash 免費圖庫)
const GIFT_TEMPLATES = {
  lovepoint: {
    title: '【愛情滿分就差這1點：樂成宮月老給你1點脫單力】用LINE POINTS 1點為好友的戀情助攻，一起兌換好禮機會！',
    image: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
    headerImage: 'https://yjkai.github.io/line-prank/justforyou.png'
  },
  starbucks: {
    title: '【星巴克】特大杯巧克力可可碎片星冰樂雙杯組',
    image: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
    headerImage: 'https://yjkai.github.io/line-prank/justforyou.png'
  },
  brownsugar: {
    title: '生活來點甜【7-ELEVEN】冰黑糖珍珠撞奶(大)好禮即享券',
    image: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
    headerImage: 'https://yjkai.github.io/line-prank/justforyou.png'
  }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isAuto = urlParams.get('auto') === 'yes';
  const prankText = urlParams.get('text');

  if (isAuto && prankText) {
    // 進入收禮者模式 (Receiver Mode)
    initReceiverMode(prankText);
  } else {
    // 進入送禮者設定模式 (Sender Mode)
    initSenderMode();
  }
});

// ==================== SENDER MODE (送禮者設定邏輯) ====================
function initSenderMode() {
  document.getElementById('sender-view').classList.remove('hidden');
  
  // UI 元素
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const userAvatar = document.getElementById('user-avatar');
  const userNameEl = document.getElementById('user-name');
  
  const inputPrankText = document.getElementById('prank-text');
  const selectTemplate = document.getElementById('gift-template');
  const inputCardHeaderImage = document.getElementById('card-header-image') || document.getElementById('card-header-text');
  const btnSend = document.getElementById('btn-send');
  
  const customGiftFields = document.getElementById('custom-gift-fields');
  const inputCustomTitle = document.getElementById('custom-title');
  const inputCustomImage = document.getElementById('custom-image');
  
  // 即時預覽 UI 元素
  const previewHeaderImg = document.getElementById('preview-header-img');
  const previewImage = document.getElementById('preview-image');
  const previewTitle = document.getElementById('preview-title');

  // 初始化 LIFF
  liff.init({ liffId: LIFF_ID })
    .then(() => {
      if (!liff.isLoggedIn()) {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
      } else {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        
        // 取得使用者個人檔案
        liff.getProfile()
          .then(profile => {
            userAvatar.src = profile.pictureUrl || 'https://via.placeholder.com/150';
            userNameEl.textContent = profile.displayName;
          })
          .catch(err => {
            console.error('取得個人資料失敗:', err);
            userNameEl.textContent = 'LINE 用戶';
          });
          
        // 綁定送禮按鈕
        btnSend.addEventListener('click', handleSendGift);

        // 綁定診斷按鈕
        const btnTestText = document.getElementById('btn-send-test-text');
        const btnTestFlex = document.getElementById('btn-send-test-simple-flex');
        const diagLog = document.getElementById('diagnostic-log');

        if (btnTestText) {
          btnTestText.addEventListener('click', () => {
            sendDiagnosticMessage([
              {
                type: 'text',
                text: '【LINE 禮物測試】這是一封診斷測試純文字訊息。如果看到這行，代表您的 LIFF 傳送功能本身是正常的！'
              }
            ], '純文字測試');
          });
        }

        if (btnTestFlex) {
          btnTestFlex.addEventListener('click', () => {
            sendDiagnosticMessage([
              {
                type: 'flex',
                altText: '【LINE 禮物測試】極簡 Flex 測試訊息',
                contents: {
                  type: 'bubble',
                  body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: '【極簡 Flex 測試】如果看到這行，代表您的 Channel 傳送 Flex 訊息功能正常！',
                        wrap: true
                      }
                    ]
                  }
                }
              }
            ], '極簡 Flex 測試');
          });
        }

        const btnTestMediumFlex = document.getElementById('btn-send-test-medium-flex');
        if (btnTestMediumFlex) {
          btnTestMediumFlex.addEventListener('click', () => {
            const activeTemplate = selectTemplate.value;
            let cardTitle = '';
            if (activeTemplate === 'custom') {
              cardTitle = inputCustomTitle.value.trim() || '自訂禮物商品';
            } else {
              cardTitle = GIFT_TEMPLATES[activeTemplate].title;
            }
            const encodedPrankText = encodeURIComponent(inputPrankText.value.trim() || '測試');
            const targetLiffUrl = `https://liff.line.me/${LIFF_ID}?auto=yes&text=${encodedPrankText}`;
            
            sendDiagnosticMessage([
              {
                type: 'flex',
                altText: '【LINE 禮物測試】中等 Flex 測試訊息',
                contents: {
                  type: 'bubble',
                  hero: {
                    type: 'image',
                    url: 'https://yjkai.github.io/line-prank/justforyou.png',
                    size: 'full',
                    aspectRatio: '1:1',
                    aspectMode: 'cover',
                    action: {
                      type: 'uri',
                      uri: targetLiffUrl
                    }
                  },
                  body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: cardTitle,
                        weight: 'bold',
                        wrap: true
                      }
                    ]
                  },
                  footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'button',
                        style: 'primary',
                        action: {
                          type: 'uri',
                          label: '打開測試連結',
                          uri: targetLiffUrl
                        }
                      }
                    ]
                  }
                }
              }
            ], '中等 Flex 測試');
          });
        }

        function sendDiagnosticMessage(payload, testName) {
          diagLog.style.display = 'block';
          diagLog.textContent = `[${testName}] 正在啟動好友選取器...`;
          
          if (!liff.isApiAvailable('shareTargetPicker')) {
            diagLog.textContent = `[${testName}] 錯誤：此環境不支援 shareTargetPicker。請在 LINE App 內開啟連結！`;
            return;
          }

          liff.shareTargetPicker(payload)
            .then(res => {
              if (res) {
                diagLog.textContent = `[${testName}] 送出成功！\n回傳結果: ${JSON.stringify(res)}\n請至對應的聊天室確認是否收到訊息。`;
              } else {
                diagLog.textContent = `[${testName}] 使用者取消了發送。`;
              }
            })
            .catch(err => {
              diagLog.textContent = `[${testName}] 發送出錯！\n錯誤代碼/訊息: ${err.message || err.toString()}`;
            });
        }
      }
    })
    .catch(err => {
      console.error('LIFF 初始化失敗:', err);
      alert('LIFF 初始化失敗，請檢查您的 LIFF ID 設定是否正確。');
    });

  // 登入與登出事件
  btnLogin.addEventListener('click', () => {
    liff.login();
  });
  
  btnLogout.addEventListener('click', () => {
    liff.logout();
    window.location.reload();
  });

  // 更新預覽卡片
  function updatePreview() {
    const activeTemplate = selectTemplate.value;
    let cardTitle = '';
    let cardImage = '';
    let headerImageUrl = inputCardHeaderImage ? inputCardHeaderImage.value : '';

    if (activeTemplate === 'custom') {
      cardTitle = inputCustomTitle.value || '自訂禮物商品名稱';
      cardImage = inputCustomImage.value || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300';
    } else {
      const templateData = GIFT_TEMPLATES[activeTemplate];
      cardTitle = templateData.title;
      cardImage = templateData.image;
    }

    // 渲染預覽網頁內容
    previewHeaderImg.src = headerImageUrl || 'https://yjkai.github.io/line-prank/justforyou.png';
    previewImage.src = cardImage;
    previewTitle.textContent = cardTitle;
  }

  // 綁定表單變更監聽器，達到即時預覽效果
  inputPrankText.addEventListener('input', updatePreview);
  if (inputCardHeaderImage) {
    inputCardHeaderImage.addEventListener('input', updatePreview);
  }
  inputCustomTitle.addEventListener('input', updatePreview);
  inputCustomImage.addEventListener('input', updatePreview);
  
  selectTemplate.addEventListener('change', () => {
    if (selectTemplate.value === 'custom') {
      customGiftFields.classList.remove('hidden');
    } else {
      customGiftFields.classList.add('hidden');
      // 將預設標題與圖片載入表單 (以防用戶修改)
      const data = GIFT_TEMPLATES[selectTemplate.value];
      if (inputCardHeaderImage) {
        inputCardHeaderImage.value = data.headerImage;
      }
    }
    updatePreview();
  });

  // 惡作劇文字快速標籤點擊事件
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      inputPrankText.value = tag.getAttribute('data-text');
      updatePreview();
    });
  });

  // 初始化首次預覽
  const initialData = GIFT_TEMPLATES[selectTemplate.value];
  if (initialData && inputCardHeaderImage) {
    inputCardHeaderImage.value = initialData.headerImage;
  }
  updatePreview();

  // 處理發送禮物邏輯 (呼叫 shareTargetPicker)
  function handleSendGift() {
    if (!liff.isLoggedIn()) {
      alert('請先登入 LINE！');
      return;
    }
    const prankVal = inputPrankText.value.trim();
    if (!prankVal) {
      alert('請填寫整人文字！');
      return;
    }

    // 確認是否有權限發送好友選擇器
    if (!liff.isApiAvailable('shareTargetPicker')) {
      alert('此瀏覽器不支援 LINE 好友選擇器。請在 LINE 應用程式內打開本網頁。');
      return;
    }

    // 取得當前設定的卡片內容
    const activeTemplate = selectTemplate.value;
    let cardTitle = '';
    let cardImage = '';
    let headerImageUrl = inputCardHeaderImage ? inputCardHeaderImage.value.trim() : '';

    if (activeTemplate === 'custom') {
      cardTitle = inputCustomTitle.value.trim() || '自訂禮物商品';
      cardImage = inputCustomImage.value.trim() || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300';
    } else {
      const templateData = GIFT_TEMPLATES[activeTemplate];
      cardTitle = templateData.title;
      cardImage = templateData.image;
    }

    // 核心：編譯收禮者點擊時開啟的 LIFF 連結，並進行 URL 編碼以傳遞 prank text
    const encodedPrankText = encodeURIComponent(prankVal);
    // 我們將指向同一個 LIFF App，並帶上參數
    const targetLiffUrl = `https://liff.line.me/${LIFF_ID}?auto=yes&text=${encodedPrankText}`;

    // 建立高度逼真且符合最新規格的 LINE 官方禮物 Flex Message Payload
    const flexPayload = {
      type: 'flex',
      altText: '[LINE 禮物] 送給您一張好禮即享券！',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: headerImageUrl || 'https://yjkai.github.io/line-prank/justforyou.png',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
          action: {
            type: 'uri',
            uri: targetLiffUrl
          }
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'md',
              contents: [
                {
                  type: 'image',
                  url: cardImage,
                  size: 'md',
                  aspectRatio: '1:1',
                  aspectMode: 'cover',
                  flex: 0
                },
                {
                  type: 'text',
                  text: cardTitle,
                  weight: 'bold',
                  size: 'sm',
                  wrap: true,
                  color: '#111111',
                  gravity: 'center'
                }
              ]
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'box',
              layout: 'horizontal',
              margin: 'md',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: '驚喜活動',
                  size: 'xs',
                  color: '#888888',
                  weight: 'bold',
                  flex: 0
                },
                {
                  type: 'text',
                  text: '您收到的禮物有機會獲得活動驚喜好禮喔，快來看看吧！',
                  size: 'xs',
                  color: '#111111',
                  wrap: true
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'uri',
                label: '打開我的禮物',
                uri: targetLiffUrl
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'uri',
                label: '挑選感謝禮物',
                uri: 'https://gift.line.me'
              }
            },
            {
              type: 'button',
              style: 'link',
              height: 'sm',
              action: {
                type: 'uri',
                label: '傳送感謝小卡',
                uri: 'https://gift.line.me'
              }
            },
            {
              type: 'separator',
              margin: 'sm'
            },
            {
              type: 'box',
              layout: 'horizontal',
              margin: 'sm',
              contents: [
                {
                  type: 'image',
                  url: 'https://yjkai.github.io/line-prank/gift_icon.png',
                  size: 'xs',
                  flex: 0,
                  aspectRatio: '1:1',
                  aspectMode: 'fit'
                },
                {
                  type: 'text',
                  text: 'LINE 禮物',
                  size: 'xs',
                  color: '#888888',
                  weight: 'bold',
                  flex: 1
                },
                {
                  type: 'image',
                  url: 'https://yjkai.github.io/line-prank/chevron_icon.png',
                  size: 'xs',
                  flex: 0,
                  aspectRatio: '1:1',
                  aspectMode: 'fit'
                }
              ]
            }
          ]
        }
      }
    };

    // 呼叫 LINE Friend Picker
    liff.shareTargetPicker([flexPayload])
      .then(res => {
        if (res) {
          // 發送成功 (使用者選擇了好友並發送)
          alert('🎁 惡作劇禮物已成功送出！');
        } else {
          // 使用者取消發送
          console.log('使用者取消了發送');
        }
      })
      .catch(err => {
        console.error('發送失敗:', err);
        alert('發送失敗，請確認您已授予傳送訊息權限！');
      });
  }
}

// ==================== RECEIVER MODE (收禮者自動代發邏輯) ====================
function initReceiverMode(prankText) {
  document.getElementById('receiver-view').classList.remove('hidden');
  const statusTitle = document.getElementById('receiver-status-title');
  const statusDesc = document.getElementById('receiver-status-desc');
  const fallbackAction = document.getElementById('receiver-fallback');
  const btnManual = document.getElementById('btn-manual-trigger');

  // 初始化 LIFF (收禮者也指向同一個 LIFF)
  liff.init({ liffId: LIFF_ID })
    .then(() => {
      // 判斷收禮者是否登入，未登入則導向登入 (這會強制彈出授權 Consent 畫面)
      if (!liff.isLoggedIn()) {
        statusTitle.textContent = 'LINE 禮物身份確認中...';
        statusDesc.textContent = '首次領取禮物需透過 LINE 進行安全驗證與授權，請稍候。';
        liff.login({ redirectUri: window.location.href });
        return;
      }

      // 已登入，執行發送惡作劇訊息
      sendPrankMessageAndClose(prankText);
    })
    .catch(err => {
      console.error('收禮端初始化失敗:', err);
      showFallbackError('系統載入失敗，請確認網路連線是否正常。');
    });

  // 發送訊息並關閉視窗的核心函式
  function sendPrankMessageAndClose(text) {
    // 檢查是否是在 LINE 聊天室中打開
    const context = liff.getContext();
    if (!context || !context.type || context.type === 'none') {
      // 若是在一般瀏覽器打開，無法發送訊息到聊天室
      statusTitle.textContent = '請在 LINE 聊天室中打開';
      statusDesc.textContent = '這是一張 LINE 禮物卡片，您必須在與好友的聊天對話框中點擊「打開我的禮物」才能順利兌換領取喔！';
      return;
    }

    // 顯示禮物打開中的加載狀態
    statusTitle.textContent = '正在為您兌換禮物卡...';
    statusDesc.textContent = '正在向特約商店確認您的禮物條碼，請稍候，完成後本視窗將會自動關閉。';

    // 呼叫 liff.sendMessages 以收禮者身份代發設定好的文字
    liff.sendMessages([
      {
        type: 'text',
        text: text
      }
    ])
    .then(() => {
      console.log('整人訊息發送成功:', text);
      // 成功後立即關閉視窗
      liff.closeWindow();
    })
    .catch(err => {
      console.error('訊息發送失敗:', err);
      // 發送失敗（通常是收禮者拒絕了 chat_message.write 授權）
      showFallbackError('無法讀取禮物卡內容。請確認您已點選「同意授權」允許 LINE 禮物存取相關權限。');
      
      // 綁定手動點擊重試
      btnManual.onclick = () => {
        // 如果是登入問題，可重新引導登入
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          // 重新試圖發送
          sendPrankMessageAndClose(text);
        }
      };
    });
  }

  // 顯示失敗時的手動備用區
  function showFallbackError(message) {
    statusTitle.textContent = '禮物開啟失敗';
    statusDesc.textContent = message;
    fallbackAction.classList.remove('hidden');
  }
}
