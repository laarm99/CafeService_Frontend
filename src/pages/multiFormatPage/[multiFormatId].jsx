import { useParams } from "react-router-dom";
import MultiFormatDetail from "../../components/multiFormat/components/MultiFormatDetail";

// Ruta: /multiFormat/:multiFormatId  -> vista informativa (solo lectura)
export default function MultiFormatDetailPage() {
    const { multiFormatId } = useParams();

    return <MultiFormatDetail id={multiFormatId} />;
}
