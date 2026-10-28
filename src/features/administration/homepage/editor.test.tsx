// @vitest-environment jsdom
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
import{afterEach,expect,it,vi}from'vitest';import{act,cleanup,fireEvent,render,screen,waitFor,within}from'@testing-library/react';
vi.mock('./actions',()=>({saveNeedsAction:vi.fn(),publishNeedsAction:vi.fn()}));
import{publishNeedsAction}from'./actions';
import{HomepageNeedsEditor}from'./editor';import{needsFixture}from'@/test/homepage-needs-fixture';
afterEach(cleanup);
it('requires saving after edits and reorders the draft without publishing',()=>{
 const {container}=render(<HomepageNeedsEditor record={{draft:needsFixture,version:1,published_at:null}}/>);
 expect(screen.getByRole('heading',{name:'نشر القسم'})).toBeTruthy();
 fireEvent.change(screen.getByLabelText('عنوان القسم'),{target:{value:'تعديل جديد'}});expect(screen.queryByRole('heading',{name:'نشر القسم'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'تقديم البطاقة 2'}));
 const hidden=container.querySelector('input[name=draft]') as HTMLInputElement;const draft=JSON.parse(hidden.value);expect(draft.title).toBe('تعديل جديد');expect(draft.cards[0].id).toBe('student');
 fireEvent.click(screen.getByRole('button',{name:'إضافة بطاقة'}));expect(JSON.parse(hidden.value).cards).toHaveLength(10);
});

it('locks draft controls while publication is pending',async()=>{
 Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute('open','');}});
 Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute('open');}});
 let release:((state:import('@/lib/forms').FormState)=>void)|undefined;
 vi.mocked(publishNeedsAction).mockImplementation(()=>new Promise(resolve=>{release=resolve;}));
 render(<HomepageNeedsEditor record={{draft:needsFixture,version:1,published_at:null}}/>);
 fireEvent.click(screen.getByRole('button',{name:'نشر القسم'}));
 fireEvent.click(within(screen.getByRole('dialog',{name:'نشر القسم'})).getByRole('button',{name:'نشر القسم'}));
 await waitFor(()=>expect((screen.getByLabelText('عنوان القسم') as HTMLInputElement).matches(':disabled')).toBe(true));
 expect((screen.getByRole('button',{name:'حفظ المسودة'}) as HTMLButtonElement).disabled).toBe(true);
 await act(async()=>{release?.({status:'success',message:'نُشر القسم'});});
 await waitFor(()=>expect((screen.getByLabelText('عنوان القسم') as HTMLInputElement).matches(':disabled')).toBe(false));
 vi.restoreAllMocks();
});
