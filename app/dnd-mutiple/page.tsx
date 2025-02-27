// "use client";
// import React from "react";
// import {
//   closestCenter,
//   DndContext,
//   DragEndEvent,
//   useDroppable,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// type Note = {
//   id: string;
//   value: string;
// };

// type Product = {
//   id: string;
//   prod_name: string;
//   notes: Note[];
// };
// const INIT_PRODUCTS: Product[] = [
//   {
//     id: "1",
//     prod_name: "Face",
//     notes: [
//       {
//         id: "100",
//         value: "giao o SG",
//       },
//       {
//         id: "101",
//         value: "giao o ST",
//       },
//     ],
//   },
//   {
//     id: "2",
//     prod_name: "Serum",
//     notes: [
//       {
//         id: "102",
//         value: "giao o KG",
//       },
//       {
//         id: "103",
//         value: "giao o CT",
//       },
//     ],
//   },
// ];

// const NoteCard = ({ note }: { note: Note }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable(note);

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
//       style={style}
//     >
//       <h3 className="font-medium text-neutral-100">{note.value}</h3>
//     </div>
//   );
// };

// const ProductCard = ({ product }: { product: Product }) => {
//   const { setNodeRef } = useDroppable({ id: product.id });
//   return (
//     <div ref={setNodeRef} className="bg-lime-300 grid gap-2 p-2">
//       <h3>{product.prod_name}</h3>
//       {product.notes.map((note) => (
//         <NoteCard key={note.id} note={note} />
//       ))}
//     </div>
//   );
// };

// const DndMutiplePage = () => {
//   const [products, setProducts] = React.useState<Product[]>(INIT_PRODUCTS);

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event;
//     if (!over) return;

//     // Nếu bạn muốn phân biệt giữa note và product, hãy đặt convention cho id
//     // Ví dụ: product có id dạng "product-1", note có id dạng "note-100"
//     const activeId = active.id.toString();
//     const overId = over.id.toString();

//     // Giả sử: Nếu activeId bắt đầu bằng "product-" thì nó là product
//     if (activeId.startsWith("product-")) {
//       // Xử lý sắp xếp product
//       const oldIndex = products.findIndex(
//         (p) => `product-${p.id}` === activeId
//       );
//       const newIndex = products.findIndex((p) => `product-${p.id}` === overId);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         setProducts(arrayMove(products, oldIndex, newIndex));
//       }
//       return;
//     }

//     // Nếu activeId không phải product thì nó là note.
//     // Ta cần tìm product chứa note đang được kéo
//     const sourceProductIndex = products.findIndex((product) =>
//       product.notes.some((note) => note.id === activeId)
//     );
//     if (sourceProductIndex === -1) return;

//     const sourceProduct = products[sourceProductIndex];
//     const note = sourceProduct.notes.find((n) => n.id === activeId);
//     if (!note) return;

//     // Xác định product đích: có thể over.id là note của product khác hay chính container của product đó.
//     // Kiểm tra nếu over.id thuộc về 1 note nào đó:
//     let destinationProductIndex = products.findIndex((product) =>
//       product.notes.some((n) => n.id === overId)
//     );
//     // Nếu không tìm thấy, thử so sánh với id của product (nếu bạn render container với id = product.id)
//     if (destinationProductIndex === -1) {
//       destinationProductIndex = products.findIndex(
//         (product) => product.id === overId
//       );
//     }

//     // Nếu di chuyển giữa các product khác nhau
//     if (
//       destinationProductIndex !== -1 &&
//       destinationProductIndex !== sourceProductIndex
//     ) {
//       const destinationProduct = products[destinationProductIndex];
//       // Xác định vị trí chèn trong destinationProduct: nếu over.id là note, lấy index của note đó
//       let destinationIndex = destinationProduct.notes.findIndex(
//         (n) => n.id === overId
//       );
//       if (destinationIndex === -1) {
//         destinationIndex = destinationProduct.notes.length; // chèn cuối cùng nếu không xác định được
//       }
//       // Loại bỏ note khỏi product nguồn
//       const newSourceNotes = sourceProduct.notes.filter(
//         (n) => n.id !== note.id
//       );
//       // Chèn note vào product đích tại vị trí xác định
//       const newDestinationNotes = [
//         ...destinationProduct.notes.slice(0, destinationIndex),
//         note,
//         ...destinationProduct.notes.slice(destinationIndex),
//       ];
//       // Cập nhật state cho cả 2 product
//       setProducts((prev) => {
//         const newProducts = [...prev];
//         newProducts[sourceProductIndex] = {
//           ...sourceProduct,
//           notes: newSourceNotes,
//         };
//         newProducts[destinationProductIndex] = {
//           ...destinationProduct,
//           notes: newDestinationNotes,
//         };
//         return newProducts;
//       });
//     } else {
//       // Nếu kéo trong cùng 1 product: sử dụng arrayMove để sắp xếp lại thứ tự note
//       const oldIndex = sourceProduct.notes.findIndex((n) => n.id === activeId);
//       const newIndex = sourceProduct.notes.findIndex((n) => n.id === overId);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         const newNotes = arrayMove(sourceProduct.notes, oldIndex, newIndex);
//         setProducts((prev) => {
//           const newProducts = [...prev];
//           newProducts[sourceProductIndex] = {
//             ...sourceProduct,
//             notes: newNotes,
//           };
//           return newProducts;
//         });
//       }
//     }
//   }

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <div className="mx-auto max-w-5xl p-2 mt-10 bg-sky-500 rounded-md">
//         <h3>Dnd kit Sort Mutiple Container</h3>
//         <div className="bg-amber-200 p-2 grid gap-3">
//           {products.map((product) => (
//             <SortableContext
//               key={product.id}
//               items={product.notes}
//               strategy={verticalListSortingStrategy}
//             >
//               <ProductCard product={product} />
//             </SortableContext>
//           ))}
//         </div>
//       </div>
//     </DndContext>
//   );
// };

// export default DndMutiplePage;
"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      { id: "100", value: "giao o SG" },
      { id: "101", value: "giao o ST" },
    ],
  },
  {
    id: "2",
    prod_name: "Serum",
    notes: [
      { id: "102", value: "giao o KG" },
      { id: "103", value: "giao o CT" },
    ],
  },
];

const NoteCard = ({ note }: { note: Note }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: note.id,
      animateLayoutChanges: (args) => defaultAnimateLayoutChanges(args),
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
    >
      <h3 className="font-medium text-neutral-100">{note.value}</h3>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-lime-300 grid gap-2 p-2">
      <h3>{product.prod_name}</h3>
      {/* SortableContext riêng cho các note */}
      <SortableContext
        items={product.notes}
        strategy={verticalListSortingStrategy}
      >
        {product.notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </SortableContext>
    </div>
  );
};

const SortableProductCard = ({ product }: { product: Product }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: product.id,
      animateLayoutChanges: (args) => defaultAnimateLayoutChanges(args),
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ProductCard product={product} />
    </div>
  );
};

const DndMultiplePage = () => {
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Xác định xem phần tử đang được kéo là product hay note
  const activeItem =
    activeId &&
    (products.find((p) => p.id === activeId) ||
      products
        .find((p) => p.notes.some((n) => n.id === activeId))
        ?.notes.find((n) => n.id === activeId));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    // Xử lý sắp xếp product
    const activeProductIndex = products.findIndex((p) => p.id === activeId);
    const overProductIndex = products.findIndex((p) => p.id === overId);
    if (
      activeProductIndex !== -1 &&
      overProductIndex !== -1 &&
      activeProductIndex !== overProductIndex
    ) {
      setProducts(arrayMove(products, activeProductIndex, overProductIndex));
      return;
    }

    // Xử lý sắp xếp note
    let sourceProductIndex = -1;
    let destinationProductIndex = -1;
    let activeNoteIndex = -1;
    let overNoteIndex = -1;
    for (let i = 0; i < products.length; i++) {
      const noteIndex = products[i].notes.findIndex(
        (note) => note.id === activeId
      );
      if (noteIndex !== -1) {
        sourceProductIndex = i;
        activeNoteIndex = noteIndex;
      }
      const oIndex = products[i].notes.findIndex((note) => note.id === overId);
      if (oIndex !== -1) {
        destinationProductIndex = i;
        overNoteIndex = oIndex;
      }
    }
    if (sourceProductIndex === -1 || destinationProductIndex === -1) return;
    const sourceProduct = products[sourceProductIndex];
    const destinationProduct = products[destinationProductIndex];
    const activeNote = sourceProduct.notes[activeNoteIndex];
    if (sourceProductIndex === destinationProductIndex) {
      // Sắp xếp lại thứ tự note trong cùng một product
      const newNotes = arrayMove(
        sourceProduct.notes,
        activeNoteIndex,
        overNoteIndex
      );
      setProducts((prev) => {
        const newProducts = [...prev];
        newProducts[sourceProductIndex] = { ...sourceProduct, notes: newNotes };
        return newProducts;
      });
    } else {
      // Di chuyển note giữa các product
      const newSourceNotes = [...sourceProduct.notes];
      newSourceNotes.splice(activeNoteIndex, 1);
      const newDestinationNotes = [...destinationProduct.notes];
      newDestinationNotes.splice(overNoteIndex, 0, activeNote);
      setProducts((prev) => {
        const newProducts = [...prev];
        newProducts[sourceProductIndex] = {
          ...sourceProduct,
          notes: newSourceNotes,
        };
        newProducts[destinationProductIndex] = {
          ...destinationProduct,
          notes: newDestinationNotes,
        };
        return newProducts;
      });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto max-w-5xl p-2 mt-10 bg-sky-500 rounded-md">
        <h3>Dnd kit Sort Multiple Container</h3>
        <SortableContext
          items={products}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-amber-200 p-2 grid gap-3">
            {products.map((product) => (
              <SortableProductCard key={product.id} product={product} />
            ))}
          </div>
        </SortableContext>
      </div>
      <DragOverlay>
        {activeId && (
          <div className="rounded-lg bg-white p-4 shadow-md">
            {/* Hiển thị nội dung DragOverlay dựa vào activeItem */}
            {typeof activeItem === "string"
              ? activeItem
              : (activeItem as any)?.prod_name || (activeItem as any)?.value}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DndMultiplePage;
