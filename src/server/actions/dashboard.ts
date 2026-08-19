"use server";

import { prisma } from "@/lib/prisma";
import { round2 } from "@/lib/utils";

export async function getDashboardMetrics() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Pacientes Atendidos (Total real de pacientes en BD)
    const totalPatients = await prisma.patient.count();

    // 2. En Taller / Biselado (Total de órdenes de trabajo activas en taller)
    const inLabOrdersCount = await prisma.workOrder.count({
      where: {
        status: { in: ["PENDING", "IN_LAB", "LAB_COMPLETED", "READY_FOR_PICKUP"] },
      },
    });

    // 3. Ventas del Mes (Suma real de ventas realizadas en el mes actual)
    const monthSales = await prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: { totalAmount: true },
    });
    const totalMonthSales = round2(monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0));

    // 4. Saldos por Cobrar (Suma real de saldos pendientes de pago)
    const pendingSales = await prisma.sale.findMany({
      where: {
        balanceDue: { gt: 0 },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: { balanceDue: true },
    });
    const totalBalanceDue = round2(pendingSales.reduce((acc, s) => acc + Number(s.balanceDue), 0));
    const pendingPatientsCount = pendingSales.length;

    // 5. Órdenes de Trabajo Reales en Taller
    const recentWorkOrders = await prisma.workOrder.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        frameProduct: true,
        lensProduct: true,
      },
    });

    // 6. Ingresos Semanales Reales (Últimos 7 días)
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: startOfWeek },
      },
      select: { amount: true, createdAt: true },
    });

    const daysMap: { [key: string]: number } = {};
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const weeklyRevenue: { day: string; fullDate: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().split("T")[0];
      const dayName = dayNames[d.getDay()];
      daysMap[dayKey] = 0;
      weeklyRevenue.push({ day: dayName, fullDate: dayKey, total: 0 });
    }

    payments.forEach((p) => {
      const pKey = new Date(p.createdAt).toISOString().split("T")[0];
      if (daysMap[pKey] !== undefined) {
        daysMap[pKey] += Number(p.amount);
      }
    });

    weeklyRevenue.forEach((item) => {
      item.total = round2(daysMap[item.fullDate] || 0);
    });

    return {
      totalPatients,
      inLabOrdersCount,
      totalMonthSales,
      totalBalanceDue,
      pendingPatientsCount,
      recentWorkOrders,
      weeklyRevenue,
    };
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    return {
      totalPatients: 0,
      inLabOrdersCount: 0,
      totalMonthSales: 0,
      totalBalanceDue: 0,
      pendingPatientsCount: 0,
      recentWorkOrders: [],
      weeklyRevenue: [],
    };
  }
}
