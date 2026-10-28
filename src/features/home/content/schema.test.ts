import { expect, it } from "vitest";
import { safeCatalogLink, needsSectionSchema } from "./schema";
import { needsFixture } from "@/test/homepage-needs-fixture";
it.each(["https://evil.test","//evil.test","/catalog/../admin","/catalog?x=%0a","/catalog?x=%5cevil","/catalog?x=%25250a","/admin/users","javascript:alert(1)","/catalog?q=%FF","/catalog?q=%C0%AF","/catalog?q=%ED%A0%80"])("rejects unsafe destination %s",href=>expect(safeCatalogLink(href)).toBe(false));
it.each(["/catalog","/tracks/example","/courses?kind=course","/catalog?q=%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86"])("accepts catalog destination %s",href=>expect(safeCatalogLink(href)).toBe(true));
it("rejects unknown imagery, duplicate cards and extra settings",()=>{
  expect(needsSectionSchema.safeParse({...needsFixture,cards:[needsFixture.cards[0],needsFixture.cards[0]]}).success).toBe(false);
  expect(needsSectionSchema.safeParse({...needsFixture,cards:[{...needsFixture.cards[0],image_key:"external"}]}).success).toBe(false);
  expect(needsSectionSchema.safeParse({...needsFixture,extra:true}).success).toBe(false);
});
