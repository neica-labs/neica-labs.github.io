export const navigation = [
  { id: "labs", label: "LABS", path: "" },
  { id: "community", label: "COMMUNITY", path: "community/" },
  { id: "contact", label: "CONTACT", path: "contact/" },
  { id: "about", label: "ABOUT", path: "about/" },
] as const;
// 확인된 실제 주소가 있을 때만 추가합니다.
export const officialLinks: {
  label: string;
  href: string;
  description?: string;
}[] = [];
