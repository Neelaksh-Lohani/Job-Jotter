import { CandidateData } from './types'

export const candidatesData: CandidateData[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    position: 'Senior Full Stack Developer',
    avgTimeToSolution: 23,
    successRate: 87,
    retryRate: 15,
    skills: [
      { name: 'SQL', score: 92, consistency: 88 },
      { name: 'Algorithms', score: 85, consistency: 82 },
      { name: 'System Design', score: 78, consistency: 75 },
      { name: 'Debugging', score: 90, consistency: 85 },
      { name: 'Frontend', score: 88, consistency: 90 },
      { name: 'Backend', score: 82, consistency: 80 },
      { name: 'Data Structures', score: 87, consistency: 83 },
      { name: 'API Design', score: 80, consistency: 78 }
    ],
    submissions: [
      {
        id: 's1',
        skill: 'SQL',
        score: 95,
        timeToSolution: 18,
        attempts: 2,
        runtime: 245,
        code: `SELECT u.name, COUNT(o.id) as order_count, 
       AVG(o.total_amount) as avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name
HAVING order_count > 0
ORDER BY avg_order_value DESC
LIMIT 10;`,
        problemStatement: 'Find the top 10 customers by average order value in the last 30 days, including their total order count.',
        errors: ['Syntax error on line 3', 'Fixed JOIN condition'],
        aiSuspected: false,
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 's2',
        skill: 'Algorithms',
        score: 88,
        timeToSolution: 35,
        attempts: 3,
        runtime: 156,
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        problemStatement: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
        errors: ['IndexError on line 6', 'Logic error in complement calculation', 'Fixed return statement'],
        aiSuspected: false,
        timestamp: '2024-01-15T11:15:00Z'
      },
      {
        id: 's3',
        skill: 'System Design',
        score: 75,
        timeToSolution: 45,
        attempts: 1,
        runtime: 0,
        code: `// High-level architecture for URL shortener
class URLShortener {
  constructor() {
    this.database = new Database();
    this.cache = new RedisCache();
    this.baseUrl = 'https://short.ly/';
  }
  
  async shortenUrl(longUrl) {
    const hash = this.generateHash(longUrl);
    await this.database.store(hash, longUrl);
    await this.cache.set(hash, longUrl, 3600);
    return this.baseUrl + hash;
  }
  
  async expandUrl(shortCode) {
    let longUrl = await this.cache.get(shortCode);
    if (!longUrl) {
      longUrl = await this.database.get(shortCode);
      await this.cache.set(shortCode, longUrl, 3600);
    }
    return longUrl;
  }
}`,
        problemStatement: 'Design a URL shortening service like bit.ly with high availability and low latency requirements.',
        errors: [],
        aiSuspected: true,
        timestamp: '2024-01-15T14:20:00Z'
      }
    ],
    reviewerFeedback: [
      {
        reviewer: 'Mike Johnson',
        skill: 'SQL',
        rating: 5,
        comment: 'Excellent query optimization and proper use of JOINs. Shows strong understanding of database performance.',
        timestamp: '2024-01-15T16:00:00Z'
      },
      {
        reviewer: 'Lisa Wang',
        skill: 'Algorithms',
        rating: 4,
        comment: 'Good solution with optimal time complexity. Could improve variable naming for better readability.',
        timestamp: '2024-01-15T16:30:00Z'
      },
      {
        reviewer: 'David Kim',
        skill: 'System Design',
        rating: 3,
        comment: 'Basic architecture is sound but lacks discussion of scalability concerns and edge cases. Possible AI assistance detected.',
        timestamp: '2024-01-15T17:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    position: 'Backend Engineer',
    avgTimeToSolution: 28,
    successRate: 79,
    retryRate: 22,
    skills: [
      { name: 'SQL', score: 88, consistency: 85 },
      { name: 'Algorithms', score: 82, consistency: 78 },
      { name: 'System Design', score: 85, consistency: 82 },
      { name: 'Debugging', score: 86, consistency: 83 },
      { name: 'Frontend', score: 65, consistency: 60 },
      { name: 'Backend', score: 91, consistency: 88 },
      { name: 'Data Structures', score: 84, consistency: 81 },
      { name: 'API Design', score: 89, consistency: 86 }
    ],
    submissions: [
      {
        id: 's4',
        skill: 'Backend',
        score: 93,
        timeToSolution: 22,
        attempts: 1,
        runtime: 89,
        code: `@app.route('/api/users/<int:user_id>/orders', methods=['GET'])
@auth_required
def get_user_orders(user_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        orders = Order.query.filter_by(user_id=user_id)\\
                     .order_by(Order.created_at.desc())\\
                     .paginate(page=page, per_page=per_page)
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': page,
                'pages': orders.pages,
                'total': orders.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500`,
        problemStatement: 'Create a REST API endpoint to fetch paginated user orders with proper error handling.',
        errors: [],
        aiSuspected: false,
        timestamp: '2024-01-16T09:15:00Z'
      }
    ],
    reviewerFeedback: [
      {
        reviewer: 'Sarah Mitchell',
        skill: 'Backend',
        rating: 5,
        comment: 'Excellent API design with proper pagination, authentication, and error handling. Production-ready code.',
        timestamp: '2024-01-16T10:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Emma Thompson',
    position: 'Frontend Developer',
    avgTimeToSolution: 31,
    successRate: 83,
    retryRate: 18,
    skills: [
      { name: 'SQL', score: 72, consistency: 70 },
      { name: 'Algorithms', score: 78, consistency: 75 },
      { name: 'System Design', score: 70, consistency: 68 },
      { name: 'Debugging', score: 85, consistency: 82 },
      { name: 'Frontend', score: 94, consistency: 91 },
      { name: 'Backend', score: 68, consistency: 65 },
      { name: 'Data Structures', score: 76, consistency: 73 },
      { name: 'API Design', score: 74, consistency: 71 }
    ],
    submissions: [
      {
        id: 's5',
        skill: 'Frontend',
        score: 96,
        timeToSolution: 25,
        attempts: 2,
        runtime: 0,
        code: `import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

const SearchableTable = ({ data, columns, onRowClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      columns.some(col =>
        String(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, columns]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="searchable-table">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => debouncedSearch(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                {sortConfig.key === col.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((row, index) => (
            <tr key={index} onClick={() => onRowClick?.(row)}>
              {columns.map(col => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchableTable;`,
        problemStatement: 'Create a reusable React component for a searchable and sortable data table with performance optimizations.',
        errors: ['Missing useEffect cleanup', 'Fixed debounce implementation'],
        aiSuspected: false,
        timestamp: '2024-01-16T13:45:00Z'
      }
    ],
    reviewerFeedback: [
      {
        reviewer: 'Tom Chen',
        skill: 'Frontend',
        rating: 5,
        comment: 'Outstanding React component with proper performance optimizations using useMemo and debouncing. Clean, reusable code.',
        timestamp: '2024-01-16T15:00:00Z'
      }
    ]
  }
]
