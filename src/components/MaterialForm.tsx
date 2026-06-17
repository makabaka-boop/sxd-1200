import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Material, MaterialStatus } from '@/types';
import { STAGES, STATUS_LABELS } from '@/types';
import { useMaterialStore } from '@/store/useMaterialStore';

interface MaterialFormProps {
  material?: Material | null;
  onClose: () => void;
}

export function MaterialForm({ material, onClose }: MaterialFormProps) {
  const { addMaterial, updateMaterial } = useMaterialStore();
  const isEditing = !!material;

  const [formData, setFormData] = useState({
    name: '',
    version: '',
    copies: 0,
    spareCopies: 0,
    stage: STAGES[0],
    status: 'pending' as MaterialStatus,
    remark: '',
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        version: material.version,
        copies: material.copies,
        spareCopies: material.spareCopies,
        stage: material.stage,
        status: material.status,
        remark: material.remark,
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && material) {
      updateMaterial(material.id, formData);
    } else {
      addMaterial(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {isEditing ? '编辑资料' : '添加资料'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                资料名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入资料名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                版本
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：v1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                适用环节
              </label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                份数
              </label>
              <input
                type="number"
                min="0"
                value={formData.copies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    copies: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                备用份数
              </label>
              <input
                type="number"
                min="0"
                value={formData.spareCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    spareCopies: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                准备状态
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as MaterialStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        formData.status === status
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-primary-400'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                备注
              </label>
              <textarea
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="添加备注信息..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {isEditing ? '保存修改' : '添加资料'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
