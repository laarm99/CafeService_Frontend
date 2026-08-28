import { Result, Button, Typography } from "antd";

export default function ErrorFallback({ error, resetErrorBoundary }) {

    return (
        <Result
            status="500"
            title="Unhandled Runtime Error"
            subTitle={error.message}
            extra={[
                <Button
                    type="primary"
                    onClick={resetErrorBoundary}
                >
                    Reload
                </Button>
            ]}
        >
            <Typography.Paragraph
                copyable
                style={{
                    textAlign: "left",
                    maxHeight: 400,
                    overflow: "auto"
                }}
            >
                {error.stack}
            </Typography.Paragraph>
        </Result>
    );
}