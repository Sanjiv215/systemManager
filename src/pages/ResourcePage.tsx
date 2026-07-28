import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowDownUp, Search } from 'lucide-react'
import { api, buildQuery, type ApiList } from '../api/client'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'

export type ResourceConfig = {
  title: string
  description: string
  endpoint: string
  columns: Array<{ key: string; label: string; render?: (item: Record<string, unknown>, key: string) => ReactNode }>
}

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const [data, setData] = useState<ApiList<Record<string, unknown>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const query = useMemo(() => buildQuery({ page, limit: 10, search, sortBy, sortOrder }), [page, search, sortBy, sortOrder])

  async function load() {
    setLoading(true)
    setError('')
    try {
      setData(await api<ApiList<Record<string, unknown>>>(`${config.endpoint}${query}`))
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to load ${config.title.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [config.endpoint, query])

  function sort(column: string) {
    setSortBy(column)
    setSortOrder(sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <section className="panel full-panel">
      <div className="panel-title">
        <div>
          <h2>{config.title}</h2>
          <span>{config.description}</span>
        </div>
      </div>
      <div className="resource-tools">
        <div className="search compact-search">
          <Search size={16} />
          <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value) }} placeholder="Search records" />
        </div>
      </div>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {!loading && !error && data && !data.items.length ? <EmptyState title={`No ${config.title.toLowerCase()} records found`} /> : null}
      {!loading && !error && data?.items.length ? (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key}>
                      <button className="table-sort" type="button" onClick={() => sort(column.key)}>
                        {column.label}
                        <ArrowDownUp size={13} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={String(item._id)}>
                    {config.columns.map((column) => (
                      <td key={column.key}>{column.render ? column.render(item, column.key) : String(item[column.key] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="secondary-button compact" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} type="button">Previous</button>
            <span>Page {data.page} of {Math.max(data.totalPages, 1)}</span>
            <button className="secondary-button compact" disabled={page >= data.totalPages} onClick={() => setPage((value) => value + 1)} type="button">Next</button>
          </div>
        </>
      ) : null}
    </section>
  )
}
