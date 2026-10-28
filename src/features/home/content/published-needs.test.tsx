// @vitest-environment jsdom
import {afterEach,expect,it} from "vitest";
import {cleanup,render,within} from "@testing-library/react";
import BuildExactlyHome from "../components/build-exactly-home";
import {needsFixture} from "@/test/homepage-needs-fixture";
afterEach(cleanup);
it("renders published text and order with login-gated catalogue links",()=>{
 const content={...needsFixture,title:'اختيارك المنشور',cards:[needsFixture.cards[2],needsFixture.cards[0]]};
 const {container}=render(<BuildExactlyHome needsSection={content}/>);const section=container.querySelector('#needs') as HTMLElement;
 expect(within(section).getByRole('heading',{name:'اختيارك المنشور'})).toBeTruthy();
 const cards=section.querySelectorAll('div.grid > a');expect(cards).toHaveLength(2);expect(cards[0].textContent).toContain('عندي مشكلة أسرية');
 expect(cards[0].getAttribute('href')).toBe('/auth/login?redirectTo=%2Fcatalog');
});
it("uses catalogue links for sessions and hides unpublished or disabled cards",()=>{
 const {container,rerender}=render(<BuildExactlyHome hasSession needsSection={{...needsFixture,cards:[{...needsFixture.cards[0],enabled:false},needsFixture.cards[1]]}}/>);
 expect(container.querySelectorAll('#needs div.grid > a')).toHaveLength(1);expect(container.querySelector('#needs div.grid > a')?.getAttribute('href')).toBe('/catalog');
 rerender(<BuildExactlyHome needsSection={{...needsFixture,enabled:false}}/>);expect(container.querySelector('#needs')).toBeNull();
});
it("shows a retry state instead of static replacement cards on failure",()=>{
 const {container}=render(<BuildExactlyHome needsError/>);expect(container.querySelector('#needs')?.textContent).toContain('تعذر تحميل');expect(container.querySelectorAll('.landing-need-image')).toHaveLength(0);
});

it("renders administrator descriptions on photo cards as well",()=>{
 const {container}=render(<BuildExactlyHome needsSection={{...needsFixture,cards:[{...needsFixture.cards[8],description:"وصف الصورة المنشور"}]}}/>);
 expect(container.querySelector('#needs .landing-need-mosque')?.textContent).toContain("وصف الصورة المنشور");
});
