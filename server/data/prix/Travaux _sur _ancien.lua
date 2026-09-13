-- Redirect to the properly named file to maintain compatibility
local ok, mod = pcall(require, "scenes.prix.travaux_sur_ancien")
if ok and mod then
    return mod
else
    -- Fallback minimal module if the properly named file doesn't exist
    local M = {}
    M.metier = "Travaux sur ancien"
    M.STRUCTURE = {
        id = "travaux_sur_ancien",
        nom = "Travaux sur ancien",
        type = "LOT",
        children = {}
    }
    return M
end