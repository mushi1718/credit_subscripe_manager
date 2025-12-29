import React, { useState, useEffect } from 'react';
import { ExternalLink, CreditCard, AlertTriangle, CheckCircle, Moon, Sun, Globe, ChevronRight } from 'lucide-react';

// --- 1. 定義多語系 (保持不變) ---
const translations = {
    zh: {
        title: '信用卡及訂閱管理中心',
        subtitle: '統整您的所有信用卡訂閱服務與試用期提醒',
        alertTitle: '注意！有 {count} 個免費試用即將到期',
        expiresOn: '到期',
        cancelAction: '去取消',
        noSub: '此卡片目前無綁定訂閱',
        trialLabel: '試用期',
        monthly: '月繳',
        irregular: '不定期',
        goToPlatform: '前往管理',
        totalExpenses: '此卡預估開銷',
        selectCardHint: '⟵ 左右滑動以選擇卡片 ⟶',
    },
    en: {
        title: 'Subscription Manager',
        subtitle: 'Manage all your credit card subscriptions and trial alerts',
        alertTitle: 'Warning! {count} free trials are expiring soon',
        expiresOn: 'Expires on',
        cancelAction: 'Cancel Now',
        noSub: 'No subscriptions linked to this card',
        trialLabel: 'Free Trial',
        monthly: '/ mo',
        irregular: 'Irregular',
        goToPlatform: 'Manage',
        totalExpenses: 'Est. Expenses',
        selectCardHint: '⟵ Swipe left or right to select card ⟶',
    }
};

// --- 2. 定義介面 ---
interface Subscription {
    id: number;
    name: string;
    price: number;
    cycleKey: 'monthly' | 'irregular';
    isTrial: boolean;
    trialEndDate?: string;
    platformUrl: string;
    icon: string;
}

interface UserCard {
    id: number;
    bankName: string;
    cardName: string;
    last4Digits: string;
    color: string;
    subscriptions: Subscription[];
}

// --- 3. 擴充後的模擬資料 (7張卡片) ---
const mockData: UserCard[] = [
    {
        id: 1,
        bankName: '國泰世華',
        cardName: 'CUBE 卡',
        last4Digits: '8899',
        color: 'from-slate-700 to-slate-900', // 灰黑質感
        subscriptions: [
            { id: 101, name: 'Netflix', price: 390, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://www.netflix.com', icon: 'N' },
            { id: 102, name: 'Spotify', price: 149, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://spotify.com', icon: 'S' },
            { id: 103, name: 'Youtube Prem', price: 199, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://youtube.com', icon: 'Y' },
        ]
    },
    {
        id: 2,
        bankName: '玉山銀行',
        cardName: 'U Bear 卡',
        last4Digits: '1234',
        color: 'from-purple-600 to-pink-500', // 紫粉漸層
        subscriptions: [
            { id: 201, name: 'Adobe CC', price: 0, cycleKey: 'monthly', isTrial: true, trialEndDate: '2024-02-05', platformUrl: 'https://adobe.com', icon: 'A' },
            { id: 202, name: 'Shopee', price: 0, cycleKey: 'irregular', isTrial: false, platformUrl: 'https://shopee.tw', icon: 'S' },
        ]
    },
    {
        id: 3,
        bankName: '中國信託',
        cardName: 'LinePay 卡',
        last4Digits: '5678',
        color: 'from-emerald-500 to-teal-400', // 經典綠色
        subscriptions: []
    },
    {
        id: 4,
        bankName: '台北富邦',
        cardName: 'Costco 聯名卡',
        last4Digits: '9012',
        color: 'from-blue-600 to-cyan-500', // 藍青漸層
        subscriptions: [
            { id: 401, name: 'Costco 會費', price: 1350, cycleKey: 'irregular', isTrial: false, platformUrl: 'https://costco.com.tw', icon: 'C' },
            { id: 402, name: 'Uber Eats', price: 120, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://ubereats.com', icon: 'U' },
        ]
    },
    {
        id: 5,
        bankName: '台新銀行',
        cardName: 'GoGo 卡',
        last4Digits: '3344',
        color: 'from-rose-500 to-orange-400', // 紅橘漸層 (Richart風格)
        subscriptions: [
            { id: 501, name: 'ChatGPT Plus', price: 600, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://openai.com', icon: 'G' },
            { id: 502, name: 'Disney+', price: 270, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://disneyplus.com', icon: 'D' },
        ]
    },
    {
        id: 6,
        bankName: '匯豐銀行',
        cardName: '匯鑽卡',
        last4Digits: '7788',
        color: 'from-red-700 to-red-900', // 深紅質感
        subscriptions: [
            { id: 601, name: 'Dropbox', price: 0, cycleKey: 'monthly', isTrial: true, trialEndDate: '2024-01-20', platformUrl: 'https://dropbox.com', icon: 'D' },
        ]
    },
    {
        id: 7,
        bankName: '永豐銀行',
        cardName: '大戶 DAWHO',
        last4Digits: '1122',
        color: 'from-yellow-500 to-amber-600', // 金黃質感
        subscriptions: [
            { id: 701, name: 'Microsoft 365', price: 320, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://office.com', icon: 'M' },
            { id: 702, name: 'Foodpanda', price: 0, cycleKey: 'irregular', isTrial: false, platformUrl: 'https://foodpanda.tw', icon: 'F' },
        ]
    }
];

export default function SubscriptionDashboard() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [lang, setLang] = useState<'zh' | 'en'>('zh');
    const [activeCardId, setActiveCardId] = useState<number>(mockData[0].id);

    const t = translations[lang];

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

    const expiringTrials = mockData.flatMap(card =>
        card.subscriptions.filter(sub => sub.isTrial && sub.trialEndDate)
    );

    // 取得當前選中的卡片
    const activeCard = mockData.find(c => c.id === activeCardId) || mockData[0];

    // 計算當前卡片月開銷
    const activeCardTotal = activeCard.subscriptions
        .filter(s => s.cycleKey === 'monthly' && !s.isTrial)
        .reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 p-6">

            {/* Header */}
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{t.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">{t.subtitle}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        <span className="text-sm font-medium">{lang === 'zh' ? 'EN' : '中'}</span>
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                        {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
                    </button>
                </div>
            </header>

            {/* 試用期警報 */}
            {expiringTrials.length > 0 && (
                <section className="mb-10 animate-fade-in-up">
                    <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex items-start">
                            <AlertTriangle className="text-amber-500 w-6 h-6 mr-3 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200">
                                    {t.alertTitle.replace('{count}', expiringTrials.length.toString())}
                                </h3>
                                {/* 這裡簡單列出即將到期的項目名稱 */}
                                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300/80">
                                    {expiringTrials.map(e => e.name).join(', ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 卡片選單 (Master) - 橫向捲動區 */}
            <section className="mb-8">
                <div className="relative">
                    {/* 修改重點 1：
                   在 container 加上 'px-4' 或 'px-6' 讓第一張卡片左邊留白
                */}
                    <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar px-4 md:px-2">
                        {mockData.map((card) => {
                            const isActive = card.id === activeCardId;
                            return (
                                <div
                                    key={card.id}
                                    onClick={() => setActiveCardId(card.id)}
                                    /* 修改重點 2 (關鍵)：
                                       將原本固定的 w-80 改為 RWD 設定：
                                       'w-[85vw]' : 手機版強制寬度為螢幕的 85%，這樣右邊就會露出 15% 的下一張卡片
                                       'md:w-80'  : 電腦版維持原本的 320px
                                    */
                                    className={`
                                    relative flex-shrink-0 
                                    w-[85vw] md:w-80 h-48 
                                    rounded-2xl p-6 text-white shadow-lg cursor-pointer snap-center
                                    transform transition-all duration-300 border-2
                                    bg-gradient-to-br ${card.color}
                                    ${isActive
                                            ? 'scale-100 md:scale-105 border-white/50 translate-y-0 shadow-xl z-10'
                                            : 'border-transparent opacity-80 md:opacity-60 hover:opacity-100 scale-95 grayscale-[0.3]'
                                        }
                                `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-lg opacity-90">{card.bankName}</div>
                                        {isActive && <CheckCircle className="w-6 h-6 text-white drop-shadow-md" />}
                                        {!isActive && <CreditCard className="opacity-80" />}
                                    </div>
                                    <div className="mt-8 text-2xl font-mono tracking-wider shadow-black/10 drop-shadow-md">
                                        **** {card.last4Digits}
                                    </div>
                                    <div className="absolute bottom-6 left-6 opacity-90 text-sm font-medium">
                                        {card.cardName}
                                    </div>

                                    <div className="absolute bottom-6 right-6 bg-black/20 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">
                                        {card.subscriptions.length} Subs
                                    </div>
                                </div>
                            );
                        })}

                        {/* 墊片：確保最後一張也能滑到中間 */}
                        <div className="w-2 shrink-0"></div>
                    </div>
                </div>

                {/* 修改重點 3：新增分頁小圓點 (Dots Indicator) */}
                {/* 這在手機版是非常強烈的視覺暗示，告訴用戶「這裡有好幾頁」 */}
                <div className="flex justify-center items-center gap-2 mt-2">
                    {mockData.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => setActiveCardId(card.id)} // 點圓點也可以切換
                            className={`
                            h-2 rounded-full transition-all duration-300 
                            ${activeCardId === card.id
                                    ? 'w-6 bg-blue-500 dark:bg-blue-400'  // 選中時變長條
                                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400' // 沒選中是小圓點
                                }
                        `}
                            aria-label={`Switch to ${card.cardName}`}
                        />
                    ))}
                </div>

                <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 md:hidden">
                    {t.selectCardHint}
                </div>
            </section>

            {/* 詳細內容 (Detail) */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-all duration-500 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {activeCard.bankName} {activeCard.cardName}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
                            卡號末四碼: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 rounded text-slate-700 dark:text-slate-300">{activeCard.last4Digits}</span>
                        </p>
                    </div>

                    {activeCardTotal > 0 && (
                        <div className="mt-4 md:mt-0 bg-blue-50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-600 px-5 py-3 rounded-xl">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider">{t.totalExpenses}</span>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">${activeCardTotal} <span className="text-sm font-normal text-slate-500">/ {t.monthly.replace('/ ', '')}</span></span>
                        </div>
                    )}
                </div>

                {activeCard.subscriptions.length === 0 ? (
                    <div className="text-center text-slate-400 dark:text-slate-500 py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-lg">{t.noSub}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeCard.subscriptions.map((sub) => (
                            <div key={sub.id} className="group relative bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md hover:-translate-y-0.5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div className={`
                                            w-12 h-12 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-white
                                            ${sub.name.includes('Netflix') ? 'bg-red-600' :
                                                sub.name.includes('Spotify') ? 'bg-green-500' :
                                                    sub.name.includes('Youtube') ? 'bg-red-500' :
                                                        sub.name.includes('Disney') ? 'bg-blue-600' :
                                                            'bg-slate-400 dark:bg-slate-600'}
                                        `}>
                                            {sub.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{sub.name}</h3>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                {sub.isTrial ? (
                                                    <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                                        {t.trialLabel}
                                                    </span>
                                                ) : (
                                                    <span>${sub.price} {sub.cycleKey === 'monthly' ? t.monthly : t.irregular}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={sub.platformUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        title={t.goToPlatform}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>

                                {sub.isTrial && sub.trialEndDate && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center text-xs">
                                        <span className="text-red-500 font-medium flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {t.expiresOn} {sub.trialEndDate}
                                        </span>
                                        <span className="text-slate-400">
                                            續訂: ${sub.price}/月
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}