import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    byCategory: [],
    byMonth: []
  });

  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    axios.get('/expenses/summary')
      .then((r) => setSummary(r.data))
      .catch((e) => console.log(e));

    axios.get('/expenses')
      .then((r) => setRecentExpenses(r.data.slice(0, 5)))
      .catch((e) => console.log(e));
  }, []);

  const total = summary.byMonth.reduce(
    (s, m) => s + parseFloat(m.total),
    0
  );

  const thisMonth = summary.byMonth[0]?.total || 0;

  return (
    <div style={styles.page}>

      <h2 style={styles.heading}>
        👋 Welcome, {user?.name}!
      </h2>

      <div style={styles.statRow}>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>This Month</div>
          <div style={styles.statValue}>
            Rs. {parseFloat(thisMonth).toLocaleString()}
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statLabel }}>
            Total Spent
          </div>

          <div style={{
            ...styles.statValue,
            color: '#dc2626'
          }}>
            Rs. {total.toLocaleString()}
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Categories</div>

          <div style={styles.statValue}>
            {summary.byCategory.length}
          </div>
        </div>

      </div>

      <div style={styles.chartRow}>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            Spending by Category
          </h3>

          {summary.byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>

                <Pie
                  data={summary.byCategory}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >

                  {summary.byCategory.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={entry.color || '#94a3b8'}
                    />
                  ))}

                </Pie>

                <Tooltip
                  formatter={(v) => [
                    `Rs. ${Number(v).toLocaleString()}`,
                    'Amount'
                  ]}
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>
              No data yet — add an expense
            </p>
          )}

        </div>

        <div style={styles.chartCard}>

          <h3 style={styles.chartTitle}>
            Monthly Spending
          </h3>

          {summary.byMonth.length > 0 ? (

            <ResponsiveContainer width="100%" height={260}>

              <BarChart data={[...summary.byMonth].reverse()}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />

                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip
                  formatter={(v) =>
                    `Rs. ${parseFloat(v).toLocaleString()}`
                  }
                />

                <Bar
                  dataKey="total"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Amount"
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (
            <p style={styles.noData}>No data yet</p>
          )}

        </div>

      </div>

      <div style={styles.recentCard}>

        <h3 style={styles.chartTitle}>
          Recent Expenses
        </h3>

        {recentExpenses.map((exp) => (

          <div key={exp.id} style={styles.recentItem}>

            <div
              style={{
                ...styles.dot,
                background: exp.category_color || '#94a3b8'
              }}
            />

            <span style={styles.rTitle}>
              {exp.title}
            </span>

            <span style={styles.rDate}>
              {exp.date?.split('T')[0]}
            </span>

            <span style={styles.rAmount}>
              Rs. {parseFloat(exp.amount).toLocaleString()}
            </span>

          </div>

        ))}

        {recentExpenses.length === 0 && (
          <p style={styles.noData}>
            No expenses yet. Add some!
          </p>
        )}

      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px'
  },

  heading: {
    color: '#1e293b',
    marginBottom: '24px'
  },

  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '16px',
    marginBottom: '24px'
  },

  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    textAlign: 'center'
  },

  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '8px'
  },

  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b'
  },

  chartRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },

  chartCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
  },

  chartTitle: {
    color: '#334155',
    marginBottom: '16px',
    fontSize: '15px'
  },

  noData: {
    color: '#94a3b8',
    fontSize: '14px'
  },

  recentCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
  },

  recentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9'
  },

  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },

  rTitle: {
    flex: 1,
    fontSize: '14px',
    color: '#1e293b'
  },

  rDate: {
    fontSize: '12px',
    color: '#94a3b8'
  },

  rAmount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a'
  }
};