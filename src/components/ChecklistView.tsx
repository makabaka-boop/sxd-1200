import { useMemo } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { StatusBadge } from './StatusBadge';
import { STAGES } from '@/types';

export function ChecklistView() {
  const { materials, courseInfo } = useMaterialStore();
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(STAGES)
  );

  const activeMaterials = useMemo(
    () => materials.filter((m) => m.status !== 'cancelled'),
    [materials]
  );

  const stageGroups = useMemo(() => {
    const groups: Record<string, typeof materials> = {};
    STAGES.forEach((stage) => {
      groups[stage] = [];
    });
    activeMaterials.forEach((m) => {
      if (!groups[m.stage]) {
        groups[m.stage] = [];
      }
      groups[m.stage].push(m);
    });
    return groups;
  }, [activeMaterials]);

  const stats = useMemo(() => {
    const total = activeMaterials.length;
    const ready = activeMaterials.filter((m) => m.status === 'ready').length;
    const pending = activeMaterials.filter((m) => m.status === 'pending').length;
    const reprint = activeMaterials.filter((m) => m.status === 'reprint').length;
    const totalCopies = activeMaterials.reduce(
      (sum, m) => sum + m.copies + m.spareCopies,
      0
    );
    return { total, ready, pending, reprint, totalCopies };
  }, [activeMaterials]);

  const toggleStage = (stage: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {stats.total}
              </div>
              <div className="text-sm text-slate-500">资料总数</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.ready}
              </div>
              <div className="text-sm text-slate-500">已准备</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </div>
              <div className="text-sm text-slate-500">待准备</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">
                {stats.reprint}
              </div>
              <div className="text-sm text-slate-500">需加印</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-5 h-5 text-slate-500" />
          <span className="text-sm text-slate-600">
            预计人数：
            <span className="font-medium text-slate-800">
              {courseInfo.expectedCount} 人
            </span>
          </span>
          <span className="text-slate-300">|</span>
          <Layers className="w-5 h-5 text-slate-500" />
          <span className="text-sm text-slate-600">
            总份数（含备用）：
            <span className="font-medium text-slate-800">
              {stats.totalCopies} 份
            </span>
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: stats.total > 0 ? `${(stats.ready / stats.total) * 100}%` : '0%',
            }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 text-right">
          准备进度：{stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0}%
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-600" />
          按环节核对清单
        </h3>

        {STAGES.map((stage) => {
          const stageMaterials = stageGroups[stage] || [];
          const isExpanded = expandedStages.has(stage);
          const stageReadyCount = stageMaterials.filter(
            (m) => m.status === 'ready'
          ).length;
          const stageCopies = stageMaterials.reduce(
            (sum, m) => sum + m.copies + m.spareCopies,
            0
          );

          return (
            <div
              key={stage}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => toggleStage(stage)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="font-medium text-slate-800">{stage}</span>
                  <span className="text-sm text-slate-500">
                    {stageMaterials.length} 项资料
                  </span>
                  <span className="text-sm text-slate-500">·</span>
                  <span className="text-sm text-slate-500">
                    共 {stageCopies} 份
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-600 font-medium">
                    {stageReadyCount}/{stageMaterials.length} 已准备
                  </span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width:
                          stageMaterials.length > 0
                            ? `${(stageReadyCount / stageMaterials.length) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100">
                  {stageMaterials.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      此环节暂无资料
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {stageMaterials.map((material) => (
                        <div
                          key={material.id}
                          className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              material.status === 'ready'
                                ? 'bg-emerald-500'
                                : material.status === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">
                              {material.name}
                            </div>
                            {material.remark && (
                              <div className="text-sm text-slate-500 mt-0.5">
                                {material.remark}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">
                            {material.version || '-'}
                          </div>
                          <div className="text-sm text-slate-600 text-right">
                            <div>
                              {material.copies}
                              <span className="text-slate-400 text-xs">
                                {' '}+ {material.spareCopies} 备用
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">份</div>
                          </div>
                          <StatusBadge status={material.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
