import { Calendar, Users, BookOpen, Hash } from 'lucide-react';
import { useMaterialStore } from '@/store/useMaterialStore';

export function CourseInfoCard() {
  const { courseInfo, setCourseInfo } = useMaterialStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary-600" />
        课程信息
      </h2>
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
    </div>
  );
}
