"use client";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Note = { id: string; value: string };
type Container = { id: string; notes: Note[] };

const initialData: Container[] = [
  {
    id: "container_1",
    notes: [
      { id: "1", value: "value1" },
      { id: "2", value: "value2" },
      { id: "3", value: "value3" },
      { id: "4", value: "value4" },
    ],
  },
  {
    id: "container_2",
    notes: [
      { id: "5", value: "value5" },
      { id: "6", value: "value6" },
      { id: "7", value: "value7" },
      { id: "8", value: "value8" },
    ],
  },
];

export default function SortableMultiContainers() {
  const [containers, setContainers] = useState(initialData);

  const findContainerIndex = (containerId: string) => {
    return containers.findIndex((container) => container.id === containerId);
  };

  const findNoteContainerIndex = (noteId: string) => {
    return containers.findIndex((container) =>
      container.notes.some((note) => note.id === noteId)
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log("onDragEnd active", active);
    console.log("onDragEnd over", over);

    // const activeId = active.id as string;
    // const overId = over.id as string;

    // // Handling container sorting
    // if (activeId.startsWith("container") && overId.startsWith("container")) {
    //   setContainers((prev) => {
    //     const oldIndex = findContainerIndex(activeId);
    //     const newIndex = findContainerIndex(overId);
    //     return arrayMove(prev, oldIndex, newIndex);
    //   });
    // }

    // // Handling notes sorting within the same container
    // else {
    //   const sourceIndex = findNoteContainerIndex(activeId);
    //   const targetIndex = findNoteContainerIndex(overId);

    //   if (sourceIndex === targetIndex) {
    //     setContainers((prev) => {
    //       const containerNotes = [...prev[sourceIndex].notes];
    //       const oldIndex = containerNotes.findIndex(
    //         (note) => note.id === activeId
    //       );
    //       const newIndex = containerNotes.findIndex(
    //         (note) => note.id === overId
    //       );
    //       return prev.map((container, index) =>
    //         index === sourceIndex
    //           ? {
    //               ...container,
    //               notes: arrayMove(containerNotes, oldIndex, newIndex),
    //             }
    //           : container
    //       );
    //     });
    //   }
    // }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log("onDragOver active", active);
    console.log("onDragOver over", over);

    // const activeId = active.id as string;
    // const overId = over.id as string;

    // const sourceIndex = findNoteContainerIndex(activeId);
    // const targetIndex = findNoteContainerIndex(overId);

    // if (sourceIndex !== targetIndex) {
    //   setContainers((prev) => {
    //     const sourceNotes = [...prev[sourceIndex].notes];
    //     const targetNotes = [...prev[targetIndex].notes];

    //     const movingNoteIndex = sourceNotes.findIndex(
    //       (note) => note.id === activeId
    //     );
    //     const [movingNote] = sourceNotes.splice(movingNoteIndex, 1);

    //     targetNotes.push(movingNote);

    //     return prev.map((container, index) =>
    //       index === sourceIndex
    //         ? { ...container, notes: sourceNotes }
    //         : index === targetIndex
    //         ? { ...container, notes: targetNotes }
    //         : container
    //     );
    //   });
    // }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext
        items={containers}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4">
          {containers.map((container) => (
            <SortableContainer key={container.id} container={container} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableContainer({ container }: { container: Container }) {
  const { id, notes } = container;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ ...container, data: { type: "container" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 min-w-[250px] bg-gray-200"
    >
      <h2 className="text-center font-bold mb-2" {...attributes} {...listeners}>
        📦 {id}
      </h2>
      <SortableContext items={notes} strategy={verticalListSortingStrategy}>
        {notes.map((note) => (
          <SortableItem key={note.id} note={note} />
        ))}
      </SortableContext>
    </div>
  );
}

function SortableItem({ note }: { note: { id: string; value: string } }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ ...note, data: { type: "note" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="border p-2 my-1 bg-white cursor-pointer shadow-md"
    >
      {note.value}
    </div>
  );
}
