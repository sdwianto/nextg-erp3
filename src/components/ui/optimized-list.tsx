import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Skeleton } from './skeleton';

interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
  width?: number | string;
  itemHeight?: number;
  itemWidth?: number | string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingComponent?: React.ReactNode;
}

// Optimized list item component with memoization
const OptimizedListItem = memo<{
  item: any;
  index: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  style: React.CSSProperties;
}>(({ item, index, renderItem, style }) => {
  return (
    <div style={style}>
      {renderItem(item, index)}
    </div>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

// Main optimized list component
export const OptimizedList = memo(<T extends any>({
  items,
  renderItem,
  height = 400,
  width = '100%',
  itemHeight = 60,
  itemWidth = '100%',
  loading = false,
  emptyMessage = 'No items found',
  className = '',
  onLoadMore,
  hasMore = false,
  loadingComponent
}: OptimizedListProps<T>) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [listHeight, setListHeight] = useState(height);

  // Memoize the item renderer to prevent unnecessary re-renders
  const itemRenderer = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    if (!item) return null;

    return (
      <OptimizedListItem
        item={item}
        index={index}
        renderItem={renderItem}
        style={style}
      />
    );
  }, [items, renderItem]);

  // Handle infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore || loading) return;

    const handleScroll = (event: any) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const threshold = 100; // pixels from bottom

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore();
      }
    };

    // Add scroll listener to the list container
    const listContainer = document.querySelector('.optimized-list-container');
    if (listContainer) {
      listContainer.addEventListener('scroll', handleScroll);
      return () => listContainer.removeEventListener('scroll', handleScroll);
    }
  }, [onLoadMore, hasMore, loading]);

  // Calculate dynamic height
  useEffect(() => {
    const calculateHeight = () => {
      const container = document.querySelector('.optimized-list-container');
      if (container) {
        const containerHeight = container.clientHeight;
        setListHeight(Math.max(containerHeight, height));
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [height]);

  // Memoize the list component
  const listComponent = useMemo(() => {
    if (loading && items.length === 0) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <List
        height={listHeight}
        width={width}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={items}
      >
        {itemRenderer}
      </List>
    );
  }, [items, loading, listHeight, width, itemHeight, emptyMessage, itemRenderer]);

  return (
    <div className={`optimized-list-container ${className}`}>
      {listComponent}
      {loading && hasMore && (
        <div className="flex justify-center p-4">
          {loadingComponent || <Skeleton className="h-8 w-8 rounded-full" />}
        </div>
      )}
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

// Optimized table component for better performance
interface OptimizedTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render: (item: T, index: number) => React.ReactNode;
    width?: number;
  }[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  selectedRow?: number;
}

export const OptimizedTable = memo(<T extends any>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  selectedRow
}: OptimizedTableProps<T>) => {
  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="animate-pulse">
          {columns.map((col, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ));
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr
        key={index}
        className={`hover:bg-muted/50 transition-colors ${
          selectedRow === index ? 'bg-muted' : ''
        } ${onRowClick ? 'cursor-pointer' : ''}`}
        onClick={() => onRowClick?.(item, index)}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className="px-4 py-3 border-b"
            style={{ width: column.width }}
          >
            {column.render(item, index)}
          </td>
        ))}
      </tr>
    ));
  }, [data, columns, loading, emptyMessage, selectedRow, onRowClick]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-medium text-muted-foreground"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
});

OptimizedTable.displayName = 'OptimizedTable';
