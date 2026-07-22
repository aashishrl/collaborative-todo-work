import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialTasks = {
  todo: [
    { id: '1', title: 'Design UI Mockups', description: 'Create Figma designs for the new dashboard', priority: 'high' },
    { id: '2', title: 'Setup Database', description: 'Configure PostgreSQL database schema', priority: 'medium' },
  ],
  inProgress: [],
  done: [],
};

// Priority badge component
function PriorityBadge({ priority }) {
  const colors = {
    high: '#ff4444',
    medium: '#ffbb33',
    low: '#00C851',
  };

  return (
    <span style={{
      backgroundColor: colors[priority],
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'inline-block',
    }}>
      {priority}
    </span>
  );
}

// Droppable Column Component
function DroppableColumn({ id, title, tasks, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? '#e3f2fd' : '#f8f9fa',
        borderRadius: '8px',
        padding: '16px',
        minHeight: '400px',
        border: isOver ? '2px dashed #2196F3' : '2px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '2px solid #e0e0e0',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
          {title}
        </h3>
        <span style={{
          backgroundColor: '#e0e0e0',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#666',
        }}>
          {count}
        </span>
      </div>
      <div style={{ minHeight: '200px' }}>
        {children}
        {tasks.length === 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            color: '#999',
            fontSize: '14px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            backgroundColor: isOver ? '#e3f2fd' : '#fafafa',
          }}>
            {isOver ? 'Drop here' : 'Drop tasks here'}
          </div>
        )}
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: isDragging ? '#e3f2fd' : 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'grab',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>
          {task.title}
        </h4>
        <PriorityBadge priority={task.priority} />
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
        {task.description}
      </p>
    </div>
  );
}

// Drag Overlay Component
function DragOverlayItem({ task }) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#2196F3',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      transform: 'rotate(3deg) scale(1.05)',
      width: '300px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
          {task.title}
        </h4>
        <PriorityBadge priority={task.priority} />
      </div>
      <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
        {task.description}
      </p>
    </div>
  );
}

// Main Kanban Board Component
function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Find which column a task belongs to
  const findTaskColumn = (taskId) => {
    for (const [columnId, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.some(task => task.id === taskId)) {
        return columnId;
      }
    }
    return null;
  };

  // Get all task IDs for SortableContext
  const getAllTaskIds = () => {
    return Object.values(tasks).flat().map(task => task.id);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find which columns the items belong to
    const activeColumn = findTaskColumn(activeId);
    
    // Check if over.id is a column ID (for empty columns)
    const isOverColumn = ['todo', 'inProgress', 'done'].includes(overId);
    
    let overColumn;
    let overIndex;

    if (isOverColumn) {
      // Dropping on a column (empty or not)
      overColumn = overId;
      overIndex = tasks[overId].length; // Add to end of column
    } else {
      // Dropping on another task
      overColumn = findTaskColumn(overId);
      overIndex = tasks[overColumn].findIndex(task => task.id === overId);
    }

    if (!activeColumn || !overColumn) return;

    // If moving within the same column
    if (activeColumn === overColumn) {
      const columnTasks = tasks[activeColumn];
      const oldIndex = columnTasks.findIndex(task => task.id === activeId);
      const newIndex = isOverColumn ? columnTasks.length : columnTasks.findIndex(task => task.id === overId);
      
      setTasks({
        ...tasks,
        [activeColumn]: arrayMove(columnTasks, oldIndex, newIndex),
      });
    } else {
      // Moving between columns
      const activeTasks = tasks[activeColumn];
      const overTasks = tasks[overColumn];
      
      const activeIndex = activeTasks.findIndex(task => task.id === activeId);
      
      // Remove from active column
      const [movedTask] = activeTasks.splice(activeIndex, 1);
      
      // Insert into over column
      if (overIndex === -1 || overIndex === undefined) {
        overTasks.push(movedTask);
      } else {
        overTasks.splice(overIndex, 0, movedTask);
      }
      
      setTasks({
        ...tasks,
        [activeColumn]: activeTasks,
        [overColumn]: overTasks,
      });
    }
  };

  const activeTask = activeId 
    ? Object.values(tasks).flat().find(task => task.id === activeId)
    : null;

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          📋 Project Board
        </h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Drag and drop tasks between columns (empty columns now support dropping!)
        </p>
        {Object.values(tasks).flat().length === 0 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            color: '#856404',
            marginTop: '8px',
          }}>
            💡 All columns are empty. Add some tasks or drag tasks between columns.
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={getAllTaskIds()}
          strategy={verticalListSortingStrategy}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            <DroppableColumn 
              id="todo" 
              title="📝 To Do" 
              tasks={tasks.todo} 
              count={tasks.todo.length}
            >
              {tasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} isDragging={task.id === activeId} />
              ))}
            </DroppableColumn>

            <DroppableColumn 
              id="inProgress" 
              title="🔄 In Progress" 
              tasks={tasks.inProgress} 
              count={tasks.inProgress.length}
            >
              {tasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} isDragging={task.id === activeId} />
              ))}
            </DroppableColumn>

            <DroppableColumn 
              id="done" 
              title="✅ Done" 
              tasks={tasks.done} 
              count={tasks.done.length}
            >
              {tasks.done.map((task) => (
                <TaskCard key={task.id} task={task} isDragging={task.id === activeId} />
              ))}
            </DroppableColumn>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? <DragOverlayItem task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Statistics */}
      <div style={{
        marginTop: '32px',
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        border: '1px solid #e0e0e0',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>Total Tasks</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a' }}>
            {Object.values(tasks).flat().length}
          </div>
        </div>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>Completed</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#4CAF50' }}>
            {tasks.done.length}
          </div>
        </div>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>In Progress</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#FF9800' }}>
            {tasks.inProgress.length}
          </div>
        </div>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>To Do</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2196F3' }}>
            {tasks.todo.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;