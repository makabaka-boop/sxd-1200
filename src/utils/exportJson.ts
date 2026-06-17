import type { CourseInfo, Material } from '@/types';

export interface ExportData {
  courseInfo: CourseInfo;
  materials: Material[];
  exportedAt: string;
}

export function exportToJson(courseInfo: CourseInfo, materials: Material[]): void {
  const data: ExportData = {
    courseInfo,
    materials,
    exportedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const dateStr = courseInfo.date || new Date().toISOString().split('T')[0];
  const courseName = courseInfo.name || '课程资料包';
  link.download = `${courseName}_${dateStr}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
