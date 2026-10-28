import { imageKeys, type NeedsSection } from "@/features/home/content/schema";
export const needsFixture: NeedsSection = {
  enabled:true,title:"ماذا تحتاج الآن ؟",subtitle:"اختر ما يناسب حالتك",cta_label:"عرض جميع التصنيفات",cta_href:"/catalog",
  cards:imageKeys.map((key,index)=>({id:key,image_key:key,title:["أريد أن أتعلم ديني","أنا طالب / شاب","عندي مشكلة أسرية","أعاني من الفتور","أريد أفهم القرآن","أريد أن أنتظم في الصلاة","أريد أن أتوب","أريد أن أقترب من الله","اكتشف المزيد"][index],description:"وصف توضيحي",href:"/catalog",enabled:true,style:key==='mosque'?'photo':'icon'})),
};
