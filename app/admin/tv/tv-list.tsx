import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPinHouseIcon, SmartphoneIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

type OrderDisplay = {
  id: string;
  cus_name: string;
  status: "TO_DO" | "ON_PROGRESS" | "COMPLETED";
  priority: number;
  phone_number?: string;
  address?: string;
  products: {
    prod_name: string;
    prod_img: string;
    unit: "PACKAGED_GOODS" | "CARTON";
    pack_spec: number;
    quantity: number;
  }[];
  created_at: Date;
  updated_at: Date;
};

const OrderGridItem = (data: OrderDisplay) => {
  const [showMore, setShowMore] = React.useState<boolean>(false);
  return (
    <div className="bg-white rounded-lg p-2 px-3 shadow-md">
      <div className="grid gap-1">
        <div className="flex flex-col min-[450px]:flex-row justify-between min-[450px]:items-center gap-2">
          <p className="lg:text-base text-sm text-muted-foreground">
            Tên KH:{" "}
            <span className="font-bold text-black text-base lg:text-lg">
              {data.cus_name}
            </span>
          </p>
          <p className="lg:text-base text-sm text-muted-foreground">
            Trạng thái:{" "}
            <span className="font-bold text-black">{data.status}</span>
          </p>
          <p className="lg:text-base text-sm text-muted-foreground">
            Ưu tiên:{" "}
            <span className="font-bold text-black">{data.priority}</span>
          </p>
        </div>
        {data.phone_number && (
          <div className="flex gap-2 items-center text-muted-foreground">
            <SmartphoneIcon className="size-4 shrink-0" />
            <p className="lg:text-base text-sm">{data.phone_number}</p>
          </div>
        )}

        {data.address && (
          <div className="flex gap-2 items-center text-muted-foreground">
            <MapPinHouseIcon className="size-4 shrink-0" />
            <p className="lg:text-base text-sm">{data.address}</p>
          </div>
        )}
      </div>
      <Separator className="my-1 h-4" />
      <p className="text-muted-foreground text-sm">
        Sản Phẩm ({data.products.length})
      </p>
      {showMore && (
        <div className="grid gap-2 mt-2">
          {data.products.map((product, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="relative shrink-0 rounded-lg aspect-square h-16 w-16 overflow-hidden">
                <Image
                  fill
                  src={product.prod_img}
                  alt={product.prod_name}
                  sizes="100vw"
                />
              </div>
              <div className="w-full text-muted-foreground">
                <p className="text-sm lg:text-base font-semibold">
                  {product.prod_name}
                </p>
                <p className="text-sm">
                  {product.quantity}{" "}
                  {product.unit == "CARTON" ? (
                    <span>
                      thùng{" "}
                      {`(${product.quantity} x ${product.pack_spec} = ${
                        product.quantity * product.pack_spec
                      } sản phẩm)`}
                    </span>
                  ) : (
                    <span>sản phẩm</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs lg:text-sm">
            Ngày tạo: 17/02/25 23:13
          </p>
          <p className="text-muted-foreground text-xs lg:text-sm">
            Ngày cập nhật: 17/02/25 23:13
          </p>
        </div>

        <button className="border text-sm lg:text-base border-blue-500 text-blue-500 hover:bg-sky-50 rounded-md px-2 p-0.5 cursor-pointer">
          <span>Sửa</span>
        </button>
      </div>
    </div>
  );
};

const TvList = ({
  mode,
  orders,
}: {
  mode: "list" | "grid";
  orders: OrderDisplay[];
}) => {
  if (mode == "grid")
    return (
      <div className="grid gap-2">
        {orders.map((order) => (
          <OrderGridItem key={order.id} {...order} />
        ))}
      </div>
    );

  return (
    <div className="bg-white rounded-lg p-2 px-3 shadow-md">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TvList;
