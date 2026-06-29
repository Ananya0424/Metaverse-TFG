export function ModuleListSkeleton() {
  return (
    <div className="flex bg-white border border-slate-100 rounded-sm overflow-hidden mb-[-1px] relative animate-pulse h-[160px]">
      <div className="w-[280px] shrink-0 bg-slate-200 h-full"></div>
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="w-[200px] shrink-0 flex items-center justify-center border-l border-slate-100 px-6">
        <div className="w-full h-10 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}
