import { useState } from 'react';
import {
  Package,
  ListTodo,
  ClipboardCheck,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';
import { useMaterialChecks } from '@/hooks/useMaterialChecks';
import { CourseInfoCard } from '@/components/CourseInfoCard';
import { FilterBar } from '@/components/FilterBar';
import { MaterialTable } from '@/components/MaterialTable';
import { MaterialForm } from '@/components/MaterialForm';
import { BatchActionBar } from '@/components/BatchActionBar';
import { AlertPanel } from '@/components/AlertPanel';
import { ChecklistView } from '@/components/ChecklistView';
import { exportToJson } from '@/utils/exportJson';
import type { Material } from '@/types';

export default function Home() {
  const { view, setView, materials, courseInfo } = useMaterialStore();
  const { hasErrors, hasWarnings, checkResults } = useMaterialChecks(
    materials,
    courseInfo
  );

  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleAdd = () => {
    setEditingMaterial(null);
    setShowForm(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
  };

  const handleExport = () => {
    exportToJson(courseInfo, materials);
  };

  const totalIssues = checkResults.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">
                  资料包组合工具
                </h1>
                <p className="text-xs text-slate-500">课程资料整理助手</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === 'list'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <ListTodo className="w-4 h-4" />
                  资料管理
                </button>
                <button
                  onClick={() => setView('checklist')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative ${
                    view === 'checklist'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  课前核对
                  {totalIssues > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                      {totalIssues}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <FileJson className="w-4 h-4" />
                导出
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'list' ? (
          <div className="space-y-5">
            <CourseInfoCard />

            {(hasErrors || hasWarnings) && <AlertPanel />}

            <BatchActionBar onAdd={handleAdd} />

            <FilterBar />

            <MaterialTable onEdit={handleEdit} />
          </div>
        ) : (
          <ChecklistView />
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
          <p>
            数据仅保存在浏览器内存中，刷新页面后将重置。请及时导出 JSON 文件保存。
          </p>
          {totalIssues > 0 && (
            <p className="mt-2 flex items-center justify-center gap-1 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
              当前存在 {totalIssues} 项待处理问题
            </p>
          )}
        </div>
      </footer>

      {showForm && (
        <MaterialForm material={editingMaterial} onClose={handleCloseForm} />
      )}
    </div>
  );
}
