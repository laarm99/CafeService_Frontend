import { Flex, Space, Table, Tag } from "antd";
import DefaultTable from "../../common/defaultTable";
import useRequisitionColumns from "../hooks/useMultiformatColumns";
import useMultiFormatData from "../hooks/useMultiFormatData";

export default function MultiFormatGrid() {

    const { columns } = useRequisitionColumns();
    const { dataSource } = useMultiFormatData();
    
    return (
        <>
            <DefaultTable
                columns={columns}
                data={dataSource}
            />
        </>
    )
}