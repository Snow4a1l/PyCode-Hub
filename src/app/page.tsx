'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Code2, 
  Trash2, 
  Eye, 
  FileCode, 
  Calendar, 
  Tag, 
  FolderOpen,
  Search,
  Sparkles,
  Moon,
  Sun,
  Star,
  Download,
  Edit3,
  BarChart3,
  Heart,
  CheckSquare,
  X,
  FileText,
  TrendingUp,
  Zap,
  StickyNote,
  Link2,
  BookOpen
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'

// 代码数据类型
interface PythonCode {
  id: string
  title: string
  description: string | null
  code: string
  category: string
  tags: string | null
  fileName: string | null
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

// 笔记数据类型
interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string | null
  isFavorite: boolean
  codeId: string | null
  code?: { id: string; title: string } | null
  createdAt: string
  updatedAt: string
}

// 统计数据类型
interface Stats {
  totalCodes: number
  totalLines: number
  totalChars: number
  categoryStats: Record<string, number>
  favoriteCount: number
  recentCount: number
  recentCodes: PythonCode[]
  totalNotes: number
  noteCategoryStats: Record<string, number>
  noteFavoriteCount: number
  noteRecentCount: number
  recentNotes: Note[]
}

// 分类选项
const categories = [
  { value: '基础语法', label: '基础语法', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  { value: '数据结构', label: '数据结构', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  { value: '算法', label: '算法', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
  { value: '函数', label: '函数', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  { value: '面向对象', label: '面向对象', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
  { value: '文件操作', label: '文件操作', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' },
  { value: '网络编程', label: '网络编程', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' },
  { value: '项目实战', label: '项目实战', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
  { value: '其他', label: '其他', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
]

// 分类颜色映射
const categoryColorMap: Record<string, { bg: string }> = {
  '基础语法': { bg: 'bg-green-500' },
  '数据结构': { bg: 'bg-blue-500' },
  '算法': { bg: 'bg-purple-500' },
  '函数': { bg: 'bg-yellow-500' },
  '面向对象': { bg: 'bg-pink-500' },
  '文件操作': { bg: 'bg-orange-500' },
  '网络编程': { bg: 'bg-cyan-500' },
  '项目实战': { bg: 'bg-red-500' },
  '其他': { bg: 'bg-gray-500' },
}

export default function Page() {
  // 状态管理
  const [codes, setCodes] = useState<PythonCode[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTab, setCurrentTab] = useState('codes')
  
  // 上传弹窗状态
  const [uploadOpen, setUploadOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    category: '其他',
    tags: '',
    fileName: '',
  })
  
  // 详情弹窗状态
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<PythonCode | null>(null)
  
  // 编辑弹窗状态
  const [editOpen, setEditOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    description: '',
    code: '',
    category: '其他',
    tags: '',
  })
  
  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)

  // 笔记相关状态
  const [noteSearchTerm, setNoteSearchTerm] = useState('')
  const [noteSelectedCategory, setNoteSelectedCategory] = useState<string>('all')
  const [noteShowFavorites, setNoteShowFavorites] = useState(false)
  const [noteUploadOpen, setNoteUploadOpen] = useState(false)
  const [noteFormData, setNoteFormData] = useState({
    title: '',
    content: '',
    category: '其他',
    tags: '',
    codeId: '',
  })
  const [noteDetailOpen, setNoteDetailOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [noteEditOpen, setNoteEditOpen] = useState(false)
  const [noteEditFormData, setNoteEditFormData] = useState({
    id: '',
    title: '',
    content: '',
    category: '其他',
    tags: '',
    codeId: '',
  })

  // 获取代码列表
  const fetchCodes = useCallback(async () => {
    try {
      const response = await fetch('/api/codes')
      if (!response.ok) throw new Error('获取代码列表失败')
      const data = await response.json()
      setCodes(data)
    } catch (error) {
      console.error('获取代码列表失败:', error)
      toast.error('获取代码列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 获取笔记列表
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/notes')
      if (!response.ok) throw new Error('获取笔记列表失败')
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('获取笔记列表失败:', error)
    }
  }, [])

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('获取统计数据失败')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }, [])

  useEffect(() => {
    fetchCodes()
    fetchNotes()
    fetchStats()
  }, [fetchCodes, fetchNotes, fetchStats])

  // 深色模式切换
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // 过滤代码列表
  const filteredCodes = codes.filter(code => {
    const matchesSearch = code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (code.tags && code.tags.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory
    const matchesFavorite = !showFavorites || code.isFavorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  // 过滤笔记列表
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      (note.tags && note.tags.toLowerCase().includes(noteSearchTerm.toLowerCase()))
    const matchesCategory = noteSelectedCategory === 'all' || note.category === noteSelectedCategory
    const matchesFavorite = !noteShowFavorites || note.isFavorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  // 上传代码
  const handleUpload = async () => {
    if (!formData.title.trim() || !formData.code.trim()) {
      toast.error('请填写标题和代码内容')
      return
    }

    try {
      const response = await fetch('/api/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('上传失败')
      
      toast.success('代码上传成功！')
      setUploadOpen(false)
      setFormData({ title: '', description: '', code: '', category: '其他', tags: '', fileName: '' })
      fetchCodes()
      fetchStats()
    } catch (error) {
      console.error('上传失败:', error)
      toast.error('上传失败，请重试')
    }
  }

  // 删除代码
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/codes/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('删除失败')
      toast.success('代码已删除')
      fetchCodes()
      fetchStats()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败，请重试')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要删除的代码')
      return
    }

    try {
      const response = await fetch('/api/codes/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      
      if (!response.ok) throw new Error('批量删除失败')
      
      toast.success(`成功删除 ${selectedIds.length} 个代码`)
      setSelectedIds([])
      setIsSelectMode(false)
      fetchCodes()
      fetchStats()
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error('批量删除失败，请重试')
    }
  }

  // 切换收藏
  const handleToggleFavorite = async (id: string, type: 'code' | 'note') => {
    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleFavorite' }),
      })
      
      if (!response.ok) throw new Error('操作失败')
      
      if (type === 'code') {
        fetchCodes()
      } else {
        fetchNotes()
      }
      fetchStats()
    } catch (error) {
      console.error('操作失败:', error)
      toast.error('操作失败')
    }
  }

  // 查看代码详情
  const handleViewCode = (code: PythonCode) => {
    setSelectedCode(code)
    setDetailOpen(true)
  }

  // 编辑代码
  const handleEdit = (code: PythonCode) => {
    setEditFormData({
      id: code.id,
      title: code.title,
      description: code.description || '',
      code: code.code,
      category: code.category,
      tags: code.tags || '',
    })
    setEditOpen(true)
  }

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editFormData.title.trim() || !editFormData.code.trim()) {
      toast.error('请填写标题和代码内容')
      return
    }

    try {
      const response = await fetch(`/api/codes/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })
      
      if (!response.ok) throw new Error('更新失败')
      
      toast.success('代码更新成功！')
      setEditOpen(false)
      fetchCodes()
    } catch (error) {
      console.error('更新失败:', error)
      toast.error('更新失败，请重试')
    }
  }

  // 导出代码
  const handleExport = (code: PythonCode) => {
    const fileName = code.fileName || `${code.title}.py`
    const blob = new Blob([code.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('代码导出成功')
  }

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setFormData(prev => ({
          ...prev,
          code: content,
          fileName: file.name,
          title: prev.title || file.name.replace('.py', ''),
        }))
      }
      reader.readAsText(file)
    }
  }

  // 切换选择
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCodes.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCodes.map(c => c.id))
    }
  }

  // ========== 笔记相关函数 ==========

  // 上传笔记
  const handleNoteUpload = async () => {
    if (!noteFormData.title.trim() || !noteFormData.content.trim()) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...noteFormData, codeId: noteFormData.codeId || null }),
      })
      
      if (!response.ok) throw new Error('上传失败')
      
      toast.success('笔记创建成功！')
      setNoteUploadOpen(false)
      setNoteFormData({ title: '', content: '', category: '其他', tags: '', codeId: '' })
      fetchNotes()
      fetchStats()
    } catch (error) {
      console.error('上传失败:', error)
      toast.error('上传失败，请重试')
    }
  }

  // 删除笔记
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('删除失败')
      toast.success('笔记已删除')
      fetchNotes()
      fetchStats()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败，请重试')
    }
  }

  // 查看笔记详情
  const handleViewNote = (note: Note) => {
    setSelectedNote(note)
    setNoteDetailOpen(true)
  }

  // 编辑笔记
  const handleEditNote = (note: Note) => {
    setNoteEditFormData({
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || '',
      codeId: note.codeId || '',
    })
    setNoteEditOpen(true)
  }

  // 保存笔记编辑
  const handleSaveNoteEdit = async () => {
    if (!noteEditFormData.title.trim() || !noteEditFormData.content.trim()) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      const response = await fetch(`/api/notes/${noteEditFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...noteEditFormData, codeId: noteEditFormData.codeId || null }),
      })
      
      if (!response.ok) throw new Error('更新失败')
      
      toast.success('笔记更新成功！')
      setNoteEditOpen(false)
      fetchNotes()
    } catch (error) {
      console.error('更新失败:', error)
      toast.error('更新失败，请重试')
    }
  }

  // 获取分类样式
  const getCategoryStyle = (category: string) => {
    return categories.find(c => c.value === category)?.color || categories[categories.length - 1].color
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 获取最大分类数量
  const getMaxCategoryCount = (statsObj: Record<string, number>) => {
    if (!statsObj || Object.keys(statsObj).length === 0) return 1
    return Math.max(...Object.values(statsObj), 1)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">PyCode Hub</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">我的Python学习代码库</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md">
                    <Plus className="h-4 w-4" />
                    上传代码
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                      上传Python代码
                    </DialogTitle>
                    <DialogDescription>上传你学习Python过程中写的代码，支持直接粘贴或上传.py文件</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><FileCode className="h-4 w-4" />上传.py文件</Label>
                      <Input type="file" accept=".py" onChange={handleFileUpload} className="cursor-pointer" />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">或手动填写</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">标题 *</Label>
                      <Input id="title" placeholder="例如：冒泡排序算法" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">描述</Label>
                      <Textarea id="description" placeholder="简单描述这段代码的功能..." value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>分类</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">标签</Label>
                        <Input id="tags" placeholder="排序, 算法" value={formData.tags} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="code">代码内容 *</Label>
                      <Textarea id="code" placeholder="粘贴你的Python代码..." value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))} className="font-mono text-sm" rows={12} />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setUploadOpen(false)}>取消</Button>
                      <Button onClick={handleUpload} className="bg-gradient-to-r from-emerald-500 to-teal-600">上传代码</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
            <TabsTrigger value="codes" className="gap-2"><Code2 className="h-4 w-4" />代码库</TabsTrigger>
            <TabsTrigger value="notes" className="gap-2"><StickyNote className="h-4 w-4" />笔记</TabsTrigger>
            <TabsTrigger value="stats" className="gap-2"><BarChart3 className="h-4 w-4" />统计</TabsTrigger>
          </TabsList>

          {/* ========== 代码库页面 ========== */}
          <TabsContent value="codes" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="搜索代码标题、描述或标签..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]"><FolderOpen className="h-4 w-4 mr-2" /><SelectValue placeholder="分类筛选" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                </SelectContent>
              </Select>
              <Button variant={showFavorites ? "default" : "outline"} onClick={() => setShowFavorites(!showFavorites)} className="gap-2">
                <Heart className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />收藏
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>共 {codes.length} 个代码</span>
                {searchTerm && <span>· 搜索到 {filteredCodes.length} 个结果</span>}
                {selectedIds.length > 0 && <Badge variant="secondary">已选 {selectedIds.length} 个</Badge>}
              </div>
              <div className="flex items-center gap-2">
                {isSelectMode ? (
                  <>
                    <Button variant="outline" size="sm" onClick={toggleSelectAll}><CheckSquare className="h-4 w-4 mr-1" />{selectedIds.length === filteredCodes.length ? '取消全选' : '全选'}</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={selectedIds.length === 0}><Trash2 className="h-4 w-4 mr-1" />删除选中</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>确认批量删除</AlertDialogTitle><AlertDialogDescription>确定要删除选中的 {selectedIds.length} 个代码吗？此操作无法撤销。</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleBatchDelete} className="bg-red-500 hover:bg-red-600">删除</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" size="sm" onClick={() => { setIsSelectMode(false); setSelectedIds([]) }}><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsSelectMode(true)}><CheckSquare className="h-4 w-4 mr-1" />批量管理</Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
            ) : filteredCodes.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4"><Code2 className="h-10 w-10 text-slate-400" /></div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{codes.length === 0 ? '还没有上传任何代码' : showFavorites ? '暂无收藏的代码' : '没有找到匹配的代码'}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{codes.length === 0 ? '点击右上角的"上传代码"按钮开始你的Python学习之旅' : showFavorites ? '点击代码卡片上的星星图标收藏代码' : '尝试修改搜索关键词或分类筛选'}</p>
                {codes.length === 0 && <Button onClick={() => setUploadOpen(true)} className="gap-2"><Plus className="h-4 w-4" />上传第一个代码</Button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCodes.map((code) => (
                  <Card key={code.id} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 ${selectedIds.includes(code.id) ? 'ring-2 ring-emerald-500' : ''}`}>
                    {isSelectMode && (<div className="absolute top-2 left-2 z-10"><Checkbox checked={selectedIds.includes(code.id)} onCheckedChange={() => toggleSelect(code.id)} className="bg-white dark:bg-slate-800" /></div>)}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <CardTitle className="text-lg truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{code.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{code.description || '暂无描述'}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(code.id, 'code')} className="shrink-0">
                          <Star className={`h-5 w-5 ${code.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryStyle(code.category)}>{code.category}</Badge>
                        {code.fileName && (<Badge variant="outline" className="text-xs"><FileCode className="h-3 w-3 mr-1" />{code.fileName}</Badge>)}
                      </div>
                      {code.tags && (<div className="flex items-center gap-1 mb-3 text-xs text-slate-500 dark:text-slate-400"><Tag className="h-3 w-3" /><span className="truncate">{code.tags}</span></div>)}
                      <div className="rounded-lg overflow-hidden bg-slate-900 mb-3">
                        <ScrollArea className="h-24">
                          <pre className="p-3 text-xs text-slate-300 font-mono">{code.code.split('\n').slice(0, 5).join('\n')}{code.code.split('\n').length > 5 && '\n...'}</pre>
                        </ScrollArea>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Calendar className="h-3 w-3" />{formatDate(code.createdAt)}</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCode(code)} className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(code)} className="h-8 px-2"><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleExport(code)} className="h-8 px-2"><Download className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>确认删除</AlertDialogTitle><AlertDialogDescription>确定要删除「{code.title}」吗？此操作无法撤销。</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(code.id)} className="bg-red-500 hover:bg-red-600">删除</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========== 笔记页面 ========== */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="搜索笔记标题或内容..." value={noteSearchTerm} onChange={(e) => setNoteSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={noteSelectedCategory} onValueChange={setNoteSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]"><FolderOpen className="h-4 w-4 mr-2" /><SelectValue placeholder="分类筛选" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                </SelectContent>
              </Select>
              <Button variant={noteShowFavorites ? "default" : "outline"} onClick={() => setNoteShowFavorites(!noteShowFavorites)} className="gap-2">
                <Heart className={`h-4 w-4 ${noteShowFavorites ? 'fill-current' : ''}`} />收藏
              </Button>
              <Dialog open={noteUploadOpen} onOpenChange={setNoteUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"><Plus className="h-4 w-4" />新建笔记</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-amber-500" />新建学习笔记</DialogTitle>
                    <DialogDescription>记录你的Python学习心得和知识点</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-title">标题 *</Label>
                      <Input id="note-title" placeholder="例如：Python装饰器学习笔记" value={noteFormData.title} onChange={(e) => setNoteFormData(prev => ({ ...prev, title: e.target.value }))} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>分类</Label>
                        <Select value={noteFormData.category} onValueChange={(value) => setNoteFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note-tags">标签</Label>
                        <Input id="note-tags" placeholder="装饰器, 进阶" value={noteFormData.tags} onChange={(e) => setNoteFormData(prev => ({ ...prev, tags: e.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note-codeId">关联代码（可选）</Label>
                      <Select value={noteFormData.codeId} onValueChange={(value) => setNoteFormData(prev => ({ ...prev, codeId: value }))}>
                        <SelectTrigger><SelectValue placeholder="选择要关联的代码" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">不关联</SelectItem>
                          {codes.map(code => (<SelectItem key={code.id} value={code.id}>{code.title}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-content">笔记内容 *</Label>
                      <Textarea id="note-content" placeholder="记录你的学习心得..." value={noteFormData.content} onChange={(e) => setNoteFormData(prev => ({ ...prev, content: e.target.value }))} rows={12} />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setNoteUploadOpen(false)}>取消</Button>
                      <Button onClick={handleNoteUpload} className="bg-gradient-to-r from-amber-500 to-orange-600">创建笔记</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>共 {notes.length} 篇笔记</span>
              {noteSearchTerm && <span>· 搜索到 {filteredNotes.length} 篇结果</span>}
            </div>

            {filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 mb-4"><StickyNote className="h-10 w-10 text-amber-500" /></div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{notes.length === 0 ? '还没有创建任何笔记' : noteShowFavorites ? '暂无收藏的笔记' : '没有找到匹配的笔记'}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{notes.length === 0 ? '点击"新建笔记"按钮开始记录你的学习心得' : '尝试修改搜索关键词或分类筛选'}</p>
                {notes.length === 0 && <Button onClick={() => setNoteUploadOpen(true)} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600"><Plus className="h-4 w-4" />创建第一篇笔记</Button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <CardTitle className="text-lg truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{note.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(note.id, 'note')} className="shrink-0">
                          <Star className={`h-5 w-5 ${note.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={getCategoryStyle(note.category)}>{note.category}</Badge>
                        {note.code && (<Badge variant="outline" className="text-xs gap-1"><Link2 className="h-3 w-3" />{note.code.title}</Badge>)}
                      </div>
                      {note.tags && (<div className="flex items-center gap-1 mb-3 text-xs text-slate-500 dark:text-slate-400"><Tag className="h-3 w-3" /><span className="truncate">{note.tags}</span></div>)}
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 mb-3 h-24 overflow-hidden">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4">{note.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Calendar className="h-3 w-3" />{formatDate(note.createdAt)}</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewNote(note)} className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)} className="h-8 px-2"><Edit3 className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>确认删除</AlertDialogTitle><AlertDialogDescription>确定要删除笔记「{note.title}」吗？此操作无法撤销。</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteNote(note.id)} className="bg-red-500 hover:bg-red-600">删除</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========== 统计页面 ========== */}
          <TabsContent value="stats" className="space-y-6">
            {stats && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-2"><CardDescription className="text-emerald-600 dark:text-emerald-400">总代码数</CardDescription></CardHeader>
                    <CardContent><div className="flex items-center gap-2"><FileCode className="h-8 w-8 text-emerald-500" /><span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.totalCodes}</span></div></CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2"><CardDescription className="text-blue-600 dark:text-blue-400">总代码行数</CardDescription></CardHeader>
                    <CardContent><div className="flex items-center gap-2"><FileText className="h-8 w-8 text-blue-500" /><span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalLines.toLocaleString()}</span></div></CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2"><CardDescription className="text-amber-600 dark:text-amber-400">总笔记数</CardDescription></CardHeader>
                    <CardContent><div className="flex items-center gap-2"><StickyNote className="h-8 w-8 text-amber-500" /><span className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.totalNotes}</span></div></CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2"><CardDescription className="text-purple-600 dark:text-purple-400">总收藏数</CardDescription></CardHeader>
                    <CardContent><div className="flex items-center gap-2"><Star className="h-8 w-8 text-purple-500" /><span className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.favoriteCount + stats.noteFavoriteCount}</span></div></CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 border-orange-200 dark:border-orange-800">
                    <CardHeader className="pb-2"><CardDescription className="text-orange-600 dark:text-orange-400">近7天新增</CardDescription></CardHeader>
                    <CardContent><div className="flex items-center gap-2"><TrendingUp className="h-8 w-8 text-orange-500" /><span className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.recentCount + stats.noteRecentCount}</span></div></CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-emerald-500" />代码分类分布</CardTitle><CardDescription>各分类的代码数量统计</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(stats.categoryStats).sort(([,a], [,b]) => b - a).map(([category, count]) => {
                        const colorInfo = categoryColorMap[category] || categoryColorMap['其他']
                        return (<div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${colorInfo.bg}`} /><span className="font-medium">{category}</span></div><span className="text-slate-500 dark:text-slate-400">{count} 个</span></div>
                          <Progress value={(count / getMaxCategoryCount(stats.categoryStats)) * 100} className="h-2" />
                        </div>)
                      })}
                      {Object.keys(stats.categoryStats).length === 0 && <p className="text-center text-slate-500 py-4">暂无数据</p>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><StickyNote className="h-5 w-5 text-amber-500" />笔记分类分布</CardTitle><CardDescription>各分类的笔记数量统计</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(stats.noteCategoryStats).sort(([,a], [,b]) => b - a).map(([category, count]) => {
                        const colorInfo = categoryColorMap[category] || categoryColorMap['其他']
                        return (<div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${colorInfo.bg}`} /><span className="font-medium">{category}</span></div><span className="text-slate-500 dark:text-slate-400">{count} 篇</span></div>
                          <Progress value={(count / getMaxCategoryCount(stats.noteCategoryStats)) * 100} className="h-2" />
                        </div>)
                      })}
                      {Object.keys(stats.noteCategoryStats).length === 0 && <p className="text-center text-slate-500 py-4">暂无数据</p>}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500" />最近上传的代码</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentCodes.map((code) => (
                          <div key={code.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => handleViewCode(code)}>
                            <div className="flex items-center gap-3"><FileCode className="h-5 w-5 text-emerald-500" /><div><p className="font-medium text-sm">{code.title}</p><p className="text-xs text-slate-500">{formatDate(code.createdAt)}</p></div></div>
                            <Badge className={getCategoryStyle(code.category)}>{code.category}</Badge>
                          </div>
                        ))}
                        {stats.recentCodes.length === 0 && <p className="text-center text-slate-500 py-4">暂无代码</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-amber-500" />最近创建的笔记</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.recentNotes.map((note) => (
                          <div key={note.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => handleViewNote(note)}>
                            <div className="flex items-center gap-3"><StickyNote className="h-5 w-5 text-amber-500" /><div><p className="font-medium text-sm">{note.title}</p><p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p></div></div>
                            <Badge className={getCategoryStyle(note.category)}>{note.category}</Badge>
                          </div>
                        ))}
                        {stats.recentNotes.length === 0 && <p className="text-center text-slate-500 py-4">暂无笔记</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* 代码详情弹窗 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-emerald-500" />{selectedCode?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-3 flex-wrap">
              {selectedCode && (<><Badge className={getCategoryStyle(selectedCode.category)}>{selectedCode.category}</Badge>{selectedCode.fileName && <span className="text-xs text-slate-500">文件: {selectedCode.fileName}</span>}<span className="text-xs text-slate-500">创建于 {formatDate(selectedCode.createdAt)}</span></>)}
            </DialogDescription>
          </DialogHeader>
          {selectedCode?.description && <div className="text-sm text-slate-600 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-slate-800">{selectedCode.description}</div>}
          {selectedCode?.tags && <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Tag className="h-4 w-4" />{selectedCode.tags}</div>}
          <div className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[50vh] rounded-lg">
              <SyntaxHighlighter language="python" style={darkMode ? vscDarkPlus : vs} showLineNumbers customStyle={{ margin: 0, borderRadius: '0.5rem', fontSize: '0.875rem' }}>{selectedCode?.code || ''}</SyntaxHighlighter>
            </ScrollArea>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => selectedCode && handleExport(selectedCode)}><Download className="h-4 w-4 mr-2" />导出</Button>
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(selectedCode?.code || ''); toast.success('代码已复制到剪贴板') }}>复制代码</Button>
            <Button onClick={() => setDetailOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑代码弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit3 className="h-5 w-5 text-emerald-500" />编辑代码</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2"><Label>标题 *</Label><Input value={editFormData.title} onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>描述</Label><Textarea value={editFormData.description} onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>分类</Label><Select value={editFormData.category} onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label>标签</Label><Input value={editFormData.tags} onChange={(e) => setEditFormData(prev => ({ ...prev, tags: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>代码内容 *</Label><Textarea value={editFormData.code} onChange={(e) => setEditFormData(prev => ({ ...prev, code: e.target.value }))} className="font-mono text-sm" rows={12} /></div>
            <DialogFooter><Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button><Button onClick={handleSaveEdit} className="bg-gradient-to-r from-emerald-500 to-teal-600">保存修改</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 笔记详情弹窗 */}
      <Dialog open={noteDetailOpen} onOpenChange={setNoteDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><StickyNote className="h-5 w-5 text-amber-500" />{selectedNote?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-3 flex-wrap">
              {selectedNote && (<><Badge className={getCategoryStyle(selectedNote.category)}>{selectedNote.category}</Badge>{selectedNote.code && <span className="text-xs text-slate-500 flex items-center gap-1"><Link2 className="h-3 w-3" />关联代码: {selectedNote.code.title}</span>}<span className="text-xs text-slate-500">创建于 {formatDate(selectedNote.createdAt)}</span></>)}
            </DialogDescription>
          </DialogHeader>
          {selectedNote?.tags && <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Tag className="h-4 w-4" />{selectedNote.tags}</div>}
          <div className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[50vh]"><div className="prose dark:prose-invert max-w-none p-4"><pre className="whitespace-pre-wrap text-sm">{selectedNote?.content}</pre></div></ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(selectedNote?.content || ''); toast.success('笔记内容已复制到剪贴板') }}>复制内容</Button>
            <Button onClick={() => setNoteDetailOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑笔记弹窗 */}
      <Dialog open={noteEditOpen} onOpenChange={setNoteEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit3 className="h-5 w-5 text-amber-500" />编辑笔记</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2"><Label>标题 *</Label><Input value={noteEditFormData.title} onChange={(e) => setNoteEditFormData(prev => ({ ...prev, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>分类</Label><Select value={noteEditFormData.category} onValueChange={(value) => setNoteEditFormData(prev => ({ ...prev, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label>标签</Label><Input value={noteEditFormData.tags} onChange={(e) => setNoteEditFormData(prev => ({ ...prev, tags: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>关联代码</Label><Select value={noteEditFormData.codeId} onValueChange={(value) => setNoteEditFormData(prev => ({ ...prev, codeId: value }))}><SelectTrigger><SelectValue placeholder="选择要关联的代码" /></SelectTrigger><SelectContent><SelectItem value="">不关联</SelectItem>{codes.map(code => (<SelectItem key={code.id} value={code.id}>{code.title}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>笔记内容 *</Label><Textarea value={noteEditFormData.content} onChange={(e) => setNoteEditFormData(prev => ({ ...prev, content: e.target.value }))} rows={12} /></div>
            <DialogFooter><Button variant="outline" onClick={() => setNoteEditOpen(false)}>取消</Button><Button onClick={handleSaveNoteEdit} className="bg-gradient-to-r from-amber-500 to-orange-600">保存修改</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 页脚 */}
      <footer className="mt-auto border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-emerald-500" /><span>PyCode Hub - 记录你的Python学习之路</span></div>
            <div className="flex items-center gap-4"><span>{codes.length} 个代码</span><span>· {notes.length} 篇笔记</span>{stats && <span>· {stats.totalLines.toLocaleString()} 行代码</span>}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
