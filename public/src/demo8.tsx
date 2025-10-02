interface TableProps {
  columns: {
    title: string; // 表头显示文本
    key: string; // 对应 data 中的字段名
  }[];
  data: Record<string, any>[]; // 表格数据
}

const Table = (props: TableProps) => {
  const { columns, data } = props;
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key="rowIndex">
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
