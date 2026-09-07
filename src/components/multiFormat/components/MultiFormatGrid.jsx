import DefaultTable from "../../common/defaultTable";
import useMultiFormatColumns from "../hooks/useMultiformatColumns";
import useMultiFormatData from "../hooks/useMultiFormatData";

export default function MultiFormatGrid() {

    const { columns } = useMultiFormatColumns();
    const { dataSource, loading } = useMultiFormatData();

    return (
        <DefaultTable
            columns={columns}
            data={dataSource}
            loading={loading}
        />
    );
}
