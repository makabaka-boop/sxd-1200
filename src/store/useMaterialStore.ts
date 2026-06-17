import { create } from 'zustand';
import type { CourseInfo, Material, MaterialStatus, Filters } from '@/types';
import { generateId } from '@/utils/idGenerator';

interface MaterialStore {
  courseInfo: CourseInfo;
  materials: Material[];
  selectedIds: string[];
  filters: Filters;
  previousCourseMaterials: Material[];
  view: 'list' | 'checklist';

  setCourseInfo: (info: Partial<CourseInfo>) => void;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setFilters: (filters: Partial<Filters>) => void;
  batchUpdateStatus: (ids: string[], status: MaterialStatus) => void;
  batchAdjustCopies: (ids: string[], delta: number) => void;
  batchDelete: (ids: string[]) => void;
  copyFromPrevious: () => void;
  saveAsPrevious: () => void;
  setView: (view: 'list' | 'checklist') => void;
}

const today = new Date().toISOString().split('T')[0];

const initialMaterials: Material[] = [
  {
    id: generateId(),
    name: '课程讲义',
    version: 'v2.1',
    copies: 30,
    spareCopies: 5,
    stage: '课堂讲义',
    status: 'ready',
    remark: '已印刷完成',
  },
  {
    id: generateId(),
    name: '练习册',
    version: 'v1.0',
    copies: 28,
    spareCopies: 2,
    stage: '课堂练习',
    status: 'pending',
    remark: '',
  },
  {
    id: generateId(),
    name: '知识点贴页',
    version: 'v2.1',
    copies: 30,
    spareCopies: 5,
    stage: '课前预习',
    status: 'ready',
    remark: '彩色打印',
  },
  {
    id: generateId(),
    name: '课后测试卷',
    version: 'v3.0',
    copies: 25,
    spareCopies: 3,
    stage: '测试评估',
    status: 'reprint',
    remark: '需要加印5份',
  },
  {
    id: generateId(),
    name: '课程讲义',
    version: 'v2.0',
    copies: 10,
    spareCopies: 0,
    stage: '课堂讲义',
    status: 'cancelled',
    remark: '旧版本，使用新版',
  },
];

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  courseInfo: {
    name: '数学思维训练班',
    date: today,
    classCode: 'SXD-2024-A01',
    expectedCount: 30,
  },
  materials: initialMaterials,
  selectedIds: [],
  filters: {
    stage: '',
    status: '',
    version: '',
    keyword: '',
    showAbnormal: false,
  },
  previousCourseMaterials: [],
  view: 'list',

  setCourseInfo: (info) =>
    set((state) => ({
      courseInfo: { ...state.courseInfo, ...info },
    })),

  addMaterial: (material) =>
    set((state) => ({
      materials: [...state.materials, { ...material, id: generateId() }],
    })),

  updateMaterial: (id, updates) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  deleteMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),

  selectAll: (ids) => set({ selectedIds: ids }),

  clearSelection: () => set({ selectedIds: [] }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  batchUpdateStatus: (ids, status) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        ids.includes(m.id) ? { ...m, status } : m
      ),
    })),

  batchAdjustCopies: (ids, delta) =>
    set((state) => ({
      materials: state.materials.map((m) => {
        if (!ids.includes(m.id)) return m;
        const newCopies = Math.max(0, m.copies + delta);
        return { ...m, copies: newCopies };
      }),
    })),

  batchDelete: (ids) =>
    set((state) => ({
      materials: state.materials.filter((m) => !ids.includes(m.id)),
      selectedIds: [],
    })),

  copyFromPrevious: () => {
    const { previousCourseMaterials } = get();
    if (previousCourseMaterials.length === 0) return;

    const newMaterials = previousCourseMaterials.map((m) => ({
      ...m,
      id: generateId(),
      status: 'pending' as MaterialStatus,
      remark: '',
    }));

    set((state) => ({
      materials: [...state.materials, ...newMaterials],
    }));
  },

  saveAsPrevious: () => {
    const { materials } = get();
    set({ previousCourseMaterials: [...materials] });
  },

  setView: (view) => set({ view }),
}));
