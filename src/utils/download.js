function triggerDownloadLink(url, fileName) {
    const link = document.createElement("a");
    link.href = url;
    if (fileName) {
        link.download = fileName;
    }

    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function triggerHiddenIframeDownload(url) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }, 15000);
}

function isCrossOriginUrl(url) {
    try {
        const resolvedUrl = new URL(url, window.location.href);
        return resolvedUrl.origin !== window.location.origin;
    } catch (error) {
        return true;
    }
}

function buildCloudinaryAttachmentUrl(url, fileName) {
    if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
        return url;
    }

    const [baseUrl, queryString] = url.split("?");
    const encodedFileName = encodeURIComponent(fileName || "download");

    if (baseUrl.includes("/upload/fl_attachment")) {
        return url;
    }

    const attachedBase = baseUrl.replace(
        "/upload/",
        `/upload/fl_attachment:${encodedFileName}/`
    );

    return queryString ? `${attachedBase}?${queryString}` : attachedBase;
}

function resolveFileNameFromHeader(contentDisposition, fallbackName) {
    if (!contentDisposition) {
        return fallbackName || "download";
    }

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]);
    }

    const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (basicMatch?.[1]) {
        return basicMatch[1];
    }

    return fallbackName || "download";
}

async function downloadFileFromUrl(url, fileName) {
    if (!url) {
        return false;
    }

    const normalizedFileName = fileName || "download";
    const attachmentUrl = buildCloudinaryAttachmentUrl(url, normalizedFileName);

    if (isCrossOriginUrl(attachmentUrl)) {
        triggerHiddenIframeDownload(attachmentUrl);
        return true;
    }

    try {
        const response = await fetch(attachmentUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error(`Download failed with status ${response.status}`);
        }

        const blob = await response.blob();
        const downloadName = resolveFileNameFromHeader(
            response.headers.get("content-disposition"),
            normalizedFileName
        );
        const blobUrl = URL.createObjectURL(blob);
        triggerDownloadLink(blobUrl, downloadName);
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 3000);
        return true;
    } catch (error) {
        triggerHiddenIframeDownload(attachmentUrl);
        return true;
    }
}

export { downloadFileFromUrl };