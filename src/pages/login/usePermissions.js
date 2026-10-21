import { useContext, useMemo } from "react";
import { AuthContext } from "./AuthProvider";
import { getPermissions } from "../../utils/permissions";

export default function usePermissions() {
    const { auth } = useContext(AuthContext);

    return useMemo(() => getPermissions(auth?.user), [auth?.user]);
}
