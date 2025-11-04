let forms = [];
let reStart = 60 * 5;
let toggle = 0;
let bgCol;
let fillCol;

// --- Menu Variables ---
let menuOpen = false;
let menuWidth = 200;
let menuOptions = ["第一單元筆記", "第一單元作品", "測驗系統", "淡江大學", "回首頁"]; 
let selectedWork = 0; 

// --- Submenu Variables ---
let submenuOpen = false; 
let subMenuOptions = ["教育科技系"]; 
const SUB_MENU_START_INDEX = 3; 
const HOME_PAGE_INDEX = 4; 
let selectedSubWork = -1; 

// --- Menu Animation Variables ---
let menuX = -menuWidth; 
let menuTargetX = -menuWidth; 

// --- Emoji Variables (選單動態表情符號) ---
let currentMenuEmoji = 0; 
const menuEmojis = ["(」・ω・)ノ", "(／・ω・)／"]; 

// 【修改點 1: 更新首頁動態表情符號陣列，確保第二個表情符號對稱】
const dancingEmojis = [
    "(σ′▽‵)′▽‵)σ",
    "σ ﾟ∀ ﾟ) ﾟ∀ ﾟ)σ" // <-- 已修改
];
let currentDancingEmojiIndex = 0;
let lastEmojiChangeTime = 0;
const emojiChangeInterval = 500; // 0.5秒 = 500毫秒

// --- 連結 URL ---
const WORK1_URL = "https://hackmd.io/@TFaNVhq_RxaTjbIlxMP6ww/Bkvxtu13gg";
const WORK2_URL = "https://yhe121736-lena.github.io/20251014/";
const WORK3_URL = "https://yhe121736-lena.github.io/20251028/";
const EDU_TECH_URL = "https://www.et.tku.edu.tw/"; 

// --- IFRAME Variable ---
let iframeContainer;
// ------------------------------------------

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    
    // 設定通用無襯線字型
    textFont('Arial, sans-serif');

    // --- 創建 IFRAME 容器 (子母畫面) ---
    iframeContainer = createElement('iframe');
    iframeContainer.style('position', 'absolute');
    iframeContainer.style('border', '5px solid #FFCC00');
    iframeContainer.style('border-radius', '10px');
    iframeContainer.style('width', '80%');
    iframeContainer.style('height', '80%');
    iframeContainer.style('background-color', 'white');
    iframeContainer.style('z-index', '999');
    iframeContainer.attribute('allow', 'fullscreen');
    iframeContainer.hide();
    // ------------------------------------

    newForms();
}

function goToHomePage() {
    iframeContainer.hide();
    iframeContainer.attribute('src', '');
    newForms(); 
    toggle = 0; 
    selectedWork = HOME_PAGE_INDEX;
    selectedSubWork = -1;
}


function draw() {
    // --- 選單 Emoji 切換 (保持 1 秒切換) ---
    let periodFrame = frameCount % 60;
    if (periodFrame < 30) {
        currentMenuEmoji = 0; 
    } else {
        currentMenuEmoji = 1; 
    }

    // --- 首頁 Emoji 切換 (每 0.5 秒切換) ---
    if (millis() - lastEmojiChangeTime > emojiChangeInterval) {
        currentDancingEmojiIndex = (currentDancingEmojiIndex + 1) % dancingEmojis.length;
        lastEmojiChangeTime = millis();
    }
    // ----------------------------------------


    if (toggle == 0) {
        bgCol = color(0);
        fillCol = color(255);
    } else {
        bgCol = color(255);
        fillCol = color(0);
    }
    background(bgCol);

    for (let i = 0; i < forms.length; i++) {
        forms[i].show();
        forms[i].move();
    }

    if (frameCount % reStart == 0) {
        newForms();
        toggle = 1 - toggle;
    }
    
    // --- Menu Control and Animation (Sliding Effect) ---
    if (mouseX < 100) {
        menuOpen = true;
        menuTargetX = 0; // 滑入
    } else if (mouseX >= menuWidth + 20) {
        menuOpen = false;
        menuTargetX = -menuWidth; // 滑出
        submenuOpen = false; 
    }
    
    // Smoothly move the menu
    menuX = lerp(menuX, menuTargetX, 0.1); 
    
    // --- Draw Menu ---
    if (menuX > -menuWidth + 1) { 
        drawMenuWithSub();
        
        let optionHeight = 40;
        let menuTopY = 0;
        let tkuOptionIndex = SUB_MENU_START_INDEX; 
        
        let tkuOptionY = menuTopY + tkuOptionIndex * optionHeight;
        let tkuOptionBottomY = tkuOptionY + optionHeight;

        if (mouseX > menuX && mouseX < menuX + menuWidth && 
            mouseY > tkuOptionY && mouseY < tkuOptionBottomY) {
            submenuOpen = true;
        } else if (submenuOpen && !isMouseInSubMenu(tkuOptionY + optionHeight, optionHeight)) {
            submenuOpen = false;
        }
    } else {
        submenuOpen = false; 
    }

    // --- 更新 IFRAME 位置 (維持在畫布中央) ---
    iframeContainer.position(width * 0.1, height * 0.1);
    
    // 顯示首頁文字
    if (iframeContainer.elt.style.display === 'none') {
        displayHomePageInfo();
    }
}

function displayHomePageInfo() {
    push(); 
    
    textAlign(CENTER, CENTER);
    fill(fillCol); 

    let centerX = width / 2;
    let startY = height / 2 + 50; 
    let lineSpacing = 30;

    // 第一行
    textSize(20);
    text("淡江大學教育科技系", centerX, startY);
    
    // 第二行
    textSize(20);
    text("414730191何鈺淇", centerX, startY + lineSpacing);
    
    // 第三行 (動態表情符號)
    textSize(36); 
    let currentDancingText = dancingEmojis[currentDancingEmojiIndex];
    text(currentDancingText, centerX, startY + lineSpacing * 2.2);

    pop(); 
}


function isMouseInSubMenu(subMenuStartY, optionHeight) {
    if (!submenuOpen) return false;
    let subMenuHeight = subMenuOptions.length * optionHeight;
    let subMenuEndY = subMenuStartY + subMenuHeight;

    return (mouseX > menuX && mouseX < menuX + menuWidth && 
            mouseY > subMenuStartY && mouseY < subMenuEndY);
}

function drawMenuWithSub() {
    let menuY = 0;
    let optionHeight = 40;
    let padding = 10;
    let textX = menuX + padding;
    
    fill(0, 0, 0, 200);
    rectMode(CORNER);
    rect(menuX, menuY, menuWidth, height);
    rectMode(CENTER);

    textSize(16); // 選單文字較小
    textAlign(LEFT, CENTER);
    
    let textY = menuY + padding + optionHeight / 2 + 5;
    let currentY = menuY;

    // 1. 繪製主選單選項
    for (let i = 0; i < menuOptions.length; i++) {
        let optionY = currentY;
        
        if (mouseX > menuX && mouseX < menuX + menuWidth && mouseY > optionY && mouseY < optionY + optionHeight) {
            fill(50, 50, 50); 
            rectMode(CORNER);
            rect(menuX, optionY, menuWidth, optionHeight);
            rectMode(CENTER);
        }
        
        if (i === selectedWork && (!submenuOpen || i !== SUB_MENU_START_INDEX)) { 
            fill(255, 255, 0); 
        } else if (i === SUB_MENU_START_INDEX && submenuOpen) {
            fill(255, 255, 0); 
        } else {
            fill(255); 
        }
        
        text(menuOptions[i], textX, textY);
        
        currentY += optionHeight; 
        textY += optionHeight;

        // 2. 繪製子選單 
        if (i === SUB_MENU_START_INDEX && submenuOpen) {
            drawSubMenu(currentY, optionHeight);
            currentY += subMenuOptions.length * optionHeight; 
            textY += subMenuOptions.length * optionHeight;
        }
    }
    
    // 3. 繪製 Dynamic Emoji 
    let displayEmoji = menuEmojis[currentMenuEmoji]; // 使用選單專用表情

    let emojiY = currentY + 50; 
    
    textSize(24); 
    textAlign(CENTER, CENTER);
    fill(255); 

    text(displayEmoji, menuX + menuWidth / 2, emojiY);
    
    textAlign(LEFT, CENTER);
}

function drawSubMenu(startY, optionHeight) {
    let padding = 15;
    let textX = menuX + padding + 15; 

    for (let i = 0; i < subMenuOptions.length; i++) {
        let optionY = startY + i * optionHeight;
        let textY = startY + i * optionHeight + optionHeight / 2 + 5;

        if (mouseX > menuX && mouseX < menuX + menuWidth && mouseY > optionY && mouseY < optionY + optionHeight) {
            fill(100, 100, 100); 
            rectMode(CORNER);
            rect(menuX, optionY, menuWidth, optionHeight);
            rectMode(CENTER);
        }

        if (i === selectedSubWork) {
            fill(0, 255, 255); 
        } else {
            fill(200); 
        }
        
        text(subMenuOptions[i], textX, textY);
    }
}

function mousePressed() {
    if (menuOpen && mouseX > menuX && mouseX < menuX + menuWidth) {
        let optionHeight = 40;
        let menuTopY = 0;
        let clicked = false;

        for (let i = 0; i < menuOptions.length; i++) {
            let optionY = menuTopY;
            let optionBottomY = menuTopY + optionHeight;
            
            if (mouseY > optionY && mouseY < optionBottomY) {
                
                selectedWork = i;
                selectedSubWork = -1; 
                let url = '';
                
                if (i === HOME_PAGE_INDEX) { 
                    goToHomePage();
                } 
                else if (i === SUB_MENU_START_INDEX) { 
                    iframeContainer.hide();
                    iframeContainer.attribute('src', '');
                } else { 
                    submenuOpen = false; 
                    
                    if (selectedWork === 0) { 
                        url = WORK1_URL;
                    } else if (selectedWork === 1) { 
                        url = WORK2_URL;
                    } else if (selectedWork === 2) { 
                        url = WORK3_URL;
                    }

                    if (url) {
                        iframeContainer.attribute('src', url);
                        iframeContainer.show();
                    } else {
                        iframeContainer.hide();
                        iframeContainer.attribute('src', '');
                    }
                }
                
                clicked = true;
                break; 
            }
            
            menuTopY += optionHeight;
            
            if (i === SUB_MENU_START_INDEX && submenuOpen) {
                for (let j = 0; j < subMenuOptions.length; j++) {
                    let subOptionY = menuTopY + j * optionHeight;
                    let subOptionBottomY = menuTopY + (j + 1) * optionHeight;

                    if (mouseY > subOptionY && mouseY < subOptionBottomY) {
                        selectedSubWork = j;
                        selectedWork = SUB_MENU_START_INDEX; 
                        
                        iframeContainer.attribute('src', EDU_TECH_URL);
                        iframeContainer.show();
                        
                        clicked = true;
                        break;
                    }
                }
                menuTopY += subMenuOptions.length * optionHeight; 
                if (clicked) break; 
            }
        }
        
        if (clicked) {
            newForms(); 
            toggle = 0; 
            menuOpen = false;
            menuTargetX = -menuWidth;
            submenuOpen = false; 
        }
    } 
    else {
        if (iframeContainer.elt.style.display !== 'none') {
            goToHomePage(); 
        }
        
        menuOpen = false;
        menuTargetX = -menuWidth;
        submenuOpen = false;
    }
}


// --- Form Generation Functions & Form Class (保持不變) ---
function tile() {
    let wc = int(random(1, 10));
    let hc = int(random(1, 10));
    let w = width / wc;
    let h = height / hc;

    for (let j = 0; j < hc; j++) {
        for (let i = 0; i < wc; i++) {
            forms.push(new Form(i * w + w / 2, j * h + h / 2, w + 1, h + 1));
        }
    }
}

function newForms() {
    forms.length = 0;
    tile();
}

class Form {
    constructor(x, y, w, h) {
        this.tgtx = x;
        this.tgty = y;
        this.tgtw = w;
        this.tgth = h;
        this.sttx = random(width);
        this.stty = random(height);
        this.sttw = 0;
        this.stth = 0;
        this.px = 0;
        this.py = 0;
        this.pw = 0;
        this.ph = 0;
        this.t = -int(random(50, 150));
        this.endt = 100;
        this.tStep = 1;
    }

    show() {
        noStroke();
        fill(fillCol);
        rect(this.px, this.py, this.pw, this.ph);
    }

    move() {
        let mp = map(this.t, 0, this.endt, 0, 1);
        let easing = mp * 2 - sq(mp);
        
        if (mp > 1) {
            easing = 1;
        }

        if (this.t > 0) {
            this.px = lerp(this.sttx, this.tgtx, easing);
            this.py = lerp(this.stty, this.tgty, easing);
            this.pw = lerp(this.sttw, this.tgtw, easing);
            this.ph = lerp(this.stth, this.tgth, easing);
        } else {
            this.px = this.sttx;
            this.py = this.stty;
            this.pw = this.sttw;
            this.ph = this.stth;
        }

        if (this.t < this.endt) {
            this.t += this.tStep;
        }
    }
}