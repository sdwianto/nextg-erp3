import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  width?: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

function VirtualList<T>({
  items,
  height,
  width,
  itemHeight,
  renderItem,
  className,
  overscanCount = 5
}: VirtualListProps<T>) {
  const itemData = useMemo(() => ({ items, renderItem }), [items, renderItem]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const { items, renderItem } = itemData;
    const item = items[index];
    
    if (!item) return null;
    
    return (
      <div style={style} className="px-4 py-2">
        {renderItem(item, index)}
      </div>
    );
  }, [itemData]);

  return (
    <div className={cn("w-full", className)}>
      <List
        height={height}
        width={width || 400}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscanCount}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {Row}
      </List>
    </div>
  );
}

export { VirtualList };
