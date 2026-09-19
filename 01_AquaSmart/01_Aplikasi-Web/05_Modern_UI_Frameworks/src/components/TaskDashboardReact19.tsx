// AquaSmart Task Dashboard - React 19 Implementation
// Demonstrates React Compiler Auto-Memoization without explicit useMemo/useCallback
// Modul 5 - Modern UI Frameworks Practice

import React, { useState } from 'react';

// Interface untuk Task data structure
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  dueDate: string;
}

/**
 * Komponen TaskCard - Menampilkan detail satu tugas
 * React 19: Otomatis di-memoize oleh React Compiler
 * Tidak perlu React.memo eksplisit
 */
function TaskCard({ task }: { task: Task }) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="task-card p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800 text-sm">{task.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      
      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ').toUpperCase()}
        </span>
        <span className="text-xs text-slate-500">{task.category}</span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due: {new Date(task.dueDate).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}

/**
 * TaskDashboardReact19 - Main dashboard component
 * Uses React 19 features:
 * - React Compiler for automatic memoization
 * - No manual useMemo or useCallback needed
 * - Automatic dependency tracking
 */
function TaskDashboardReact19() {
  // State management dengan auto-tracking dari React Compiler
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Setup Sensor Water Quality Monitoring",
      description: "Install dan konfigurasi sensor pH, dissolved oxygen, temperature, dan turbidity untuk monitoring air aquarium",
      priority: "high",
      status: "in_progress",
      category: "Hardware",
      dueDate: "2026-12-15"
    },
    {
      id: 2,
      title: "Develop Real-time Alert System",
      description: "Implementasikan sistem alert otomatis untuk parameter air yang keluar dari range normal (pH, DO, suhu)",
      priority: "high",
      status: "pending",
      category: "Software",
      dueDate: "2026-12-20"
    },
    {
      id: 3,
      title: "Create User Dashboard with Charts",
      description: "Buat dashboard monitoring real-time menggunakan Chart.js atau Recharts untuk visualisasi data sensor",
      priority: "medium",
      status: "pending",
      category: "UI/UX",
      dueDate: "2026-12-18"
    },
    {
      id: 4,
      title: "Integrate MQTT Protocol",
      description: "Implementasikan komunikasi MQTT untuk transfer data real-time dari microcontroller ke server",
      priority: "high",
      status: "pending",
      category: "IoT",
      dueDate: "2026-12-22"
    },
    {
      id: 5,
      title: "User Authentication & Authorization",
      description: "Buat sistem login/register dengan JWT token dan role-based access control",
      priority: "medium",
      status: "pending",
      category: "Security",
      dueDate: "2026-12-25"
    }
  ]);

  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    category: "",
    dueDate: ""
  });

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter tasks - React Compiler optimizes this automatically
  const filteredTasks = tasks.filter(task => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // Handle add new task
  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    
    // Form validation
    if (!newTask.title || !newTask.category || !newTask.dueDate) {
      alert("Please fill all required fields (marked with *)");
      return;
    }

    const newTaskWithId: Task = {
      ...newTask,
      id: Math.max(...tasks.map(t => t.id)) + 1
    };

    setTasks(prevTasks => [...prevTasks, newTaskWithId]);
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      category: "",
      dueDate: ""
    });
  }

  // Update task status
  function handleUpdateStatus(id: number, newStatus: Task['status']) {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }

  // Delete task
  function handleDeleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  }

  // Statistics
  const statistics = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <span className="text-4xl">🌊</span>
                AquaSmart Task & Project Dashboard
              </h1>
              <p className="text-slate-600 mt-1 ml-7">
                Monitor and manage water quality monitoring project tasks
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">React 19 Demo</p>
              <p className="text-xs text-slate-400">Auto-Memoization with React Compiler</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Tasks" 
            value={statistics.total} 
            color="blue"
            icon="📋"
          />
          <StatCard 
            title="Pending" 
            value={statistics.pending} 
            color="yellow"
            icon="⏳"
          />
          <StatCard 
            title="In Progress" 
            value={statistics.inProgress} 
            color="cyan"
            icon="🔄"
          />
          <StatCard 
            title="Completed" 
            value={statistics.completed} 
            color="green"
            icon="✅"
          />
        </section>

        {/* Add Task Form */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
            <span className="text-2xl">➕</span> Add New Task
          </h2>
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Testing">Testing</option>
                  <option value="Documentation">Documentation</option>
                  <option value="IoT">IoT</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              ➕ Add Task
            </button>
          </form>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-slate-600">
            Showing <strong className="text-blue-600">{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
          </div>
        </section>

        {/* Task Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
            <span className="text-2xl">📝</span> Task List
          </h2>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-slate-500 text-lg">No tasks found matching your filters</p>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or add a new task</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        {filteredTasks.some(t => t.status !== 'completed') && (
          <section className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold mb-3 text-slate-700">⚡ Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {filteredTasks
                .filter(t => t.status !== 'completed')
                .slice(0, 3)
                .map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleUpdateStatus(task.id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    ✅ Mark "{task.title}" done
                  </button>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>AquaSmart - Water Quality Monitoring System | Modul 5 Practice</p>
          <p className="text-xs mt-1">Built with React 19 & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * StatCard - Helper component for statistics display
 */
function StatCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    green: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-75 uppercase">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default TaskDashboardReact19;
