import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { useMaterialChecks } from '@/hooks/useMaterialChecks';
import type { CheckType } from '@/types';

const checkIcons: Record<CheckType, React.ReactNode> = {
  copies: <Copy className="w-4 h-4" />,
  version: <Layers className="w-4 h-4" />,
  duplicate: <FileText className="w-4 h-4" />,
  remark: <MessageSquare className="w-4 h-4" />,
};

const checkLabels: Record<CheckType, string> = {
  copies: '份数不足',
  version: '版本混用',
  duplicate: '资料重复',
  remark: '备注缺失',
};

export function AlertPanel() {
  const { materials, courseInfo, setFilters, clearSelection } = useMaterialStore();
  const { checkResults, hasErrors, hasWarnings } = useMaterialChecks(
    materials,
    courseInfo
  );

  const [isExpanded, setIsExpanded] = useState(true);

  const handleJumpTo = (materialIds: string[]) => {
    clearSelection();
    setFilters({ showAbnormal: true, keyword: '', stage: '', status: '', version: '' });
  };

  if (checkResults.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800">资料检查通过</h3>
            <p className="text-sm text-emerald-600">
              所有资料信息完整，准备工作一切就绪
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        hasErrors
          ? 'bg-rose-50 border-rose-200'
          : 'bg-amber-50 border-amber-200'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              hasErrors ? 'bg-rose-100' : 'bg-amber-100'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${
                hasErrors ? 'text-rose-600' : 'text-amber-600'
              }`}
            />
          </div>
          <div className="text-left">
            <h3
              className={`font-semibold ${
                hasErrors ? 'text-rose-800' : 'text-amber-800'
              }`}
            >
              资料检查发现 {checkResults.length} 项问题
            </h3>
            <p
              className={`text-sm ${
                hasErrors ? 'text-rose-600' : 'text-amber-600'
              }`}
            >
              {hasErrors
                ? '存在严重问题，请立即处理'
                : '存在一些需要注意的事项'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp
            className={`w-5 h-5 ${
              hasErrors ? 'text-rose-500' : 'text-amber-500'
            }`}
          />
        ) : (
          <ChevronDown
            className={`w-5 h-5 ${
              hasErrors ? 'text-rose-500' : 'text-amber-500'
            }`}
          />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {checkResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.severity === 'error'
                  ? 'bg-white/60 border-rose-200'
                  : 'bg-white/60 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 ${
                    result.severity === 'error'
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}
                >
                  {checkIcons[result.type]}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        result.severity === 'error'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {checkLabels[result.type]}
                    </span>
                    <span
                      className={`text-xs ${
                        result.severity === 'error'
                          ? 'text-rose-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {result.materialIds.length} 项
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      result.severity === 'error'
                        ? 'text-rose-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
                <button
                  onClick={() => handleJumpTo(result.materialIds)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                    result.severity === 'error'
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  查看
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
