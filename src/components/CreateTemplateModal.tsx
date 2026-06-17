import { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';

interface CreateTemplateModalProps {
  onClose: () => void;
}

export function CreateTemplateModal({ onClose }: CreateTemplateModalProps) {
  const { materials, createTemplateFromCurrent } = useMaterialStore();
  const [name, setName] = useState('');
  const [classType, setClassType] = useState('');
  const [copiesRule, setCopiesRule] = useState('按预计人数+备用份数');
  const [remark, setRemark] = useState('');

  const activeCount = materials.filter((m) => m.status !== 'cancelled').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('请输入模板名称');
      return;
    }
    createTemplateFromCurrent(name.trim(), classType.trim(), copiesRule.trim(), remark.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                生成资料包模板
              </h3>
              <p className="text-sm text-slate-500">
                将当前课程资料保存为模板，便于后续快速套用
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              模板名称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="如：数学思维班标准资料包"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              适用班型
            </label>
            <input
              type="text"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="如：一年级基础班、三年级提高班"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              默认份数规则
            </label>
            <input
              type="text"
              value={copiesRule}
              onChange={(e) => setCopiesRule(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="描述份数计算规则"
            />
            <p className="text-xs text-slate-400 mt-1">
              例如：按预计人数+5份备用、按班级人数上浮10%等
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              备注说明
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="模板使用说明、注意事项等"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">{activeCount}</span>{' '}
              项有效资料将被保存到模板中
              <span className="text-slate-400">
                （已排除取消使用的资料）
              </span>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || activeCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            保存模板
          </button>
        </div>
      </div>
    </div>
  );
}
