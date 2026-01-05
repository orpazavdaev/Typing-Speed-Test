# Typing Speed Test

משחק בדיקת מהירות הקלדה בנוי עם Next.js, React, TypeScript ו-Tailwind CSS.

## תכונות

- ⚡ מדידת מהירות הקלדה (WPM - Words Per Minute)
- 🎯 חישוב דיוק (Accuracy)
- ⏱️ טיימר מדויק
- 📊 סטטיסטיקות בזמן אמת
- 🎨 עיצוב מודרני ויפה עם Tailwind CSS
- 📱 רספונסיבי לכל המכשירים

## התקנה

1. התקן את התלויות:
```bash
npm install
```

2. הרץ את השרת בפיתוח:
```bash
npm run dev
```

3. פתח את הדפדפן בכתובת [http://localhost:3000](http://localhost:3000)

## שימוש

- התחל להקליד את הטקסט המוצג
- הטיימר יתחיל אוטומטית כשתתחיל להקליד
- תוכל לראות את הסטטיסטיקות שלך בזמן אמת
- לחץ על `Tab` או על כפתור "Reset Test" כדי להתחיל מחדש

## טכנולוגיות

- **Next.js 14** - Framework React
- **React 18** - ספריית UI
- **TypeScript** - טייפים
- **Tailwind CSS** - עיצוב

## מבנה הפרויקט

```
├── src/
│   ├── pages/
│   │   ├── _app.tsx      # App wrapper
│   │   └── index.tsx      # דף הבית עם המשחק
│   └── styles/
│       └── globals.css    # סגנונות גלובליים
├── next.config.js
├── tailwind.config.js
└── package.json
```

## בנייה לפרודקשן

```bash
npm run build
npm start
```
