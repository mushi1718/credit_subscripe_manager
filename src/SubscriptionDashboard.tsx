import React, { useState, useEffect } from 'react';
import { ExternalLink, CreditCard, AlertTriangle, CheckCircle, Moon, Sun, Globe } from 'lucide-react';

// --- 1. 定義多語系字典 ---
const translations = {
    zh: {
        title: '信用卡及訂閱管理中心',
        subtitle: '統整您的所有信用卡訂閱服務與試用期提醒',
        alertTitle: '注意！有 {count} 個免費試用即將到期',
        expiresOn: '到期',
        cancelAction: '去取消',
        noSub: '目前無綁定訂閱',
        trialLabel: '試用期',
        monthly: '月繳',
        irregular: '不定期',
        goToPlatform: '前往管理',
    },
    en: {
        title: 'Subscription Manager',
        subtitle: 'Manage all your credit card subscriptions and trial alerts',
        alertTitle: 'Warning! {count} free trials are expiring soon',
        expiresOn: 'Expires on',
        cancelAction: 'Cancel Now',
        noSub: 'No subscriptions linked',
        trialLabel: 'Free Trial',
        monthly: '/ mo',
        irregular: 'Irregular',
        goToPlatform: 'Manage',
    }
};

// 定義資料結構
interface Subscription {
    id: number;
    name: string;
    price: number;
    cycleKey: 'monthly' | 'irregular'; // 改用 Key 來對應翻譯
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

// 模擬資料
const mockData: UserCard[] = [
    {
        id: 1,
        bankName: '國泰世華',
        cardName: 'CUBE 卡',
        last4Digits: '8899',
        color: 'from-gray-700 to-gray-900',
        subscriptions: [
            { id: 101, name: 'Netflix', price: 390, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://www.netflix.com', icon: 'N' },
            { id: 102, name: 'Spotify', price: 149, cycleKey: 'monthly', isTrial: false, platformUrl: 'https://spotify.com', icon: 'S' },
        ]
    },
    {
        id: 2,
        bankName: '玉山銀行',
        cardName: 'U Bear 卡',
        last4Digits: '1234',
        color: 'from-purple-600 to-pink-500',
        subscriptions: [
            { id: 201, name: 'Adobe CC', price: 0, cycleKey: 'monthly', isTrial: true, trialEndDate: '2024-01-05', platformUrl: 'https://adobe.com', icon: 'A' },
            { id: 202, name: 'Shopee', price: 0, cycleKey: 'irregular', isTrial: false, platformUrl: 'https://shopee.tw', icon: 'S' },
        ]
    },
    {
        id: 3,
        bankName: '中國信託',
        cardName: 'LinePay 卡',
        last4Digits: '5678',
        color: 'from-green-500 to-teal-400',
        subscriptions: []
    }
];

export default function SubscriptionDashboard() {
    // --- 2. 狀態管理 ---
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [lang, setLang] = useState<'zh' | 'en'>('zh');

    // 取得目前的翻譯文字
    const t = translations[lang];

    // --- 3. 深色模式邏輯 ---
    // 當 theme 改變時，切換 html tag 上的 class
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

    // 篩選過期項目
    const expiringTrials = mockData.flatMap(card =>
        card.subscriptions.filter(sub => sub.isTrial && sub.trialEndDate)
    );

    return (
        // 最外層加入 dark:bg-slate-900 來控制深色背景
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 p-6">

            {/* --- Header 區域 --- */}
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{t.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">{t.subtitle}</p>
                </div>

                {/* --- 控制按鈕區 --- */}
                <div className="flex gap-3">
                    {/* 語言切換按鈕 */}
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        <span className="text-sm font-medium">{lang === 'zh' ? 'EN' : '中'}</span>
                    </button>

                    {/* 深色模式切換按鈕 */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 text-slate-600" />
                        ) : (
                            <Sun className="w-5 h-5 text-amber-400" />
                        )}
                    </button>
                </div>
            </header>

            {/* --- 警報區 --- */}
            {expiringTrials.length > 0 && (
                <section className="mb-10 animate-fade-in-up">
                    <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex items-start">
                            <AlertTriangle className="text-amber-500 w-6 h-6 mr-3 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200">
                                    {t.alertTitle.replace('{count}', expiringTrials.length.toString())}
                                </h3>
                                <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {expiringTrials.map(item => (
                                        <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded border border-amber-200 dark:border-amber-800 flex justify-between items-center shadow-sm">
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                                                <div className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">
                                                    {t.expiresOn} {item.trialEndDate}
                                                </div>
                                            </div>
                                            <a
                                                href={item.platformUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors font-medium flex items-center"
                                            >
                                                {t.cancelAction} <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- 卡片列表區 --- */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {mockData.map((card) => (
                    <div key={card.id} className="flex flex-col h-full">
                        {/* 信用卡視覺 */}
                        <div className={`relative h-48 rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${card.color} transform transition hover:-translate-y-1 duration-300 border-2 border-transparent dark:border-slate-600`}>
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-lg opacity-90">{card.bankName}</div>
                                <CreditCard className="opacity-80" />
                            </div>
                            <div className="mt-8 text-2xl font-mono tracking-wider">
                                **** **** **** {card.last4Digits}
                            </div>
                            <div className="absolute bottom-6 left-6 opacity-90 text-sm font-medium">
                                {card.cardName}
                            </div>
                        </div>

                        {/* 訂閱清單 */}
                        <div className="bg-white dark:bg-slate-800 rounded-b-xl shadow-sm border-x border-b border-slate-200 dark:border-slate-700 p-4 flex-1 -mt-2 pt-6 z-0 transition-colors">
                            {card.subscriptions.length === 0 ? (
                                <div className="text-center text-slate-400 dark:text-slate-500 py-8 text-sm">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    {t.noSub}
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {card.subscriptions.map((sub) => (
                                        <li key={sub.id} className="flex items-center justify-between group">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 mr-3 text-sm transition-colors">
                                                    {sub.icon}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 dark:text-slate-100">{sub.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {sub.isTrial ? (
                                                            <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 px-1 rounded">
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
                                                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all opacity-0 group-hover:opacity-100"
                                                title={t.goToPlatform}
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}