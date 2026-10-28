import { beforeEach, expect, it, vi } from "vitest";
vi.mock("../server/access",()=>({requireMutationAccess:vi.fn()}));
vi.mock("@/features/home/content/api",()=>({saveNeeds:vi.fn(),publishNeeds:vi.fn()}));
vi.mock("next/cache",()=>({refresh:vi.fn(),revalidatePath:vi.fn()}));
import {requireMutationAccess} from "../server/access";
import {saveNeeds,publishNeeds} from "@/features/home/content/api";
import {refresh,revalidatePath} from "next/cache";
import {saveNeedsAction,publishNeedsAction} from "./actions";
import {ApiError} from "@/lib/api/errors";
import {needsFixture} from "@/test/homepage-needs-fixture";
const form=()=>{const f=new FormData();f.set('version','4');f.set('draft',JSON.stringify(needsFixture));return f;};
beforeEach(()=>{vi.resetAllMocks();vi.mocked(requireMutationAccess).mockResolvedValue({token:'private',user:{}} as never);});
it("reauthorizes before validating a draft and never mutates on denial",async()=>{
 vi.mocked(requireMutationAccess).mockRejectedValue(new ApiError(403,'غير مسموح',null,{}));
 expect((await saveNeedsAction({status:'idle'},form())).status).toBe('error');expect(saveNeeds).not.toHaveBeenCalled();
});
it("saves the draft through the private server boundary",async()=>{
 expect((await saveNeedsAction({status:'idle'},form())).status).toBe('success');expect(requireMutationAccess).toHaveBeenCalledWith('homepage.manage');expect(saveNeeds).toHaveBeenCalledWith('private',4,needsFixture);expect(refresh).toHaveBeenCalled();expect(revalidatePath).not.toHaveBeenCalled();
});
it("does not report success or refresh on a stale version",async()=>{
 vi.mocked(publishNeeds).mockRejectedValue(new ApiError(409,'نسخة أحدث',null,{}));
 const result=await publishNeedsAction({status:'idle'},form());expect(result.status).toBe('error');expect(refresh).not.toHaveBeenCalled();expect(revalidatePath).not.toHaveBeenCalled();
});
it("invalidates the public page only after publishing",async()=>{
 expect((await publishNeedsAction({status:'idle'},form())).status).toBe('success');expect(publishNeeds).toHaveBeenCalledWith('private',4);expect(revalidatePath).toHaveBeenCalledWith('/');
});
it("rejects broken JSON and unsafe content",async()=>{
 const f=form();f.set('draft','{');expect((await saveNeedsAction({status:'idle'},f)).status).toBe('error');f.set('draft',JSON.stringify({...needsFixture,cta_href:'//evil.test'}));expect((await saveNeedsAction({status:'idle'},f)).status).toBe('error');expect(saveNeeds).not.toHaveBeenCalled();
});
