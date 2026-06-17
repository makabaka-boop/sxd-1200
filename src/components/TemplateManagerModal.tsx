import { useState } from 'react';
import {
  X,
  Trash2,
  Edit2,
  FileText,
  Layers,
  BookOpen,
  Save,
  Plus,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import type { CourseTemplate, TemplateMaterial } from '@/types';
import { STAGES } from '@/types';

interface TemplateManagerModalProps {
  onClose: () => void;
  onApplyTemplate?: (templateId: string) => void;
}

interface TemplateMaterialForm {
  name: string;
  version: string;
  copies: number;
  spareCopies: number;
  stage: string;
  remark: string;
}

const emptyMaterialForm: TemplateMaterialForm = {
  name: '',
  version: '',
  copies: 0,
  spareCopies: 0,
  stage: STAGES[0],
  remark: '',
};

export function TemplateManagerModal({
  onClose,
  onApplyTemplate,
}: TemplateManagerModalProps) {
  const {
    templates,
    deleteTemplate,
    updateTemplate,
    applyTemplate,
    createTemplate,
    courseInfo,
  } = useMaterialStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CourseTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    classType: '',
    copiesRule: '',
    remark: '',
    defaultStages: [] as string[],
    materials: [] as TemplateMaterialForm[],
    courseInfo: {
      name: '',
      expectedCount: 0,
    },
  });
  const [editingMaterialIndex, setEditingMaterialIndex] = useState<number | null>(null);
  const [materialForm, setMaterialForm] = useState<TemplateMaterialForm>(emptyMaterialForm);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除模板"${name}"吗？`)) {
      deleteTemplate(id);
      if (expandedId === id) {
        setExpandedId(null);
      }
    }
  };

  const handleApply = (templateId: string) => {
    applyTemplate(templateId);
    if (onApplyTemplate) {
      onApplyTemplate(templateId);
    }
    onClose();
  };

  const startEdit = (template: CourseTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      classType: template.classType,
      copiesRule: template.copiesRule,
      remark: template.remark,
      defaultStages: [...template.defaultStages],
      materials: template.materials.map((m) => ({ ...m })),
      courseInfo: {
        name: template.courseInfo?.name || '',
        expectedCount: template.courseInfo?.expectedCount || 0,
      },
    });
    setIsCreating(false);
    setEditingMaterialIndex(null);
    setIsAddingMaterial(false);
  };

  const startCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      classType: '',
      copiesRule: '',
      remark: '',
      defaultStages: [],
      materials: [],
      courseInfo: {
        name: courseInfo.name,
        expectedCount: courseInfo.expectedCount,
      },
    });
    setIsCreating(true);
    setEditingMaterialIndex(null);
    setIsAddingMaterial(false);
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim()) {
      alert('请输入模板名称');
      return;
    }
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        name: formData.name.trim(),
        classType: formData.classType.trim(),
        copiesRule: formData.copiesRule.trim(),
        remark: formData.remark.trim(),
        defaultStages: formData.defaultStages,
        materials: formData.materials.map((m) => ({
          name: m.name.trim(),
          version: m.version.trim(),
          copies: m.copies,
          spareCopies: m.spareCopies,
          stage: m.stage,
          remark: m.remark,
        })),
        courseInfo: {
          name: formData.courseInfo.name.trim(),
          expectedCount: formData.courseInfo.expectedCount,
        },
      });
      alert('模板已更新');
    } else if (isCreating) {
      createTemplate({
        name: formData.name.trim(),
        classType: formData.classType.trim(),
        copiesRule: formData.copiesRule.trim(),
        remark: formData.remark.trim(),
        defaultStages: formData.defaultStages,
        materials: formData.materials.map((m) => ({
          name: m.name.trim(),
          version: m.version.trim(),
          copies: m.copies,
          spareCopies: m.spareCopies,
          stage: m.stage,
          remark: m.remark,
        })),
        courseInfo: {
          name: formData.courseInfo.name.trim(),
          expectedCount: formData.courseInfo.expectedCount,
        },
      });
      alert('模板已创建');
    }
    setEditingTemplate(null);
    setIsCreating(false);
    setEditingMaterialIndex(null);
    setIsAddingMaterial(false);
  };

  const toggleStage = (stage: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultStages: prev.defaultStages.includes(stage)
        ? prev.defaultStages.filter((s) => s !== stage)
        : [...prev.defaultStages, stage],
    }));
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startAddMaterial = () => {
    setMaterialForm({
      ...emptyMaterialForm,
      stage: formData.defaultStages[0] || STAGES[0],
    });
    setEditingMaterialIndex(null);
    setIsAddingMaterial(true);
  };

  const startEditMaterial = (index: number) => {
    setMaterialForm({ ...formData.materials[index] });
    setEditingMaterialIndex(index);
    setIsAddingMaterial(false);
  };

  const handleSaveMaterial = () => {
    if (!materialForm.name.trim()) {
      alert('请输入资料名称');
      return;
    }
    const newMaterial: TemplateMaterialForm = {
      name: materialForm.name.trim(),
      version: materialForm.version.trim(),
      copies: Math.max(0, materialForm.copies),
      spareCopies: Math.max(0, materialForm.spareCopies),
      stage: materialForm.stage,
      remark: materialForm.remark,
    };

    if (editingMaterialIndex !== null) {
      const updated = [...formData.materials];
      updated[editingMaterialIndex] = newMaterial;
      setFormData((prev) => ({ ...prev, materials: updated }));
    } else {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial],
      }));
    }
    setMaterialForm(emptyMaterialForm);
    setEditingMaterialIndex(null);
    setIsAddingMaterial(false);
  };

  const handleDeleteMaterial = (index: number) => {
    if (confirm('确定要删除这条资料吗？')) {
      const updated = formData.materials.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, materials: updated }));
      if (editingMaterialIndex === index) {
        setEditingMaterialIndex(null);
        setIsAddingMaterial(false);
      }
    }
  };

  const cancelMaterialEdit = () => {
    setMaterialForm(emptyMaterialForm);
    setEditingMaterialIndex(null);
    setIsAddingMaterial(false);
  };

  const isEditing = editingTemplate !== null || isCreating;
  const isMaterialEditing = isAddingMaterial || editingMaterialIndex !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                资料包模板管理
              </h3>
              <p className="text-sm text-slate-500">
                共 {templates.length} 个模板
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200"
            >
              <Plus className="w-4 h-4" />
              新建模板
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <div className="space-y-5">
              <h4 className="font-medium text-slate-800 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary-600" />
                {isCreating ? '新建模板' : '编辑模板'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    模板名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="输入模板名称"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    适用班型
                  </label>
                  <input
                    type="text"
                    value={formData.classType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        classType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="如：一年级基础班"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    模板课程名称
                  </label>
                  <input
                    type="text"
                    value={formData.courseInfo.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseInfo: {
                          ...prev.courseInfo,
                          name: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="课程名称（套用模板时自动带入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    预计人数（作为份数计算基准
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.courseInfo.expectedCount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          courseInfo: {
                            ...prev.courseInfo,
                            expectedCount:
                              parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="预计人数"
                    />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  默认教学环节
                </label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => toggleStage(stage)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        formData.defaultStages.includes(stage)
                          ? 'bg-primary-100 text-primary-700 border-primary-300'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  默认份数规则
                </label>
                <input
                  type="text"
                  value={formData.copiesRule}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      copiesRule: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="描述份数计算规则"
                />
                <p className="text-xs text-slate-400 mt-1">
                  例如：按预计人数+5份备用、每人1份+10%备用等
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  备注说明
                </label>
                <textarea
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, remark: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="模板使用说明、注意事项等"
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">
                  资料清单（{formData.materials.length} 项）
                </label>
                <button
                  type="button"
                  onClick={startAddMaterial}
                  disabled={isMaterialEditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  添加资料
                </button>
                </div>

                {formData.materials.length === 0 && !isMaterialEditing && (
                  <div className="text-center py-8 text-sm text-slate-400">
                  暂无资料，点击"添加资料"按钮添加
                </div>
                )}

                {formData.materials.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.materials.map((m, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-lg overflow-hidden ${
                          editingMaterialIndex === idx
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        {editingMaterialIndex === idx ? (
                          <div className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  资料名称
                                </label>
                                <input
                                  type="text"
                                  value={materialForm.name}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                  placeholder="资料名称"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  版本
                                </label>
                                <input
                                  type="text"
                                  value={materialForm.version}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      version: e.target.value,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                  placeholder="如 v1.0"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  适用环节
                                </label>
                                <select
                                  value={materialForm.stage}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      stage: e.target.value,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white"
                                >
                                  {STAGES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  份数
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={materialForm.copies}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      copies:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  备用份数
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={materialForm.spareCopies}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      spareCopies:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  备注
                                </label>
                                <input
                                  type="text"
                                  value={materialForm.remark}
                                  onChange={(e) =>
                                    setMaterialForm((prev) => ({
                                      ...prev,
                                      remark: e.target.value,
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                  placeholder="备注说明"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={cancelMaterialEdit}
                                className="px-3 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveMaterial}
                                className="px-3 py-1 text-xs text-white bg-primary-600 rounded hover:bg-primary-700"
                              >
                                保存
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800 text-sm">
                                  {m.name}
                                </span>
                                {m.version && (
                                  <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {m.version}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {m.stage} · {m.copies}+{m.spareCopies}份
                                {m.remark && ` · ${m.remark}`}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => startEditMaterial(idx)}
                                className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMaterial(idx)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isAddingMaterial && (
                  <div className="border border-dashed border-primary-300 bg-primary-50/50 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-medium text-primary-700">
                      添加新资料
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          资料名称 <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={materialForm.name}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                          placeholder="资料名称"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          版本
                        </label>
                        <input
                          type="text"
                          value={materialForm.version}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              version: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                          placeholder="如 v1.0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          适用环节
                        </label>
                        <select
                          value={materialForm.stage}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              stage: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          份数
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={materialForm.copies}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              copies: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          备用份数
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={materialForm.spareCopies}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              spareCopies:
                                parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          备注
                        </label>
                        <input
                          type="text"
                          value={materialForm.remark}
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              remark: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                          placeholder="备注说明"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={cancelMaterialEdit}
                        className="px-3 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMaterial}
                        className="px-3 py-1 text-xs text-white bg-primary-600 rounded hover:bg-primary-700"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTemplate(null);
                    setIsCreating(false);
                    setEditingMaterialIndex(null);
                    setIsAddingMaterial(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!formData.name.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mb-4">暂无模板</p>
              <p className="text-sm text-slate-400">
                点击"新建模板"或从资料管理页面生成模板
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
                >
                  <button
                    onClick={() => toggleExpand(template.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">
                          {template.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          {template.classType && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                              {template.classType}
                            </span>
                          )}
                          <span>{template.materials.length} 项资料</span>
                          <span>更新于 {formatDate(template.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {expandedId === template.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {expandedId === template.id && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {template.courseInfo && (
                          <>
                            {template.courseInfo.name && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  课程名称
                                </p>
                                <p className="text-sm text-slate-700">
                                  {template.courseInfo.name}
                                </p>
                              </div>
                            )}
                            {template.courseInfo.expectedCount > 0 && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  预计人数（份数基准
                                </p>
                                <p className="text-sm text-slate-700">
                                  {template.courseInfo.expectedCount} 人
                                </p>
                              </div>
                            )}
                          </>
                        )}
                        {template.copiesRule && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              份数规则
                            </p>
                            <p className="text-sm text-slate-700">
                              {template.copiesRule}
                            </p>
                          </div>
                        )}
                        {template.defaultStages.length > 0 && (
                          <div className="md:col-span-3">
                            <p className="text-xs text-slate-500 mb-1">
                              教学环节
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {template.defaultStages.map((stage) => (
                                <span
                                  key={stage}
                                  className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                                >
                                  {stage}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {template.remark && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">备注说明</p>
                          <p className="text-sm text-slate-600">
                            {template.remark}
                          </p>
                        </div>
                      )}

                      {template.materials.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-2">
                            资料清单（{template.materials.length} 项）
                          </p>
                          <div className="bg-white rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
                            {template.materials.map((m, idx) => (
                              <div
                                key={idx}
                                className="px-3 py-2 text-sm border-b border-slate-100 last:border-b-0 flex items-center justify-between"
                              >
                                <div>
                                  <span className="text-slate-800">
                                    {m.name}
                                  </span>
                                  <span className="text-slate-400 text-xs ml-2">
                                    {m.version}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {m.stage} · {m.copies}+{m.spareCopies}份
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-xs text-slate-400">
                          创建于 {formatDate(template.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(template.id, template.name)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                          <button
                            onClick={() => startEdit(template)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
                          >
                            <Edit2 className="w-4 h-4" />
                            编辑
                          </button>
                          <button
                            onClick={() => handleApply(template.id)}
                            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            套用模板
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
