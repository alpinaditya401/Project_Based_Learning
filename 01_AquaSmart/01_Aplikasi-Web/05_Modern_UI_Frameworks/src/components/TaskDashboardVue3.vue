<!-- 
  AquaSmart Task Dashboard - Vue 3 Implementation
  Demonstrates Composition API with Reactivity System
  Modul 5 - Modern UI Frameworks Practice
-->

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header Section -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span class="text-4xl">🌊</span>
              AquaSmart Task & Project Dashboard
            </h1>
            <p class="text-slate-600 mt-1 ml-7">
              Monitor and manage water quality monitoring project tasks
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Vue 3 Demo</p>
            <p class="text-xs text-slate-400">Composition API with Ref & Reactive</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Tasks" 
          :value="statistics.total" 
          color="blue"
          icon="📋"
        />
        <StatCard 
          title="Pending" 
          :value="statistics.pending" 
          color="yellow"
          icon="⏳"
        />
        <StatCard 
          title="In Progress" 
          :value="statistics.inProgress" 
          color="cyan"
          icon="🔄"
        />
        <StatCard 
          title="Completed" 
          :value="statistics.completed" 
          color="green"
          icon="✅"
        />
      </section>

      <!-- Add Task Form -->
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
          <span class="text-2xl">➕</span> Add New Task
        </h2>
        
        <form @submit.prevent="handleAddTask" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Task Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newTask.title"
                type="text"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                v-model="newTask.category"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                v-model="newTask.description"
                rows="2"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Task description..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Due Date <span class="text-red-500">*</span></label>
              <input
                v-model="newTask.dueDate"
                type="date"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                v-model="newTask.priority"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            ➕ Add Task
          </button>
        </form>
      </section>

      <!-- Filters -->
      <section class="flex flex-wrap items-center gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-slate-700 mb-1">Filter by Priority</label>
          <select
            v-model="filterPriority"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-slate-700 mb-1">Filter by Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="in_progress">🔄 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div class="ml-auto text-sm text-slate-600">
          Showing <strong class="text-blue-600">{{ filteredTasks.length }}</strong> of <strong>{{ tasks.length }}</strong> tasks
        </div>
      </section>

      <!-- Task Grid -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
          <span class="text-2xl">📝</span> Task List
        </h2>
        
        <div v-if="filteredTasks.length === 0" class="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-slate-500 text-lg">No tasks found matching your filters</p>
          <p class="text-slate-400 text-sm mt-2">Try adjusting your filters or add a new task</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard 
            v-for="task in filteredTasks" 
            :key="task.id" 
            :task="task"
            @update-status="handleUpdateStatus"
            @delete-task="handleDeleteTask"
          />
        </div>
      </section>

      <!-- Quick Actions -->
      <section v-if="filteredTasks.some(t => t.status !== 'completed')" class="mt-8 pt-6 border-t border-slate-200">
        <h3 class="text-lg font-semibold mb-3 text-slate-700">⚡ Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="task in filteredTasks.filter(t => t.status !== 'completed').slice(0, 3)"
            :key="task.id"
            @click="handleUpdateStatus(task.id, 'completed')"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            ✅ Mark "{{ task.title }}" done
          </button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mt-12 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
        <p>AquaSmart - Water Quality Monitoring System | Modul 5 Practice</p>
        <p class="text-xs mt-1">Built with Vue 3 & Tailwind CSS</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  dueDate: string;
}

// State using reactive
const tasks = ref<Task[]>([
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

const newTask = ref<Omit<Task, 'id'>>({
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  category: "",
  dueDate: ""
});

const filterPriority = ref<string>('all');
const filterStatus = ref<string>('all');

// Computed property for filtered tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    if (filterPriority.value !== 'all' && task.priority !== filterPriority.value) {
      return false;
    }
    if (filterStatus.value !== 'all' && task.status !== filterStatus.value) {
      return false;
    }
    return true;
  });
});

// Computed statistics
const statistics = computed(() => ({
  total: tasks.value.length,
  pending: tasks.value.filter(t => t.status === 'pending').length,
  inProgress: tasks.value.filter(t => t.status === 'in_progress').length,
  completed: tasks.value.filter(t => t.status === 'completed').length,
  highPriority: tasks.value.filter(t => t.priority === 'high' && t.status !== 'completed').length
}));

// Methods
function handleAddTask() {
  // Form validation
  if (!newTask.value.title || !newTask.value.category || !newTask.value.dueDate) {
    alert("Please fill all required fields (marked with *)");
    return;
  }

  const taskWithId: Task = {
    ...newTask.value,
    id: Math.max(...tasks.value.map(t => t.id)) + 1
  };

  tasks.value.push(taskWithId);
  
  // Reset form
  newTask.value = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    category: "",
    dueDate: ""
  };
}

function handleUpdateStatus(id: number, newStatus: Task['status']) {
  const index = tasks.value.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks.value[index].status = newStatus;
  }
}

function handleDeleteTask(id: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(task => task.id !== id);
  }
}
</script>

<!-- Sub-components should be defined similarly -->
<!-- TaskCard.vue and StatCard.vue components would be imported here -->

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
