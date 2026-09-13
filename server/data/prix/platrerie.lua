local ok, mod = pcall(require, "scenes.prix.plâtrerie")
if ok and mod then
    return mod
end

local M = {}
M.metier = "Plâtrerie"
M.STRUCTURE = {
    id = "platrerie",
    nom = "Plâtrerie",
    type = "LOT",
    children = {}
}
return M