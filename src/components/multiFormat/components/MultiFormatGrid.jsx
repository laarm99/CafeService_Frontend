import { useEffect, useState } from "react";
import { Button, Col, DatePicker, Input, Row, Select } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import DefaultTable from "../../common/defaultTable";
import useMultiFormatColumns from "../hooks/useMultiformatColumns";
import useMultiFormatData from "../hooks/useMultiFormatData";
import { FORM_TYPE_BY_ID, STATUS_BY_ID } from "../mappers/multiFormat.mapper";
import styles from "../styles/MultiFormatGrid.module.css";

const API_DATE = "YYYY-MM-DD";
const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const INITIAL_QUERY = {
    formType: undefined,
    status: undefined,
    range: null,
    search: "",
    page: 1,
    pageSize: 10,
};

export default function MultiFormatGrid() {
    const { t } = useTranslation();
    const { columns } = useMultiFormatColumns();

    // Los filtros y la pagina viajan juntos: al cambiar un filtro la pagina vuelve a 1
    const [query, setQuery] = useState(INITIAL_QUERY);
    const [searchText, setSearchText] = useState("");

    // Debounce simple del buscador, sin dependencias nuevas
    useEffect(() => {
        const normalized = searchText.trim();
        if (normalized === query.search) return undefined;

        const timer = setTimeout(() => {
            setQuery((current) => ({ ...current, search: normalized, page: 1 }));
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [searchText, query.search]);

    const params = {
        page: query.page,
        pageSize: query.pageSize,
        formType: query.formType,
        status: query.status,
        startDate: query.range?.[0]?.format(API_DATE),
        endDate: query.range?.[1]?.format(API_DATE),
        search: query.search || undefined,
    };

    const { dataSource, pagination, loading } = useMultiFormatData(params);

    const changeFilter = (changes) => setQuery((current) => ({ ...current, ...changes, page: 1 }));

    const clearFilters = () => {
        setSearchText("");
        setQuery(INITIAL_QUERY);
    };

    const typeOptions = Object.entries(FORM_TYPE_BY_ID)
        .filter(([, code]) => code !== "CHANGE_DEP_SHIFT")
        .map(([id, code]) => ({
            value: Number(id),
            label: t(`multiFormat.movement.${code}`),
        }));

    const statusOptions = Object.entries(STATUS_BY_ID).map(([id, code]) => ({
        value: Number(id),
        label: t(`multiFormat.status.${code}`),
    }));

    // Fechas predefinidas; para agregar otra basta con sumar un elemento
    const rangePresets = [
        { label: t("multiFormat.filters.today"), value: [dayjs(), dayjs()] },
        { label: t("multiFormat.filters.thisWeek"), value: [dayjs().startOf("week"), dayjs().endOf("week")] },
        { label: t("multiFormat.filters.thisMonth"), value: [dayjs().startOf("month"), dayjs().endOf("month")] },
    ];

    const hasFilters = Boolean(
        query.formType || query.status || query.range || query.search || searchText
    );

    return (
        <>
            <Row gutter={[12, 12]} className={styles.filters} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12} lg={7}>
                    <Input
                        allowClear
                        size="large"
                        prefix={<SearchOutlined />}
                        placeholder={t("multiFormat.filters.searchPlaceholder")}
                        value={searchText}
                        maxLength={100}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </Col>

                <Col xs={24} md={12} lg={5}>
                    <Select
                        allowClear
                        size="large"
                        placeholder={t("multiFormat.filters.type")}
                        options={typeOptions}
                        value={query.formType}
                        onChange={(value) => changeFilter({ formType: value })}
                    />
                </Col>

                <Col xs={24} md={12} lg={4}>
                    <Select
                        allowClear
                        size="large"
                        placeholder={t("multiFormat.filters.status")}
                        options={statusOptions}
                        value={query.status}
                        onChange={(value) => changeFilter({ status: value })}
                    />
                </Col>

                <Col xs={24} md={12} lg={5}>
                    <DatePicker.RangePicker
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        presets={rangePresets}
                        value={query.range}
                        onChange={(value) => changeFilter({ range: value })}
                    />
                </Col>

                <Col xs={24} lg={3}>
                    <Button
                        block
                        icon={<ClearOutlined />}
                        disabled={!hasFilters}
                        onClick={clearFilters}
                    >
                        {t("multiFormat.filters.clear")}
                    </Button>
                </Col>
            </Row>

            <DefaultTable
                columns={columns}
                data={dataSource}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                    current: query.page,
                    pageSize: query.pageSize,
                    total: pagination.totalCount,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                }}
                onChange={(next) => setQuery((current) => ({
                    ...current,
                    page: next.pageSize !== current.pageSize ? 1 : next.current,
                    pageSize: next.pageSize,
                }))}
            />
        </>
    );
}
