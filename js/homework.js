
function normalizePhone(p) {
    if (!p) return "";
    var clean = String(p).replace(/[^0-9]/g, "");
    if (clean.startsWith("84")) clean = "0" + clean.substring(2);
    return clean;
}
