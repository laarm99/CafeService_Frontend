import { Table } from "antd";

export default function DefaultTable({ columns, data, loading = false, rowKey = "key", ...props }) {

    return (
        <Table
            {...props}
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={rowKey}
        />
    )
}
