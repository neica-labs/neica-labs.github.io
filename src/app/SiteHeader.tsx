import { navigation } from "./siteConfig";
import { siteUrl } from "../lib/urls";
export default function SiteHeader({ page }: { page: string }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href={siteUrl()} aria-label="NEICA 홈">
          NEICA
        </a>
        <nav aria-label="주 메뉴">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={"href" in item ? item.href : siteUrl(item.path)}
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
