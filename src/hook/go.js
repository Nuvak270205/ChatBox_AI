import { useNavigate, useParams } from "react-router-dom";

function useNavigateWithChatId() {
    const navigate = useNavigate();
    const { chatId } = useParams();

    function go(pathWithoutChatId) {
        const id = chatId;
        const newPath = pathWithoutChatId.endsWith("/")
            ? `${pathWithoutChatId}${id}`
            : `${pathWithoutChatId}/${id}`;
        navigate(newPath);
    }

    return go;
}
export default useNavigateWithChatId;