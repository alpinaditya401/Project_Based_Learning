<!-- 
  AquaSmart Task Dashboard - Svelte 5 Implementation
  Demonstrates Runes Reactivity System ($state, $derived, $effect)
  Modul 5 - Modern UI Frameworks Practice
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  // Type definitions
  interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    category: string;
    dueDate: string;
  }

  // State using Svelte 5 Runes ($state)
  let tasks = $state<Task[]>([
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

  let newTask = $state<Omit<Task, 'id'>>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    category: "",
    dueDate: ""
  });

  let filterPriority = $state<string>('all');
  let filterStatus = $state<string>('all');

  // Derived values using $derived (Svelte 5 reactivity)
  let filteredTasks = $derived(() => {
    return tasks.filter(task => {
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }
      if (filterStatus !== 'all' && task.status !== filterStatus) {
        return false;
      }
      return true;
    });
  });

  let statistics = $derived(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  }));

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Form submission handler
  function handleAddTask(event: Event) {
    event.preventDefault();
    
    // Validation
    if (!newTask.title || !newTask.category || !newTask.dueDate) {
      alert("Please fill all required fields (marked with *)");
      return;
    }

    const taskWithId: Task = {
      ...newTask,
      id: Math.max(...tasks.map(t => t.id)) + 1
    };

    tasks = [...tasks, taskWithId];
    
    // Reset form
    newTask = {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      category: "",
      dueDate: ""
    };
  }

  // Update task status
  function handleUpdateStatus(id: number, newStatus: Task['status']) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
  }

  // Delete task
  function handleDeleteTask(id: number): boolean {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(task => task.id !== id);
      return true;
    }
    return false;
  }

  // Effect for logging (demonstrates $effect rune)
  $effect(() => {
    console.log(`Filtered tasks updated: ${filteredTasks.length} of ${tasks.length}`);
  });
</script>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
          <p class="text-sm text-slate-500">Svelte 5 Demo</p>
          <p class="text-xs text-slate-400">Runes Reactivity ($state, $derived)</p>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Statistics Cards -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Tasks" 
        {value: statistics.total} 
        color="blue"
        icon="📋"
      />
      <StatCard 
        title="Pending" 
        {value: statistics.pending} 
        color="yellow"
        icon="⏳"
      />
      <StatCard 
        title="In Progress" 
        {value: statistics.inProgress} 
        color="cyan"
        icon="🔄"
      />
      <StatCard 
        title="Completed" 
        {value: statistics.completed} 
        color="green"
        icon="✅"
      />
    </section>

    <!-- Add Task Form -->
    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
        <span class="text-2xl">➕</span> Add New Task
      </h2>
      
      <form on:submit|preventDefault={handleAddTask} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Task Title <span class="text-red-500">*</span>
            </label>
            <input
              bind:value={newTask.title}
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
              bind:value={newTask.category}
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
              bind:value={newTask.description}
              rows="2"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task description..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Due Date <span class="text-red-500">*</span></label>
            <input
              bind:value={newTask.dueDate}
              type="date"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              bind:value={newTask.priority}
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
          bind:value={filterPriority}
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
          bind:value={filterStatus}
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="in_progress">🔄 In Progress</option>
          <option value="completed">✅ Completed</option>
        </select>
      </div>

      <div class="ml-auto text-sm text-slate-600">
        Showing <strong class="text-blue-600">{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
      </div>
    </section>

    <!-- Task Grid -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
        <span class="text-2xl">📝</span> Task List
      </h2>
      
      {#if filteredTasks.length === 0}
        <div class="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-slate-500 text-lg">No tasks found matching your filters</p>
          <p class="text-slate-400 text-sm mt-2">Try adjusting your filters or add a new task</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each filteredTasks as task (task.id)}
            <TaskCard
              {task}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTask={handleDeleteTask}
            />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Quick Actions -->
    {:if filteredTasks.some(t => t.status !== 'completed')}
      <section class="mt-8 pt-6 border-t border-slate-200">
        <h3 class="text-lg font-semibold mb-3 text-slate-700">⚡ Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          {#each filteredTasks.filter(t => t.status !== 'completed').slice(0, 3) as task}
            <button
              on:click={() => handleUpdateStatus(task.id, 'completed')}
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
            >
              ✅ Mark "{task.title}" done
            </button>
          {/each}
        </div>
      </section>
    {:/if}
  </main>

  <!-- Footer -->
  <footer class="mt-12 bg-white border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
      <p>AquaSmart - Water Quality Monitoring System | Modul 5 Practice</p>
      <p class="text-xs mt-1">Built with Svelte 5 & Tailwind CSS</p>
    </div>
  </footer>
</main>

<!-- Sub-components -->
{#if false}
  <!-- These would be separate .svelte files in actual implementation -->
  <TaskCard task={task} onUpdateStatus={() => {}} onDeleteTask={() => {}} />
  <StatCard title="" {value} color="" icon="" />
{/if}

<style>
  /* Tailwind CSS utility classes are used throughout */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
