export const navigation = [
  { id: "home", label: "HOME", path: "" },
  { id: "about", label: "ABOUT", path: "about/" },
  { id: "labs", label: "LABS", path: "labs/" },
  { id: "community", label: "COMMUNITY", path: "community/" },
  { id: "link", label: "LINK", path: "link/" },
] as const;
// 확인된 실제 주소가 있을 때만 추가합니다.
export const officialLinks: {
  label: string;
  href: string;
  description?: string;
}[] = [];
