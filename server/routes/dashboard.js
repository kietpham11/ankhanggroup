import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats - Số liệu tổng quan cho Dashboard Admin
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalProperties,
      totalContacts,
      pendingContacts,
      totalPosts,
      totalProjects,
      projectStatusGroup,
      topPropertiesQuery,
      contactsInRange,
      allContacts
    ] = await Promise.all([
      prisma.property.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'PENDING' } }),
      prisma.post.count({ where: { published: true } }),
      prisma.project.count(),
      prisma.project.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      prisma.property.findMany({
        take: 5,
        include: { _count: { select: { contacts: true } } },
        orderBy: { contacts: { _count: 'desc' } }
      }),
      prisma.contact.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, status: true }
      }),
      prisma.contact.findMany({
        select: { createdAt: true }
      })
    ]);

    // 1. Process contacts report (Pending vs Resolved over time)
    const contactsReportMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      contactsReportMap[dateStr] = { name: dateStr, PENDING: 0, RESOLVED: 0 };
    }
    
    contactsInRange.forEach(c => {
      const d = new Date(c.createdAt);
      const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      if (contactsReportMap[dateStr]) {
        contactsReportMap[dateStr][c.status]++;
      }
    });
    const contactsReport = Object.values(contactsReportMap);

    // 2. Format Project Status
    const projectStatusDistribution = projectStatusGroup.map(g => ({
      name: g.status || 'Chưa xác định',
      value: g._count.id
    }));

    // 3. Format Top Properties
    const topProperties = topPropertiesQuery.map(p => ({
      id: p.id,
      name: p.title,
      status: p.status === 'AVAILABLE' ? 'Đang mở bán' : p.status,
      views: p._count.contacts // mock views as contacts
    }));

    // 4. Revenue / Transactions (Simulated by contacts per month for the last 6 months)
    const revenueMap = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = `Tháng ${d.getMonth() + 1}`;
      months.push(mStr);
      revenueMap[mStr] = 0;
    }
    allContacts.forEach(c => {
      const mStr = `Tháng ${new Date(c.createdAt).getMonth() + 1}`;
      if (revenueMap[mStr] !== undefined) revenueMap[mStr]++;
    });
    const revenueData = months.map(m => ({ name: m, value: revenueMap[m] }));

    // 5. Traffic Data (Mocked but proportional to totalContacts)
    const base = Math.max(10, totalContacts);
    const trafficData = [
      { subject: 'Facebook', A: Math.round(base * 0.4), fullMark: base },
      { subject: 'Google', A: Math.round(base * 0.3), fullMark: base },
      { subject: 'Zalo', A: Math.round(base * 0.15), fullMark: base },
      { subject: 'Giới thiệu', A: Math.round(base * 0.1), fullMark: base },
      { subject: 'Khác', A: Math.round(base * 0.05), fullMark: base },
    ];

    res.json({
      stats: {
        totalProperties,
        totalContacts,
        pendingContacts,
        totalPosts,
        totalProjects,
        totalUsers: totalProperties,
      },
      contactsReport,
      projectStatusDistribution,
      topProperties,
      revenueData,
      trafficData,
      timeframe: days
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy số liệu dashboard.' });
  }
});

export default router;
