"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { BookOpen, LayoutDashboard, Bell, Users, Award, FolderOpen, ClipboardList, CalendarDays, Settings, ShieldCheck, Layers, CreditCard, ChartNoAxesCombined, ListChecks, PanelRightClose, Menu, Compass, MessageSquare, UserRound } from "lucide-react";

const learnerLinks = [
  { href: "/dashboard", label: "لوحتي", icon: LayoutDashboard },
  { href: "/my-learning", label: "تعلّمي", icon: BookOpen },
  { href: "/quizzes", label: "اختباراتي", icon: ClipboardList },
  { href: "/community", label: "المجتمع", icon: Users },
  { href: "/meetings/mine", label: "لقاءاتي", icon: CalendarDays },
  { href: "/projects", label: "مشروعاتي", icon: FolderOpen },
  { href: "/certificates", label: "شهاداتي", icon: Award },
  { href: "/achievements", label: "الإنجازات", icon: ShieldCheck },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/orders", label: "طلباتي", icon: CreditCard },
  { href: "/preview/account", label: "إعدادات المعاينة", icon: Settings },
];
const adminGroups = [
  { label: "نظرة عامة", links: [{ href: "/admin/dashboard", label: "لوحة الإدارة", icon: LayoutDashboard }, { href: "/admin/users", label: "المتعلمون والمستخدمون", icon: Users }, { href: "/admin/roles", label: "الأدوار والصلاحيات", icon: ShieldCheck }] },
  { label: "التعليم والتقييم", links: [{ href: "/admin/offerings", label: "المحتوى التعليمي", icon: BookOpen }, { href: "/admin/quizzes", label: "الاختبارات", icon: ClipboardList }, { href: "/admin/question-bank", label: "بنك الأسئلة", icon: Layers }, { href: "/admin/projects", label: "مشروعات التخرج", icon: FolderOpen }, { href: "/admin/rubrics", label: "معايير التقييم", icon: ListChecks }, { href: "/admin/certificates", label: "الشهادات", icon: Award }] },
  { label: "المجتمع والتواصل", links: [{ href: "/admin/groups", label: "المجموعات", icon: Users }, { href: "/admin/moderation", label: "مراجعة المحتوى", icon: MessageSquare }, { href: "/admin/events", label: "الفعاليات واللقاءات", icon: CalendarDays }, { href: "/admin/attendance", label: "الحضور", icon: ListChecks }, { href: "/admin/campaigns", label: "الإشعارات والحملات", icon: Bell }, { href: "/admin/gamification", label: "التحفيز والشارات", icon: Award }, { href: "/admin/distinguished", label: "الطلاب المتميزون", icon: Compass }] },
  { label: "التشغيل والتقارير", links: [{ href: "/admin/payments", label: "المدفوعات", icon: CreditCard }, { href: "/admin/coupons", label: "القسائم والعروض", icon: CreditCard }, { href: "/admin/analytics", label: "التحليلات", icon: ChartNoAxesCombined }, { href: "/admin/reports", label: "التقارير", icon: ChartNoAxesCombined }, { href: "/admin/cms", label: "محتوى الموقع", icon: Layers }, { href: "/admin/audit-log", label: "سجل التدقيق", icon: ListChecks }, { href: "/admin/settings", label: "الإعدادات", icon: Settings }] },
];

export function ExperienceWorkspace({ area, currentPath, children }: { area: "learner" | "admin"; currentPath: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = (href: string) => currentPath === href || currentPath.startsWith(`${href}/`);
  const groups = area === "admin" ? adminGroups : [{ label: "مساحتك التعليمية", links: learnerLinks }];
  return <div className={`xp-workspace xp-workspace--${area}`}>
    <div className="xp-workspace-mobile-bar"><span>{area === "admin" ? "مساحة إدارة الأكاديمية" : "رحلتك التعليمية"}</span><button className="xp-icon-button" type="button" aria-expanded={expanded} aria-controls="xp-workspace-navigation" aria-label={expanded ? "إغلاق قائمة المساحة" : "فتح قائمة المساحة"} onClick={() => setExpanded((value) => !value)}>{expanded ? <PanelRightClose size={20} /> : <Menu size={20} />}</button></div>
    <aside className={`xp-sidebar ${expanded ? "xp-sidebar--open" : ""}`} id="xp-workspace-navigation"><div className="xp-sidebar-intro"><span className="xp-icon-tile">{area === "admin" ? <ShieldCheck size={23} /> : <BookOpen size={23} />}</span><div><strong>{area === "admin" ? "مساحة الإدارة" : "مساحة المتعلم"}</strong><small>نسخة تصميم تجريبية</small></div></div><nav aria-label={area === "admin" ? "أقسام الإدارة" : "أقسام المتعلم"}>{groups.map((group) => <div className="xp-nav-group" key={group.label}><p>{group.label}</p>{group.links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setExpanded(false)}><Icon size={18} aria-hidden="true" />{label}</Link>)}</div>)}</nav><Link href="/preview" className="xp-sidebar-footer"><Compass size={17} aria-hidden="true" />جميع واجهات الموقع</Link></aside>
    <div className="xp-workspace-body">{children}</div>
    {area === "learner" ? <nav className="xp-bottom-nav" aria-label="التنقل السريع للمتعلم">{[{ href: "/dashboard", label: "لوحتي", icon: LayoutDashboard }, { href: "/my-learning", label: "تعلّمي", icon: BookOpen }, { href: "/community", label: "المجتمع", icon: Users }, { href: "/notifications", label: "الإشعارات", icon: Bell }, { href: "/preview/account", label: "حسابي", icon: UserRound }].map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined}><Icon size={20} aria-hidden="true" /><span>{label}</span></Link>)}</nav> : null}
  </div>;
}
