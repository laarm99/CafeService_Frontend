import { EyeFilled } from "@ant-design/icons";
import { Button, Flex, Space, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// El backend/mock manda codigos; el texto visible se resuelve con i18next.
const STATUS_COLORS = {
    SUBMITTED: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
    IN_REVIEW: 'blue',
    PENDING: 'orange',
};

export default function useMultiFormatColumns() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const columns = [
        {
            title: t('multiFormat.grid.id'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('multiFormat.grid.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: t('multiFormat.grid.fullName'),
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: t('multiFormat.grid.netkey'),
            dataIndex: 'netkey',
            key: 'netkey',
        },
        {
            title: t('multiFormat.grid.type'),
            dataIndex: 'movementType',
            key: 'movementType',
            render: (movementType) => (
                movementType ? t(`multiFormat.movement.${movementType}`) : '-'
            ),
        },
        {
            title: t('multiFormat.grid.approver'),
            dataIndex: 'approver',
            key: 'approver',
            render: (approver) => approver?.name ?? '-',
        },
        {
            title: t('multiFormat.grid.status'),
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                if (!status) return null;
                const color = STATUS_COLORS[status] ?? 'orange';

                return (
                    <Flex gap="small" align="center" wrap>
                        <Tag color={color}>
                            {t(`multiFormat.status.${status}`).toUpperCase()}
                        </Tag>
                    </Flex>
                );
            },
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('multiFormat.grid.view')}>
                        <Button
                            icon={<EyeFilled />}
                            onClick={() => navigate(`/multiFormat/${record.id}`)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return { columns };
}
