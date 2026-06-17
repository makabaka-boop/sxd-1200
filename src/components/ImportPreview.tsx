import { useState, useMemo } from 'react';
import {
  X,
  Download,
  Replace,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  Users,
  Hash,
  Layers,
} from 'lucide-react';
import type { CourseInfo, Material, ImportMode, ImportPreviewStats, CourseTemplate } from '@/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import { useMaterialStore } from '@/store/useMaterialStore';
import { calculateImportStats, formatDateTime } from '@/utils/importJson';

interface ImportPreviewProps {
  importedCourseInfo: CourseInfo;
  importedMaterials: Material[];
  importedTemplates?: CourseTemplate[];
  exportedAt: string;
  fileName: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function ImportPreview({
  importedCourseInfo,
  importedMaterials,
  importedTemplates,
  exportedAt,
  fileName,
  onClose,
  onSuccess,
}: ImportPreviewProps) {
  const { materials: currentMaterials, templates: currentTemplates, importMaterials, setTemplates } = useMaterialStore();
  const [importMode, setImportMode] = useState<ImportMode>('overwrite');
  const [importTemplates, setImportTemplates] = useState(true);

  const stats: ImportPreviewStats = useMemo(
    () => calculateImportStats(importedMaterials, currentMaterials, importMode === 'append'),
    [importedMaterials, currentMaterials, importMode]
  );

  const handleConfirm = () => {
    const result = importMaterials(importedCourseInfo, importedMaterials, importMode);

    if (importTemplates && importedTemplates && importedTemplates.length > 0) {
      if (importMode === 'overwrite') {
        setTemplates([...importedTemplates]);
      } else {
        const existingIds = new Set(currentTemplates.map((t) => t.id));
        const newTemplates = importedTemplates.filter((t) => !existingIds.has(t.id));
        if (newTemplates.length > 0) {
          setTemplates([...currentTemplates, ...newTemplates]);
        }
      }
    }

    let message = '';
    if (result.mode === 'overwrite') {
      message = `已覆盖导入 ${result.importedCount} 项资料`;
      if (importTemplates && importedTemplates && importedTemplates.length > 0) {
        message += `，${importedTemplates.length} 个模板`;
      }
    } else {
      if (result.skippedCount > 0) {
        message = `已追加导入 ${result.importedCount} 项资料，跳过 ${result.skippedCount} 项重复资料`;
      } else {
        message = `已追加导入 ${result.importedCount} 项资料`;
      }
      if (importTemplates && importedTemplates && importedTemplates.length > 0) {
        const newTplCount = importedTemplates.filter(
          (t) => !currentTemplates.some((ct) => ct.id === t.id)
        ).length;
        if (newTplCount > 0) {
          message += `，新增 ${newTplCount} 个模板`;
        }
      }
    }
    onSuccess(message);
  };

  const statusItems = [
    { key: 'pending', label: STATUS_LABELS.pending, icon: Clock, color: STATUS_COLORS.pending },
    { key: 'ready', label: STATUS_LABELS.ready, icon: CheckCircle, color: STATUS_COLORS.ready },
    { key: 'reprint', label: STATUS_LABELS.reprint, icon: AlertCircle, color: STATUS_COLORS.reprint },
    { key: 'cancelled', label: STATUS_LABELS.cancelled, icon: XCircle, color: STATUS_COLORS.cancelled },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">导入资料包预览</h3>
              <p className="text-xs text-slate-500 mt-0.5">{fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              课程信息
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  课程名称
                </div>
                <div className="font-medium text-slate-800">
                  {importedCourseInfo.name || '未设置'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  课程日期
                </div>
                <div className="font-medium text-slate-800">
                  {importedCourseInfo.date || '未设置'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  班级代号
                </div>
                <div className="font-medium text-slate-800">
                  {importedCourseInfo.classCode || '未设置'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  预计人数
                </div>
                <div className="font-medium text-slate-800">
                  {importedCourseInfo.expectedCount || 0} 人
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
              导出时间：{formatDateTime(exportedAt)}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-500" />
              资料统计
            </h4>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                <div className="text-2xl font-bold text-slate-800">{stats.materialCount}</div>
                <div className="text-xs text-slate-500 mt-1">资料总数</div>
              </div>
              {statusItems.map(({ key, label, color }) => (
                <div
                  key={key}
                  className="bg-white rounded-lg p-3 border border-slate-200 text-center"
                >
                  <div
                    className={`text-2xl font-bold ${color.split(' ')[1].replace('text-', 'text-')}`}
                  >
                    {stats.statusCounts[key]}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {importedTemplates && importedTemplates.length > 0 && (
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-violet-700 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  包含 {importedTemplates.length} 个资料包模板
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importTemplates}
                    onChange={(e) => setImportTemplates(e.target.checked)}
                    className="w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-violet-600">导入模板</span>
                </label>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {importedTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-violet-100"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-800">
                        {template.name}
                      </span>
                      {template.classType && (
                        <span className="text-xs text-slate-500 ml-2">
                          {template.classType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {template.materials.length} 项资料
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">选择导入方式</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setImportMode('overwrite')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  importMode === 'overwrite'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      importMode === 'overwrite'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Replace className="w-4 h-4" />
                  </div>
                  <span
                    className={`font-semibold ${
                      importMode === 'overwrite'
                        ? 'text-primary-700'
                        : 'text-slate-700'
                    }`}
                  >
                    覆盖当前资料包
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  将清空现有课程信息和资料，完全替换为导入的内容
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <span className="text-xs text-slate-600">
                    将导入 <strong className="text-primary-600">{stats.willBeImportedCount}</strong> 项资料
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setImportMode('append')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  importMode === 'append'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      importMode === 'append'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                  <span
                    className={`font-semibold ${
                      importMode === 'append'
                        ? 'text-primary-700'
                        : 'text-slate-700'
                    }`}
                  >
                    追加到当前资料包
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  保留现有资料，追加导入新资料，跳过重复项（按名称+版本+环节判断）
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1">
                  <div className="text-xs text-slate-600">
                    将导入 <strong className="text-emerald-600">{stats.willBeImportedCount}</strong> 项资料
                  </div>
                  {stats.duplicateCount > 0 && (
                    <div className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      跳过 {stats.duplicateCount} 项重复资料
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {importMode === 'overwrite' && currentMaterials.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-amber-800">注意</div>
                <div className="text-amber-700 mt-0.5">
                  当前资料包中已有 {currentMaterials.length} 项资料，覆盖后将全部丢失且不可恢复。
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-300"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            确认导入
          </button>
        </div>
      </div>
    </div>
  );
}
