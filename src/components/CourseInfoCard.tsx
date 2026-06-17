import { useState } from 'react';
import { Calendar, Users, BookOpen, Hash, Layers, ChevronDown, Settings, Plus } from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { TemplateManagerModal } from './TemplateManagerModal';
import { CreateTemplateModal } from './CreateTemplateModal';

export function CourseInfoCard() {
  const { courseInfo, setCourseInfo, templates, applyTemplate, appliedTemplateId } = useMaterialStore();
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const appliedTemplate = templates.find((t) => t.id === appliedTemplateId);

  const handleApplyTemplate = (templateId: string) => {
    applyTemplate(templateId);
    setShowTemplateDropdown(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          课程信息
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200"
            >
              <Layers className="w-4 h-4" />
              套用模板
              <ChevronDown className="w-4 h-4" />
            </button>

            {showTemplateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTemplateDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                  <div className="p-2 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setShowTemplateDropdown(false);
                        setShowTemplateManager(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      管理模板
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateDropdown(false);
                        setShowCreateTemplate(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      从当前资料生成模板
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {templates.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">
                        暂无模板
                      </div>
                    ) : (
                      templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleApplyTemplate(template.id)}
                          className={`w-full p-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                            appliedTemplateId === template.id ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="font-medium text-slate-800 text-sm">
                            {template.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {template.classType && (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                                {template.classType}
                              </span>
                            )}
                            <span>{template.materials.length} 项资料</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {appliedTemplate && (
        <div className="mb-4 px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700">
              当前套用模板：
              <span className="font-medium">{appliedTemplate.name}</span>
            </span>
            {appliedTemplate.classType && (
              <span className="text-primary-600">
                · {appliedTemplate.classType}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            课程名称
          </label>
          <div className="relative">
            <input
              type="text"
              value={courseInfo.name}
              onChange={(e) => setCourseInfo({ name: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="请输入课程名称"
            />
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            课程日期
          </label>
          <div className="relative">
            <input
              type="date"
              value={courseInfo.date}
              onChange={(e) => setCourseInfo({ date: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            班级代号
          </label>
          <div className="relative">
            <input
              type="text"
              value={courseInfo.classCode}
              onChange={(e) => setCourseInfo({ classCode: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="如：SXD-2024-A01"
            />
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            预计人数
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={courseInfo.expectedCount}
              onChange={(e) =>
                setCourseInfo({
                  expectedCount: parseInt(e.target.value) || 0,
                })
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="预计人数"
            />
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {showTemplateManager && (
        <TemplateManagerModal
          onClose={() => setShowTemplateManager(false)}
        />
      )}

      {showCreateTemplate && (
        <CreateTemplateModal
          onClose={() => setShowCreateTemplate(false)}
        />
      )}
    </div>
  );
}
