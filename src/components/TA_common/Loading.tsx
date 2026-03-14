export const Loading = () => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Vòng tròn loading */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

        {/* Tiêu đề */}
        <p className="text-base font-medium text-slate-700">
          Loading, please wait...
        </p>

        {/* Subtext (tuỳ chọn) */}
        <p className="text-xs text-slate-400">
          The system is processing your request.
        </p>
      </div>
    </div>
  );
};
