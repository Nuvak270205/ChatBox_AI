import { useNavigate, useParams } from "react-router-dom";

function useNavigateWithChatId() {
    const navigate = useNavigate();
    const { chatId } = useParams();

    function go(pathWithoutChatId) {
        const normalizedPath = pathWithoutChatId.startsWith("/") ? pathWithoutChatId : `/${pathWithoutChatId}`;

        if (normalizedPath === "/dashboard") {
            navigate(normalizedPath);
            return;
        }

        if (!chatId) {
            navigate(normalizedPath);
            return;
        }

        const newPath = normalizedPath.endsWith("/")
            ? `${normalizedPath}${chatId}`
            : `${normalizedPath}/${chatId}`;
        navigate(newPath);
    }

    return go;
}
export default useNavigateWithChatId;