import { EyeFilled } from "@ant-design/icons";
import { Button, Flex, Space, Tag } from "antd";
import RequisitionForm from "../components/MultiFormatForm";
import { useNavigate } from "react-router-dom";


export default function useRequisitionColumns() {
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Id formato',
            dataIndex: 'id',
            key: 'id',
            // render: text => <a>{text}</a>,
        },
        {
            title: 'Fecha de creacion',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Nombre',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Netkey',
            dataIndex: 'netkey',
            key: 'netkey',
        },
        {
            title: 'Tipo de formato',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Estatus',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {

                const color = status.toUpperCase() === 'APROBADO' ? 'green' : status.toUpperCase() === 'RECHAZADO' ? 'red' : 'orange';

                return (
                    <Flex gap="small" align="center" wrap>
                        <Tag color={color}>
                            {status?.toUpperCase()}
                        </Tag>
                    </Flex>
                );
            },
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="medium">
                    <Button
                        icon={<EyeFilled />}
                        //onClick={() => navigate(`/requisition/${record.id}`)}
                    />
                </Space>
            ),
        },
    ];

    return { columns };
}
