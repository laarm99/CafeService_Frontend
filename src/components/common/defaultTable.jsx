import { Table } from "antd";

export default function DefaultTable({columns,data }) {

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
            />
        </>
    )
}