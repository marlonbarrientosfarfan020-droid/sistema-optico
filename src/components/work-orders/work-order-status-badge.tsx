import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }
> = {
  PENDING: { label: "Pendiente de Taller", variant: "warning" },
  IN_LAB: { label: "En Biselado / Taller", variant: "info" },
  LAB_COMPLETED: { label: "Control de Calidad OK", variant: "default" },
  READY_FOR_PICKUP: { label: "Listo para Entrega", variant: "success" },
  DELIVERED: { label: "Entregado al Paciente", variant: "secondary" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
};

export function WorkOrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
