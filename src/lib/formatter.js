const formatter = module.exports;

formatter.formatRow = (row) => {
  if (!row) return row;
  if (row.createdAt instanceof Date) row.createdAt = row.createdAt.toISOString();
  if (row.expiresAt instanceof Date) row.expiresAt = row.expiresAt.toISOString();
  if (typeof row.computedAsyncapi === 'string') {
    try {
      row.computedAsyncapi = JSON.parse(row.computedAsyncapi);
    } catch {}
  }
  Object.keys(row).forEach(key => {
    if (typeof row[key] === 'object' && row[key] !== null) row[key] = formatter.formatRow(row[key]);
    if (Array.isArray(row[key])) row[key] = formatter.formatList(row[key]);
  });
  return row;
};

formatter.formatList = (list) => {
  if (Array.isArray(list)) return list.map(formatter.formatRow);
  return list;
};
