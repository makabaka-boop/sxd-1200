import { Edit2, Trash2, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { useFilteredMaterials } from '@/hooks/useFilteredMaterials';
import { useMaterialChecks } from '@/hooks/useMaterialChecks';
import { StatusBadge } from './StatusBadge';
import type { Material } from '@/types';

interface MaterialTableProps {
  onEdit: (material: Material) => void;
}

export function MaterialTable({ onEdit }: MaterialTableProps) {
  const {
    materials,
    courseInfo,
    selectedIds,
    highlightedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    updateMaterial,
    deleteMaterial,
    filters,
  } = useMaterialStore();

  const { abnormalMaterialIds, getIdsByCheckType } = useMaterialChecks(materials, courseInfo);
  const filtered = useFilteredMaterials(materials, filters, abnormalMaterialIds, getIdsByCheckType);

  const allSelected =
    filtered.length > 0 && filtered.every((m) => selectedIds.includes(m.id));

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(filtered.map((m) => m.id));
    }
  };

  const handleCopiesChange = (id: string, delta: number) => {
    const material = materials.find((m) => m.id === id);
    if (material) {
      updateMaterial(id, {
        copies: Math.max(0, material.copies + delta),
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                资料名称
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                版本
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                适用环节
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                份数
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                备用
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                状态
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                备注
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  暂无资料数据
                </td>
              </tr>
            ) : (
              filtered.map((material) => {
                const isAbnormal = abnormalMaterialIds.has(material.id);
                const isHighlighted = highlightedIds.includes(material.id);
                return (
                  <tr
                    key={material.id}
                    data-material-id={material.id}
                    className={`hover:bg-slate-50 transition-all duration-300 ${
                      material.status === 'cancelled' ? 'opacity-50' : ''
                    } ${isAbnormal ? 'bg-amber-50/30' : ''} ${
                      isHighlighted
                        ? 'bg-primary-100/80 ring-2 ring-primary-400 ring-inset'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(material.id)}
                        onChange={() => toggleSelect(material.id)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">
                          {material.name}
                        </span>
                        {isAbnormal && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {material.version || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {material.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleCopiesChange(material.id, -1)}
                          className="w-6 h-6 rounded border border-slate-300 text-slate-500 hover:bg-slate-100 flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-slate-800">
                          {material.copies}
                        </span>
                        <button
                          onClick={() => handleCopiesChange(material.id, 1)}
                          className="w-6 h-6 rounded border border-slate-300 text-slate-500 hover:bg-slate-100 flex items-center justify-center"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {material.spareCopies}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={material.status} />
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-sm text-slate-500 truncate block">
                        {material.remark || (
                          <span className="text-slate-300">-</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(material)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMaterial(material.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
        共 {filtered.length} 项资料
        {selectedIds.length > 0 && (
          <span className="ml-3 text-primary-600">
            已选择 {selectedIds.length} 项
          </span>
        )}
      </div>
    </div>
  );
}
