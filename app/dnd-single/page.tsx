"use client";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import React from "react";
type Task = {
  id: string;
  title: string;
  description: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements and create initial documentation",
  },
  {
    id: "2",
    title: "Design System",
    description: "Create component library and design tokens",
  },
  {
    id: "3",
    title: "API Integration",
    description: "Implement REST API endpoints",
  },
  {
    id: "4",
    title: "Testing",
    description: "Write unit tests for core functionality",
  },
];

const TaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(task);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
    </div>
  );
};

const DndSinglePage = () => {
  const [tasks, setTasks] = React.useState<Task[]>(INITIAL_TASKS);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const currTaskId = active.id as Task["id"];
    const targetTaskId = over.id as Task["id"];

    const oldIndex = tasks.map((task) => task.id).indexOf(currTaskId);
    const newIndex = tasks.map((task) => task.id).indexOf(targetTaskId);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mx-auto max-w-5xl p-2 mt-10 bg-sky-500 rounded-md">
        <h4>Dnd kit Sort Single Container</h4>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className="grid gap-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default DndSinglePage;
