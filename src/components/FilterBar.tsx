import { Search, Filter, AlertTriangle } from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { STAGES, STATUS_LABELS } from '@/types';
import type { MaterialStatus } from '@/types';
import { useMaterialChecks } from '@/hooks/useMaterialChecks';

export function FilterBar() {
  const { filters, setFilters, materials, courseInfo } = useMaterialStore();
  const { abnormalMaterialIds } = useMaterialChecks(materials, courseInfo);

  const versions = Array.from(new Set(materials.map((m) => m.version))).filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">筛选：</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索资料名称/备注"
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.stage}
          onChange={(e) => setFilters({ stage: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
        >
          <option value="">全部环节</option>
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
        >
          <option value="">全部状态</option>
          {(Object.keys(STATUS_LABELS) as MaterialStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          value={filters.version}
          onChange={(e) => setFilters({ version: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          disabled={versions.length === 0}
        >
          <option value="">全部版本</option>
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilters({ showAbnormal: !filters.showAbnormal })}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.showAbnormal
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-amber-400 hover:text-amber-600'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          仅显示异常
          {filters.showAbnormal && (
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {abnormalMaterialIds.size}
            </span>
          )}
        </button>

        {(filters.keyword || filters.stage || filters.status || filters.version || filters.showAbnormal) && (
          <button
            onClick={() =>
              setFilters({
                keyword: '',
                stage: '',
                status: '',
                version: '',
                showAbnormal: false,
              })
            }
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
