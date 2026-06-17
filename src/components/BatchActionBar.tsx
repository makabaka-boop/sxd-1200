import { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Upload,
  Check,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle,
  FileJson,
} from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { exportToJson } from '@/utils/exportJson';
import { STATUS_LABELS } from '@/types';
import type { MaterialStatus } from '@/types';

interface BatchActionBarProps {
  onAdd: () => void;
}

export function BatchActionBar({ onAdd }: BatchActionBarProps) {
  const {
    selectedIds,
    materials,
    courseInfo,
    previousCourseMaterials,
    batchUpdateStatus,
    batchAdjustCopies,
    batchDelete,
    copyFromPrevious,
    saveAsPrevious,
    clearSelection,
  } = useMaterialStore();

  const [showCopiesInput, setShowCopiesInput] = useState(false);
  const [copiesDelta, setCopiesDelta] = useState(1);

  const hasSelection = selectedIds.length > 0;
  const hasPrevious = previousCourseMaterials.length > 0;

  const handleBatchStatus = (status: MaterialStatus) => {
    batchUpdateStatus(selectedIds, status);
    clearSelection();
  };

  const handleBatchCopies = () => {
    batchAdjustCopies(selectedIds, copiesDelta);
    setShowCopiesInput(false);
    clearSelection();
  };

  const handleBatchDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedIds.length} 项资料吗？`)) {
      batchDelete(selectedIds);
    }
  };

  const handleExport = () => {
    exportToJson(courseInfo, materials);
  };

  const handleSaveAsPrevious = () => {
    saveAsPrevious();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          添加资料
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-500 mr-1">
            {hasSelection
              ? `已选 ${selectedIds.length} 项`
              : '选择资料后可批量操作'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBatchStatus('ready')}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
          >
            <Check className="w-4 h-4" />
            标记已准备
          </button>
          <button
            onClick={() => handleBatchStatus('pending')}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
          >
            <Clock className="w-4 h-4" />
            标记待准备
          </button>
          <button
            onClick={() => handleBatchStatus('reprint')}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
          >
            <RefreshCw className="w-4 h-4" />
            标记需加印
          </button>
          <button
            onClick={() => handleBatchStatus('cancelled')}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <XCircle className="w-4 h-4" />
            取消使用
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          {showCopiesInput ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={copiesDelta}
                onChange={(e) =>
                  setCopiesDelta(parseInt(e.target.value) || 0)
                }
                className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
              />
              <span className="text-sm text-slate-500">份</span>
              <button
                onClick={handleBatchCopies}
                disabled={!hasSelection}
                className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
              >
                确认
              </button>
              <button
                onClick={() => setShowCopiesInput(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCopiesInput(true)}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <Upload className="w-4 h-4" />
              批量调份数
            </button>
          )}
        </div>

        <button
          onClick={handleBatchDelete}
          disabled={!hasSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={handleSaveAsPrevious}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <Copy className="w-4 h-4" />
            存为上一场
          </button>
          <button
            onClick={copyFromPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-300 text-primary-600 hover:bg-primary-50 hover:border-primary-300"
            title={
              hasPrevious ? '复制上一场课程的资料' : '暂无上一场课程资料'
            }
          >
            <AlertCircle className="w-4 h-4" />
            复制上一场
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
        >
          <FileJson className="w-4 h-4" />
          导出 JSON
        </button>
      </div>
    </div>
  );
}
