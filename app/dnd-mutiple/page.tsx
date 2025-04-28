"use client";
import React from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusIcon, Trash2Icon } from "lucide-react";
import generateId from "@/utils/generateId";

type Note = {
  id: string;
  value: string;
};

type Product = {
  id: string;
  prod_name: string;
  notes: Note[];
};
const INIT_PRODUCTS: Product[] = [
  {
    id: "1",
    prod_name: "Face",
    notes: [
      {
        id: "100",
        value: "giao o SG",
      },
      {
        id: "101",
        value: "giao o ST",
      },
    ],
  },
  {
    id: "2",
    prod_name: "Serum",
    notes: [
      {
        id: "102",
        value: "giao o KG",
      },
      {
        id: "103",
        value: "giao o CT",
      },
    ],
  },
];

const NoteCard = ({
  note,
  onDeleteNote,
}: {
  note: Note;
  onDeleteNote: () => void;
}) => {
  // const { attributes, listeners, setNodeRef, transform, transition } =
  //   useSortable(note);

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };
  return (
    <div className="flex items-center gap-2">
      <div className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md w-full">
        <p className="font-medium text-neutral-100">{note.value}</p>
      </div>
      <button type="button" onClick={onDeleteNote} className="cursor-pointer">
        <Trash2Icon className="h-5 w-5 shrink-0" />
      </button>
    </div>
  );
};

const ProductCard = ({
  product,
  onDeleteProduct,
  onAddNote,
  onDeleteNote,
}: {
  product: Product;
  onDeleteProduct: (prodId: string) => void;
  onAddNote: (prodId: string) => void;
  onDeleteNote: (prodId: string, noteId: string) => void;
}) => {
  const [editMode, setEditMode] = React.useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    data: {
      type: "product",
      product,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-lime-300 grid gap-2 p-2 relative opacity-40 [&>*]:opacity-0 border-2 border-rose-500 rounded-md"
      >
        <h3>{product.prod_name}</h3>
        {product.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDeleteNote={() => onDeleteNote(product.id, note.id)}
          />
        ))}
      </div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-lime-300 grid gap-2 p-2 relative rounded-md"
    >
      <h3>{product.prod_name}</h3>
      <input
        onClick={() => setEditMode(true)}
        onBlur={() => setEditMode(false)}
        placeholder="test"
      />
      <div className="absolute top-2 right-2 flex gap-2 items-center">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => onAddNote(product.id)}
        >
          <PlusIcon className="w-5 h-5 shrink-0" />
        </button>
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => onDeleteProduct(product.id)}
        >
          <Trash2Icon className="w-5 h-5 shrink-0" />
        </button>
        <button
          type="button"
          className="cursor-grab"
          // {...attributes}
          // {...listeners}
        >
          <GripVertical className="w-5 h-5 shrink-0" />
        </button>
      </div>
      <div className="grid gap-2">
        {product.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDeleteNote={() => onDeleteNote(product.id, note.id)}
          />
        ))}
      </div>
    </div>
  );
};

function DragOverlayWrapper({
  draggingProduct,
}: {
  draggingProduct: Product | null;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <DragOverlay>
      {draggingProduct && (
        <ProductCard
          product={draggingProduct}
          onDeleteProduct={() => {}}
          onAddNote={() => {}}
          onDeleteNote={() => {}}
        />
      )}
    </DragOverlay>,
    document.body
  );
}

const DndMutiplePage = () => {
  const [products, setProducts] = React.useState<Product[]>(INIT_PRODUCTS);
  const [draggingProduct, setDraggingProduct] = React.useState<Product | null>(
    null
  );

  const productIds = React.useMemo(() => {
    return products.map(({ id }) => id);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // keo chuột 1 đoạn khoảng 3px thì dragg
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (active.data.current?.type == "product") {
      setDraggingProduct(active.data.current.product);
      return;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId == overId) return;

    setProducts((prev) => {
      const activeProductIdx = prev.findIndex((prod) => prod.id == activeId);
      const overProductIdx = prev.findIndex((prod) => prod.id == overId);

      return arrayMove(prev, activeProductIdx, overProductIdx);
    });
  }

  function handleDeleteProduct(prodId: string) {
    setProducts((prev) => prev.filter(({ id }) => id != prodId));
  }

  function handleAddNote(prodId: string) {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id == prodId
          ? {
              ...prod,
              notes: [...prod.notes, { id: generateId(), value: "" }],
            }
          : prod
      )
    );
  }

  function handleDeleteNote(prodId: string, noteId: string) {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id == prodId
          ? {
              ...prod,
              notes: prod.notes.filter(({ id }) => id != noteId),
            }
          : prod
      )
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto max-w-5xl p-2 mt-10 bg-sky-500 rounded-md">
        <h3>Dnd kit Sort Mutiple Container</h3>
        <div className="bg-amber-200 p-2 grid gap-3 rounded-md">
          <SortableContext items={productIds}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDeleteProduct={handleDeleteProduct}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            ))}
          </SortableContext>
          <DragOverlayWrapper draggingProduct={draggingProduct} />
        </div>
      </div>
    </DndContext>
  );
};

export default DndMutiplePage;
