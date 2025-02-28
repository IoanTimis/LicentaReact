export function objectAge(object, language) {
  if (!object?.createdAt) return language === "en" ? "Unknown" : "Necunoscut";

  const now = new Date();
  const created = new Date(object.createdAt);
  if (isNaN(created.getTime())) return language === "en" ? "Invalid date" : "Dată invalidă";

  const diff = now - created;
  const diffInMinutes = Math.floor(diff / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  const translations = {
    en: { justNow: "Just now", minute: "min", hour: "h", day: "d", month: "mo", year: "y" },
    ro: { justNow: "Chiar acum", minute: "min", hour: "h", day: "z", month: "luni", year: "ani" }
  };

  const t = translations[language] || translations["en"];

  if (diffInMinutes < 1) return t.justNow;
  if (diffInMinutes < 60) return `${diffInMinutes} ${t.minute}`;
  if (diffInHours < 24) return `${diffInHours} ${t.hour}`;
  if (diffInDays < 30) return `${diffInDays} ${t.day}`;
  if (diffInMonths < 12) return `${diffInMonths} ${t.month}`;
  return `${diffInYears} ${t.year}`;
}
